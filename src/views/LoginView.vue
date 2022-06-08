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

import { ref, watchEffect } from "vue";
import { LoginAction } from "@/store/Login";
import { useStoreObservable } from "@/store/Store";
import { of, switchMap, take, timer } from "rxjs";
import type { LoginStage } from "@/models/StageInterface";

const host = ref("");
const username = ref("");
const password = ref("");
const accessToken = ref("");
const useAccessToken = ref(false);
const onlineStatus = ref(false);

let testConnectionBtn = ref();

useStoreObservable("loginStage")
  .pipe(
    take(2),
    switchMap(value => of(value))
  )
  .subscribe((value) => {
    console.log(value);
  });

watchEffect((onCleanup) => {
  const loginStage: LoginStage = {
    host: host.value,
    username: username.value,
    password: password.value,
    accessToken: accessToken.value,
    useAccessToken: useAccessToken.value,
    online: onlineStatus.value
  };

  const subscription = timer(500)
    .subscribe(() => LoginAction.updateStage(loginStage));

  onCleanup(() => {
    subscription.unsubscribe();
  });
});

const setUseAccessToken = (use: boolean) => {
  useAccessToken.value = use;
};

const testConnection = () => {
  const currentClassName = testConnectionBtn.value.$el.children[0].className;
  testConnectionBtn.value.$el.children[0].className = currentClassName + ' pi-spin';

  timer(2000).subscribe(() => {
    onlineStatus.value = true
    testConnectionBtn.value.$el.children[0].className = currentClassName;
  });
};


</script>

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
