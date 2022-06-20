<template>

</template>

<script setup lang="ts">
import { HistoryServices } from "@/services/HistoryServices";
HistoryServices.getAllWorklogsOfWeek().subscribe((data) => console.log(data));
</script>

<style scoped>

</style>
