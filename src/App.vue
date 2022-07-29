<script setup lang="ts">
import Menu from "./components/Menu.vue";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import router from "@/router";
import { useStoreBehaviorSubject } from "@/store/Store";
import type { AppStage, LoginStage } from "@/models/StageInterface";
import { catchError, debounceTime, EMPTY, switchMap, take } from "rxjs";
import { Service } from "@/services/Service";

const route = useRoute();
const key: keyof AppStage = "loginStage";
useStoreBehaviorSubject<"loginStage", LoginStage>(key)
  .pipe(
    debounceTime(200),
    take(1),
    switchMap((loginStage: any) => {
      if (!loginStage?.host || !loginStage?.online) {
        router.push("/login");
        return EMPTY;
      } else {
        router.push("/logwork");
        return Service.testConnection$()
          .pipe(
            catchError(() => {
              router.push("/login");
              return EMPTY;
            })
          );
      }
    })
  )
  .subscribe();

const path = computed(() => {
  switch (route.fullPath) {
    case "/login":
      return "Login";
    case "/logwork":
      return "Logwork";
    case "/assignToMe":
      return "Logwork (Assign To Me)";
    case "/history":
    case  "/history/v2":
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
