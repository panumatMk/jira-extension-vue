<template>
  <Carousel :value="issues" :numVisible="1" :numScroll="1" :page="currentPage">
    <template #item="{data}">
      <Fieldset :legend="data.header" style="height: 330px;">
        <template v-for="(worklog, index) in data.worklogs">
          <Divider align="left" type="dashed" v-if="index !== 0"/>
          <p> [{{ worklog.key }}] {{ worklog.summary }}</p>
        </template>
      </Fieldset>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { HistoryServices } from "@/services/HistoryServices";

const issues = ref([]);
const currentPage = ref(0);
// issues.value = [
//   {
//     header: "M",
//     worklogs: [{ key: 123, summary: "ertertret" }]
//   },
//   { header: "E" },
//   { header: 3 },
//   { header: 3 },
//   { header: 3 }
// ];
onMounted(() => {
  HistoryServices.getAllWorklogsOfWeek().subscribe((data) => {
    issues.value = Object.keys(data).map((key) => {
      return {
        header: key,
        worklogs: data[key]
      };
    });
  });
});

</script>

<style lang="scss" scoped>
</style>
