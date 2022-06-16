import type { AppStage, LoginStage } from "@/models/StageInterface";
import { reactive, toRef } from "vue";
import { from } from "@vueuse/rxjs";
import { Observable } from "rxjs";

export const loginStage: LoginStage = {
  host: "",
  username: "",
  password: "",
  accessToken: "",
  useAccessToken: false,
  online: false
};

const initState: AppStage = {
  loginStage
};

export const store = reactive<AppStage>(initState);


// transform to Observable
export function useStoreObservable<T extends keyof AppStage>(key: T): Observable<any> {
  const stageRef = toRef(store, key);
  const stageRef$ = from(stageRef);
  return stageRef$;
}



