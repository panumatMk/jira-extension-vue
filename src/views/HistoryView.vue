<template>

</template>

<script setup lang="ts">
import { HistoryServices } from "@/services/HistoryServices";

HistoryServices.getAllWorklog().subscribe((data) => console.log(data));
</script>

<style scoped>

</style>
