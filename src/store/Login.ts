import { store, useStoreObservable } from "@/store/Store";
import type { LoginStage } from "@/models/StageInterface";
import { switchMap } from "rxjs";
import { useSetLocalStorage } from "@/google/Google";

export namespace LoginAction {
  export const updateStage = (data: LoginStage) => {
    store.loginStage = data;
  };

  export const updateUseAccessToken = (use: boolean) => {
    store.loginStage = {
      ...store.loginStage,
      useAccessToken: use
    };
  };

  export const updateOnline = (online: boolean) => {
    store.loginStage = {
      ...store.loginStage,
      online
    };
    if (online) {
      useSetLocalStorage({ loginStage: store.loginStage });
    } else {
      useSetLocalStorage({
        loginStage: {
          ...store.loginStage,
          online: undefined
        }
      });
    }
  };
}

useStoreObservable("loginStage")
  .pipe(switchMap((value) => {
    return useSetLocalStorage({ loginStage: value });
  }))
  .subscribe();


