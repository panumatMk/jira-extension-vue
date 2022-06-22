<template>
  <span style="position: relative" v-if="isLoading">
  <ProgressSpinner class="spinner" strokeWidth="3" fill="var(--surface-ground)"
                   animationDuration=".5s" />
  </span>
  <span style="position: relative" v-if="isLoading === undefined">
    <h1 style="position: absolute;width: 150px;top: 110px;left: 180px;"> Not found </h1>
  </span>
  <Carousel :value="issues" :numVisible="1" :numScroll="1" :page="currentPage" v-if="isLoading === false">
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
import { debounceTime } from "rxjs";

const isLoading = ref(true);
const issues = ref([]);
const currentPage = ref((new Date()).getDay() - 1);
onMounted(() => {
  WorklogServices.getAllWorklogsOfWeek()
    .pipe(debounceTime(2000))
    .subscribe({
      next: (data) => {
        issues.value = Object.keys(data).map((key) => {
          return {
            header: key,
            worklogs: data[key]
          };
        });
        isLoading.value = false;
      },
      error: (err) => {
        SweetAlert.error(err.status, err?.response?.errorMessages[0]);
        isLoading.value = undefined;
      }
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

.spinner {
  width: 260px;
  height: 260px;
  position: absolute;
  top: 40px;
  left: 120px;
}
</style>
