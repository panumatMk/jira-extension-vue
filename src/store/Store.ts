import { reactive } from "vue";
import type { LoginStage } from "@/models/StageInterface";

interface AppStage {
  loginStage?: LoginStage;
}

export const loginStage: LoginStage = {
  host: "",
  username: "",
  password: "",
  accessToken: ""
};

const initState: AppStage = {
  loginStage
};

export const store = reactive<AppStage>(initState);



