<script setup lang="ts">
import Menu from "./components/Menu.vue";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import router from "@/router";
import { store } from "@/store/Store";

const route = useRoute();

if (store.loginStage?.online) {
  router.push("/login");
}else{
  router.push("/logwork");
}

const path = computed(() => {
  switch (route.fullPath) {
    case "/login":
      return "Login";
    case "/logwork":
      return "Logwork";
    case "/history":
      return "History";
    default:
      return "";
  }
});
</script>

<template>
  <div class="container">
    <Menu />
    <Card class="card">
      <template #content>
        <h3 style="margin-top: 0px">{{ path }}</h3>
        <RouterView />
      </template>
    </Card>
  </div>
</template>

<style lang="sass">
body
  background-color: rgb(32 38 46 / 8)

.card
  width: 550px
  height: 470px

.container
  display: flex
  gap: 10px
</style>
