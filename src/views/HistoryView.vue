<template>
  <Carousel :value="issues" :numVisible="1" :numScroll="1" :page="currentPage">
    <template #item="{data}">
      <Fieldset :legend="data.header" style="height: 330px;">
        <template v-for="(worklog, index) in data.worklogs">
          <Divider align="left" type="dashed" v-if="index !== 0" />
          <p> [{{ worklog.key }}] {{ worklog.summary }}
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" />
          </p>
        </template>
      </Fieldset>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { HistoryServices } from "@/services/HistoryServices";
import { SweetAlert } from "@/Utils/Utils";

const issues = ref([]);
const currentPage = ref((new Date()).getDay() - 2);
onMounted(() => {
  HistoryServices.getAllWorklogsOfWeek()
    .subscribe({
      next: (data) => {
        issues.value = Object.keys(data).map((key) => {
          return {
            header: key,
            worklogs: data[key]
          };
        });
      },
      error: (err) => {
        SweetAlert.error();
      }
    });
});

</script>

<style lang="scss" scoped>
.p-button.p-button-rounded.p-button-danger.p-button-text {
  width: 1.3rem;
  height: 1.3rem;
}
</style>
