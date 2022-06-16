import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { map } from "rxjs";

function getHeader() {
  let authentication;
  const { loginStage } = store;
  if (loginStage?.useAccessToken) {
    authentication = { ["app_token"]: loginStage.accessToken };
  }else {
    const b64 = btoa(`${loginStage?.username}:${loginStage?.password}`);
    authentication = { ["Authorization"]: `Basic ${b64}`}
  }
  return {
    "content-type": "application/json",
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
  export function getIssue$(issueKey: string){
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_issue.replace('{{issueKey}}', issueKey)}`,
      method: "GET",
      headers: getHeader()
    }).pipe(map((data: any)=> {
      const {response} = data;
      return {
        id: response.key,
        name: response.fields.summary
      }
    }))
  }
}
