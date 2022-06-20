<script setup lang="ts">
import type { Menu } from "../models/MenuInterface";
import { onMounted, ref } from "vue";
import { useStoreBehaviorSubject } from "@/store/Store";
import type { AppStage, LoginStage } from "@/models/StageInterface";

const list = ref<Menu[]>([
  {
    label: "Logwork",
    icon: "pi pi-fw pi-user",
    to: "/logwork"
  },
  {
    label: "History",
    icon: "pi pi-fw pi-history",
    to: "/history"
  },
  {
    separator: true
  },
  {
    label: "Login",
    icon: "pi pi-fw pi-circle-fill",
    to: "/login"
  }
]);

const key: keyof AppStage = "loginStage";

onMounted(() => {
  useStoreBehaviorSubject<"loginStage", LoginStage>(key)
    .subscribe((loginStage: any) => {
      let color;
      if (loginStage?.online === undefined) {
        color = "rgba(255, 255, 255, 0.6)";
      } else if (loginStage?.online) {
        color = "rgb(0 255 0 / 80%)";
      } else {
        color = "rgb(255 0 0 / 80%)";
      }

      console.log("online", color);
      document.querySelector("a[href='/login'] > span").style.color = color;
    });
});


</script>

<template>
  <TieredMenu :model="list" style="width: 130px;">
  </TieredMenu>
</template>

<style scoped lang="sass">

</style>
