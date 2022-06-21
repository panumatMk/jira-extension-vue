import { DateUtils, Ticket } from "@/Utils/Utils";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { Http } from "@/services/Header";
import moment from "moment";

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
    console.log("day", moment(date).day());
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
        return { worklogIds: worklogs.map((w: any) => w.id) };
      })
    );
  }

  function getWorklogsByDate(date: Date) {
    return getWorklogsIssuesByDate(date)
      .pipe(
        switchMap(({ issues }) => {
          if (issues.length > 0) {
            const queryList = issues.map((issue) => {
              return getWorklogs(issue.key, date)
                .pipe(
                  map(({ worklogIds }) => {
                    return worklogIds.map((worklogId) => (
                        {
                          ...issue,
                          worklogId
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

  function getAllDateOfWeek() {
    let allDateOfWeek = [];
    const weekDays = moment.weekdays();
    const firstDateOfWeek = moment().startOf("week");
    for (let i = 1; i < 6; i++) {
      allDateOfWeek.push({
        day: firstDateOfWeek.day(i).toDate(),
        dayOfWeek: weekDays[i]
      });
    }
    return allDateOfWeek;
  }
}