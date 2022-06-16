<script setup lang="ts">
import type { Menu } from "../models/MenuInterface";
import { ref } from "vue";

const list = ref<Menu[]>([
  {
    label: "Logwork",
    icon: "pi pi-fw pi-user",
    to: "/logwork"
  },
  {
    label: "History",
    icon: "pi pi-fw pi-user",
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
</script>

<template>
  <TieredMenu :model="list" style="width: 130px;">
  </TieredMenu>
</template>

<style scoped lang="sass">
::v-deep span.p-menuitem-icon.pi.pi-fw.pi-circle-fill
  color: red !important

</style>
