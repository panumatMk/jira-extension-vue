export interface LoginStage {
  host?: string,
  username?: string,
  password?: string,
  accessToken?: string,
  useAccessToken?: boolean
  online?: boolean
}

export interface AppStage {
  loginStage?: LoginStage;
}
