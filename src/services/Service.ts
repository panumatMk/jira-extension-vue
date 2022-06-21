import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";
import { switchMap, tap } from "rxjs";
import { UserServices } from "@/services/UserServices";
import { Http } from "@/services/Header";

export namespace Service {
  export function testConnection$() {
    const { loginStage } = store;
    return ajax({
      url: `${loginStage?.host}/${jiraUrl.get_all_dashboard}`,
      method: "GET",
      headers: Http.getHeader()
    })
      .pipe(
        switchMap(() => UserServices.getCurrentUser()
          .pipe(
            tap(({ response }) => {
              console.log("testConnection$", response);
              store.mySelf.name = response?.name;
            })
          )
        )
      );
  }
}
