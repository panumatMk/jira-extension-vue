import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { map } from "rxjs";
import { Http } from "@/services/Header";

export namespace UserServices {
  export function getCurrentUser() {
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_myself}`,
      method: "GET",
      headers: Http.getHeader()
    }).pipe((map(data => ({ response: data.response }))));
  }
}