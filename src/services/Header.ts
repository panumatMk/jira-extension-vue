import { store } from "@/store/Store";

export namespace Http {
  export function getHeader() {
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
}
