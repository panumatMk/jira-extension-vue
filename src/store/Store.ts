import type { AppStage, LoginStage } from "@/models/StageInterface";
import { reactive, toRef } from "vue";
import { from } from "@vueuse/rxjs";
import { BehaviorSubject, Observable, take } from "rxjs";
import { useGetLocalStorage } from "@/google/Google";

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
export function useStoreObservable<T extends keyof AppStage, R>(key: T): Observable<R> {
  const stageRef = toRef(store, key);
  const stageRef$ = from(stageRef);
  return stageRef$ as Observable<R>;
}

export function useStoreBehaviorSubject<T extends keyof AppStage, R>(key: T){
  const subject = new BehaviorSubject(store.loginStage);
  useStoreObservable(key).subscribe((data: any) => {
    subject.next(data);
  });
  return subject;
}

const key: keyof AppStage = "loginStage";
useGetLocalStorage([key])
  .subscribe((stage: any) => {
    console.log('useGetLocalStorage', stage);
    const loginStage: Required<LoginStage> = stage?.loginStage;
    store.loginStage = loginStage;
  });



