<template>
  <div class="main-container">
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
          <i class="pi pi-cloud"></i>
      </span>
      <InputText placeholder="Host" v-model="host" />
    </div>
    <Card id="basicAuthen"
          v-bind:class="{ 'focus': !useAccessToken }"
          @click="setUseAccessToken(false)">
      <template #content>
        <div class="container">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-user"></i>
            </span>
            <InputText placeholder="Username" v-model="username" />
          </div>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-lock"></i>
            </span>
            <InputText placeholder="Password" v-model="password" type="password" />
          </div>
        </div>
      </template>
    </Card>
    <Divider align="center" type="dashed" style="margin: 0px">
      <b>OR</b>
    </Divider>
    <Card id="tokenAuthen"
          v-bind:class="{ 'focus': useAccessToken }"
          @click="setUseAccessToken(true)">
      <template #content>
        <div style="display: flex;gap: 10px;flex-direction: column;">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-lock"></i>
            </span>
            <InputText placeholder="Token" v-model="accessToken" />
          </div>
        </div>
      </template>
    </Card>
    <div style="margin: 10px 0px">
      <Button label="Test Connection"
              icon="pi pi-sync"
              ref="testConnectionBtn"
              class="p-button p-button-raised p-button-primary"
              @click="testConnection()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref } from "vue";
import { LoginAction } from "@/store/Login";
import { debounceTime, map, merge, ReplaySubject, switchMap, take, takeUntil, timer } from "rxjs";
import type { AppStage, LoginStage } from "@/models/StageInterface";
import { from } from "@vueuse/rxjs";
import { Service } from "@/services/Service";
import { useStoreBehaviorSubject, useStoreObservable } from "@/store/Store";
import { SweetAlert } from "@/Utils/Utils";

const host = ref("");
const username = ref("");
const password = ref("");
const accessToken = ref("");
const useAccessToken = ref(false);
const onlineStatus = ref(false);
let testConnectionBtn = ref();
const destroy$ = new ReplaySubject<void>();

onMounted(() => {
  const key: keyof AppStage = "loginStage";
  useStoreBehaviorSubject<"loginStage", LoginStage>(key)
    .subscribe((loginStage: any) => {
      host.value = loginStage?.host;
      username.value = loginStage?.username;
      password.value = loginStage?.password;
      accessToken.value = loginStage?.accessToken;
      useAccessToken.value = loginStage?.useAccessToken;
      onlineStatus.value = loginStage?.online;
    });
});

onUnmounted(() => {
  destroy$.next();
  destroy$.complete();
});

merge(from(host), from(username), from(password), from(accessToken))
  .pipe(
    switchMap(data => timer(500).pipe(map(() => data))),
    takeUntil(destroy$)
  )
  .subscribe(() => {
    const loginStage: LoginStage = {
      host: host.value,
      username: username.value,
      password: password.value,
      accessToken: accessToken.value,
      useAccessToken: useAccessToken.value,
      online: onlineStatus.value
    };
    LoginAction.updateStage(loginStage);
  });

const setUseAccessToken = (use: boolean) => {
  useAccessToken.value = use;
  LoginAction.updateUseAccessToken(use);
};

const testConnection = () => {
  const currentClassName = testConnectionBtn.value.$el.children[0].className;
  testConnectionBtn.value.$el.children[0].className = currentClassName + " pi-spin";

  Service.testConnection$()
    .pipe(
      take(1),
      debounceTime(1000)
    ).subscribe({
    next: () => {
      SweetAlert.success();
      onlineStatus.value = true;
      testConnectionBtn.value.$el.children[0].className = currentClassName;
      LoginAction.updateOnline(true);
    }, error: (err) => {
      SweetAlert.error(err.status);
      onlineStatus.value = false;
      testConnectionBtn.value.$el.children[0].className = currentClassName;
      LoginAction.updateOnline(false);
    }
  });
};


</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700&family=Poppins:wght@300&display=swap')
.swal2-popup
  background-color: #2a323d

.swal2-title
  font-family: 'Kanit', sans-serif
  font-family: 'Poppins', sans-serif
  color: white
</style>

<style scoped lang="sass">
.container
  display: flex
  gap: 10px

.main-container
  display: flex
  flex-direction: column
  gap: 10px

::v-deep .p-card .p-card-body
  padding: 5px 20px

::v-deep
  #basicAuthen.focus, #tokenAuthen.focus
    &.p-card
      background: #20262e

#basicAuthen, #tokenAuthen
  cursor: pointer

</style>
