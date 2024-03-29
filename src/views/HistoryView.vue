<template>
  <span style="position: relative" v-if="isLoading">
  <ProgressSpinner class="spinner" strokeWidth="3" fill="var(--surface-ground)"
                   animationDuration=".5s" />
  </span>
  <span style="position: relative" v-if="isLoading === undefined">
    <h1 style="position: absolute;width: 150px;top: 110px;left: 180px;"> Not found </h1>
  </span>
<!--  :page="currentPage"-->
  <Carousel :value="issues" :numVisible="1" :numScroll="1" v-if="isLoading === false && issues">
    <template #item="issue">
      <Fieldset :legend="issue.data.header" style="height: 330px;">
        <template v-for="(worklog, index) in issue.data.worklogs">
          <Divider align="left" type="dashed" v-if="index !== 0" />
          <span>
            [<a :href="host+'/browse/'+worklog.key" target="_blank" style="color: white">{{ worklog.key }}</a>]
            {{ worklog.summary }}
            <span class="worklog-detail"> {{ worklog.timeSpent }} {{ worklog.comment }}</span>
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="removeWorklog(worklog.key, worklog.worklogId, issue.index)" />
          </span>
        </template>
      </Fieldset>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef } from "vue";
import { SweetAlert } from "@/Utils/Utils";
import { WorklogServices } from "@/services/WorklogServices";
import { debounceTime } from "rxjs";
import { store } from "@/store/Store";

const isLoading = ref(true);
const issues = ref([]);
const currentPage = ref((new Date()).getDay() - 1);
const host = toRef(store.loginStage, "host");
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

.worklog-detail {
  display: inline-block;
  font-size: 12px;
  padding: 2px;
  border-radius: 5px;
  border: 1px solid #222832;
  background-color: #222832;
}
</style>
