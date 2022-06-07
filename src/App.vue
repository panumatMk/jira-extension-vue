<script setup lang="ts">
import Menu from "./components/Menu.vue";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const path = computed(() => {
  if (route.fullPath === "/login") {
    return "Login";
  }
  return "";
});
</script>

<template>
  <div class="container">
    <Menu />
    <Card style="width: 500px;height: 400px">
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
  max-height: 400px

.container
  display: flex
  gap: 10px
</style>
