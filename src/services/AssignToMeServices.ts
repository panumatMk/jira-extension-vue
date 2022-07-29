import { map, Observable } from "rxjs";
import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { Http } from "@/services/Header";

export interface SearchWorklog {
  key: string,
  link: string,
  summary: string,
  status: string,
  timeSpent?: string,
  comment?: string
  parent?: SearchWorklog
}

export namespace AssignToMeServices {
  export function getWorklogsIssuesAssignToCurrentUser(): Observable<any> {
    const { loginStage } = store;
    const jql = `jql=status in (Open, "In Progress", Testing, "In Review") AND assignee in (currentUser()) ORDER BY created DESC &fields=parent,issuetype,status,summary`;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_search}?${jql}`,
      method: "GET",
      headers: Http.getHeader()
    }).pipe(
      map(result => {
        const { response } = result;
        return (response as any)?.issues?.map((issue: any) => {
          return {
            key: issue?.key,
            link: issue?.self,
            summary: issue?.fields?.summary,
            status: issue?.fields?.status?.name,
            parent: {
              key: issue?.fields?.parent?.key,
              summary: issue?.fields?.parent?.summary,
              link: issue?.fields?.parent?.self
            }
          }
        });
      })
    );
  }
}