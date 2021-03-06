import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { Http } from "@/services/Header";
import moment from "moment";
import type { Ticket } from "@/Utils/Utils";
import { DateUtils } from "@/Utils/Utils";

interface Issue {
  key: string;
  summary: string;
  worklogId?: string[];
  date?: string;
  dayOfWeek: number;
}

export namespace WorklogServices {
  export function addWorklogs$(data: Ticket, started: string[]) {
    const addLogs$ = started.map(date => {
      return addWorklog$(data, date);
    });
    return forkJoin(addLogs$);
  }

  export function addWorklog$(data: Ticket, started: string) {
    const { loginStage } = store;
    const payload = {
      comment: data.comment.replace(DateUtils.DATE_VAR, DateUtils.getCommentDate(started)),
      timeSpent: data.timeSpent,
      started
    };
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.post_worklog(data.id)}`,
      method: "POST",
      headers: Http.getHeader(),
      body: payload
    }).pipe(map((data: any) => {
      const { response } = data;
      return response;
    }));
  }

  export function editWorklog$(issueKey: string, data: Ticket, started: string) {
    const { loginStage } = store;
    const payload = {
      comment: data.comment,
      timeSpent: data.timeSpent,
      started
    };
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.update_worklog(issueKey, data.id)}`,
      method: "PUT",
      headers: Http.getHeader(),
      body: payload
    }).pipe(map((data: any) => {
      const { response } = data;
      return response;
    }));
  }

  export function removeWorklog$(issueKey: string, id: string) {
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.delete_worklog(issueKey, id)}`,
      method: "DELETE",
      headers: Http.getHeader()
    }).pipe(map((data: any) => {
      const { response } = data;
      return response;
    }));
  }

  function getWorklogsIssuesByDate(date: Date): Observable<{ issues: Issue[] }> {
    const dateString = moment(date).format("YYYY/MM/DD");
    const { loginStage } = store;
    const jql = `jql=worklogDate = '${dateString}' AND worklogAuthor = currentUser()`;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_search}?${jql}`,
      method: "GET",
      headers: Http.getHeader()
    }).pipe(
      map(result => {
        const { response } = result;
        return {
          issues: (response as any)?.issues?.map((issue: any) => ({
            key: issue.key,
            summary: issue.fields.summary,
            date: date
          }))
        };
      })
    );
  }

  function getWorklogs(issueKey: string, date: Date) {
    const dateString = moment(date).format("YYYY/MM/DD");
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_worklog(issueKey)}`,
      method: "GET",
      headers: Http.getHeader()
    }).pipe(
      map(result => {
          const { response } = result;
          const worklogs = (response as any)?.worklogs?.filter((worklog: any) => {
            const startedDate = moment(new Date(worklog.started)).format("YYYY/MM/DD");
            return dateString === startedDate && worklog.updateAuthor.name === store.mySelf?.name;
          });
          return {
            worklogs: worklogs.map(({ id, timeSpent, comment, started }) => ({ worklogId: id, timeSpent, comment, started }))
          };
        }
      )
    )
      ;
  }

  function getWorklogsByDate(date: Date) {
    return getWorklogsIssuesByDate(date)
      .pipe(
        switchMap(({ issues }) => {
          if (issues.length > 0) {
            const queryList = issues.map((issue) => {
              return getWorklogs(issue.key, date)
                .pipe(
                  map(({ worklogs }) => {
                    return worklogs.map((worklog) => (
                        {
                          ...issue,
                          ...worklog
                        }
                      )
                    );
                  })
                );
            });
            return forkJoin(queryList);
          }
          return of([]);
        }),
        map((arr) => {
          return arr.flat(2);
        })
      );
  }

  export function getAllWorklogsOfWeek() {
    const dates = getAllDateOfWeek();
    const list = dates.reduce((total, date) => {
      return {
        ...total,
        [date.dayOfWeek]: getWorklogsByDate(date.day)
      };
    }, {});
    return forkJoin(list);
  }

  export function getDaysArray(start: Date, end?: Date) {
    if (end) {
      const arr = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        arr.push({
          day: new Date(d),
          dayOfWeek: new Date(d).getDay()
        });
      }
      return arr;
    }
    return [{
      day: new Date(start),
      dayOfWeek: new Date(start).getDay()
    }];
  };

  export function getWorklogHistoryRangeDate(startDate: Date, endDate?: Date) {
    const dates = getDaysArray(startDate, endDate);
    const weekDays = moment.weekdays();
    const list = dates.reduce((total, date) => {
      return {
        ...total,
        [`${weekDays[date.dayOfWeek]} ${moment(date.day).format("DD/MM/YYYY")}`]: getWorklogsByDate(date.day)
      };
    }, {});
    return forkJoin(list);
  }

  function getAllDateOfWeek() {
    let allDateOfWeek = [];
    const weekDays = moment.weekdays();
    const firstDateOfWeek = moment().startOf("week");
    for (let i = 0; i < 7; i++) {
      const nowDate = moment(firstDateOfWeek.day(i).toDate()).format("DD/MM/YYYY");
      allDateOfWeek.push({
        day: firstDateOfWeek.day(i).toDate(),
        dayOfWeek: `${weekDays[i]} ${nowDate}`
      });
    }
    return allDateOfWeek;
  }
}
