import type { AppStage, LoginStage } from "@/models/StageInterface";
import { reactive, toRef } from "vue";
import { from } from "@vueuse/rxjs";

export const loginStage: LoginStage = {
  host: "",
  username: "",
  password: "",
  accessToken: "",
  useAccessToken: undefined,
  online: undefined
};

const initState: AppStage = {
  loginStage
};

export const store = reactive<AppStage>(initState);


// transform to Observable
export function useStoreObservable<T extends keyof AppStage>(key: T) {
  const stageRef = toRef(store, key);
  const stageRef$ = from(stageRef);
  return stageRef$;
}



