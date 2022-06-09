import { store } from "@/store/Store";
import { ajax } from "rxjs/ajax";
import { jiraUrl } from "@/services/env";

function getHeader() {
  let authentication;
  const { loginStage } = store;
  if (loginStage?.useAccessToken) {
    authentication = { ["api_token"]: loginStage.accessToken };
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
      url: `${loginStage?.host}/${jiraUrl.get_search}`,
      method: "POST",
      headers: getHeader()
    });
  }
}
