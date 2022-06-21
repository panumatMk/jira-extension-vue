<template>
  <Carousel :value="issues" :numVisible="1" :numScroll="1" :page="currentPage">
    <template #item="issue">
      <Fieldset :legend="issue.data.header" style="height: 330px;">
        <template v-for="(worklog, index) in issue.data.worklogs">
          <Divider align="left" type="dashed" v-if="index !== 0" />
          <p> [{{ worklog.key }}] {{ worklog.summary }}
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="removeWorklog(worklog.key, worklog.worklogId, issue.index)" />
          </p>
        </template>
      </Fieldset>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SweetAlert } from "@/Utils/Utils";
import { WorklogServices } from "@/services/WorklogServices";

const issues = ref([]);
const currentPage = ref((new Date()).getDay() - 2);
onMounted(() => {
  WorklogServices.getAllWorklogsOfWeek()
    .subscribe({
      next: (data) => {
        issues.value = Object.keys(data).map((key) => {
          return {
            header: key,
            worklogs: data[key]
          };
        });
      },
      error: (err) => SweetAlert.error(err.status, err?.response?.errorMessages[0])
    });
});

function removeWorklog(issueKey: string, id: string, index: number) {
  WorklogServices.removeWorklog$(issueKey, id)
    .subscribe({
      next: () => {
        SweetAlert.success();
        const worklogs = issues.value[index]?.worklogs?.filter((w: any) => w.worklogId !== id);
        issues.value[index] = {
          ...issues.value[index],
          worklogs
        };
      },
      error: (err) => SweetAlert.error(err.status, err?.response?.errorMessages[0])
    });
}

</script>

<style lang="scss" scoped>
.p-button.p-button-rounded.p-button-danger.p-button-text {
  width: 1.3rem;
  height: 1.3rem;
}
</style>
