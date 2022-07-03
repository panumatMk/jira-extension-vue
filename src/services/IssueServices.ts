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
