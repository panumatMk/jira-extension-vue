import { watchEffect } from "vue";
import { store } from "@/store/Store";
import type { LoginStage } from "@/models/StageInterface";

watchEffect(() => {
  console.log(store.loginStage);
});

export namespace LoginAction {
  export const updateStage = (data: LoginStage) => {
    store.loginStage = data;
  };
}
