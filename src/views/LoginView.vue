<template>
  <div class="main-container">
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
          <i class="pi pi-cloud"></i>
      </span>
      <InputText placeholder="Host" v-model="host" />
    </div>
    <div>
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
      <Divider align="center" type="dashed">
        <b>OR</b>
      </Divider>
      <div style="display: flex;gap: 10px;flex-direction: column;">
        <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
          <i class="pi pi-lock"></i>
      </span>
          <InputText placeholder="Token" v-model="accessToken" />
        </div>
      </div>
    </div>
    <div style="display: flex;gap: 15px;">
      <Button label="Save" icon="pi pi-save" class="p-button p-button-raised p-button-secondary" />
      <Button label="Test Connection" icon="pi pi-sync pi-spin" class="p-button p-button-raised p-button-primary" />
    </div>
  </div>
</template>

<script setup type="ts">

import { ref, watchEffect } from "vue";
import { LoginAction } from "@/store/Login";

const host = ref("");
const username = ref("");
const password = ref("");
const accessToken = ref("");

const useAccessToke = ref(false);

watchEffect(() => {
  const loginStage = {
    host: host.value,
    username: username.value,
    password: password.value,
    accessToken: accessToken.value
  };

  LoginAction.updateStage(loginStage);
});
</script>

<style scoped lang="sass">
.container
  display: flex
  gap: 10px

.main-container
  display: flex
  flex-direction: column
  gap: 20px

</style>
