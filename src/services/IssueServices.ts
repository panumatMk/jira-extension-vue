import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { Http } from "@/services/Header";
import { map, of } from "rxjs";

export namespace IssueServices {
  export function getIssue$(issueKey: string) {
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_issue(issueKey)}?fields=key,summary`,
      method: "GET",
      headers: Http.getHeader()
    }).pipe(map((data: any) => {
      const { response } = data;
      return {
        id: response.key,
        summary: response.fields.summary
      };
    }));
  }
}

// filter=11870&jql=project%20%3D%20BO%20AND%20issuetype%20in%20subTaskIssueTypes()%20AND%20status%20in%20(Open%2C%20"In%20Progress")%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20created%20DESC
