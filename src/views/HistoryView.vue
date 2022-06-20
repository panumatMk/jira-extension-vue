<template>

</template>

<script setup lang="ts">

import { getAllWorklog } from "@/services/Service";

getAllWorklog().subscribe((data) => console.log(data));
</script>

<style scoped>

</style>
