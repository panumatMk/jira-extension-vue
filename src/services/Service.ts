import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { forkJoin, map, of } from "rxjs";
import type { Ticket } from "@/Utils/Utils";
import { DateUtils } from "@/Utils/Utils";

function getHeader() {
  let authentication;
  const { loginStage } = store;
  if (loginStage?.useAccessToken) {
    authentication = { ["app_token"]: loginStage.accessToken };
  } else {
    const b64 = btoa(`${loginStage?.username}:${loginStage?.password}`);
    authentication = { ["Authorization"]: `Basic ${b64}` };
  }
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    ...authentication
  };
}

export namespace Service {
  export function testConnection$() {
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_all_dashboard}`,
      method: "GET",
      headers: getHeader()
    });
  }

  export function getIssue$(issueKey: string) {
    const { loginStage } = store;
    // return of({ id: issueKey, summary: "sdfdfgtryrtury" });
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_issue.replace('{{issueKey}}', issueKey)}`,
      method: "GET",
      headers: getHeader()
    }).pipe(map((data: any)=> {
      const {response} = data;
      return {
        id: response.key,
        summary: response.fields.summary
      }
    }))
  }

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
      url: `${loginStage?.host}/${jiraUrl.post_worklog.replace("{{issueKey}}", data.id)}`,
      method: "POST",
      headers: getHeader(),
      body: payload
    }).pipe(map((data: any) => {
      const { response } = data;
      return response;
    }));
  }
}
