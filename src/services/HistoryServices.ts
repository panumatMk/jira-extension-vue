import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import moment from "moment";
import { getHeader } from "@/services/Service";

export namespace HistoryServices {
  interface Issue {
    key: string;
    summary: string;
    worklogId?: string[];
    date?: string;
    dayOfWeek: number;
  }

  function getWorklogsIssuesByDate(date: Date): Observable<{ issues: Issue[] }> {
    console.log('day', moment(date).day());
    const dateString = moment(date).format("YYYY/MM/DD")
    const { loginStage } = store;
    const jql = `jql=worklogDate = '${dateString}' AND worklogAuthor = currentUser()`;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_search}?${jql}`,
      method: "GET",
      headers: getHeader()
    }).pipe(
      map(result => {
        const { response } = result;
        return {
          issues: (response as any)?.issues?.map((issue: any) => ({
            key: issue.key,
            summary: issue.fields.summary,
            date: date,
          }))
        };
      })
    );
  }

  function getWorklogs(issueKey: string, date: Date) {
    const dateString = moment(date).format("YYYY/MM/DD")
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_worklog.replace("{{issueKey}}", issueKey)}`,
      method: "GET",
      headers: getHeader()
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

  export function getAllWorklog() {
    const currentDate = new Date();
    return getWorklogsIssuesByDate(currentDate)
      .pipe(
        switchMap(({ issues }) => {
          if (issues.length > 0) {
            const queryList = issues.map((issue) => {
              return getWorklogs(issue.key, currentDate)
                .pipe(
                  map(({ worklogIds }) => {
                    return worklogIds.map((worklogId) => ({ ...issue, worklogId }));
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
}