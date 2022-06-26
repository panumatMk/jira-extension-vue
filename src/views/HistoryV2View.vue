<template>
  <span style="position: relative" v-if="isLoading">
  <ProgressSpinner class="spinner" strokeWidth="3" fill="var(--surface-ground)"
                   animationDuration=".5s" />
  </span>
  <span style="position: relative" v-if="isLoading === undefined">
      <h1 style="position: absolute;width: 150px;top: 110px;left: 180px;"> Not found </h1>
    </span>
  <div style="display: flex; gap: 10px;align-items: center;">
    <h4 style="margin: 0"> Period </h4>
    <Calendar style="width: 220px;" id="range"
              v-model="rangeDate" selectionMode="range" :manualInput="false"
              dateFormat="dd/mm/yy" />
    <Button icon="pi pi-search" class="p-button-rounded p-button-success" @click="updateHistoriesRange()" />
  </div>
  <div class="history-container" v-if="isLoading === false">
    <template v-for="issue in issues">
      <Fieldset :legend="issue.header">
        <template v-for="(worklog, index) in issue.worklogs">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef } from "vue";
import { WorklogServices } from "@/services/WorklogServices";
import { store } from "@/store/Store";
import { catchError, finalize, NEVER, Subject, switchMap } from "rxjs";
import { SweetAlert } from "@/Utils/Utils";

const isLoading = ref(true);
const rangeDate = ref([]);
const issues = ref<Date[]>();
const host = toRef(store.loginStage, "host");
const firstDay = new Date();
const today = new Date();
firstDay.setDate(today.getDate() - 7);
rangeDate.value = [firstDay, today];

const getWorklogHistories$ = new Subject<void>();
getWorklogHistories$
  .pipe(
    switchMap(() => {
        isLoading.value = true;
        const currentRange = JSON.parse(JSON.stringify(rangeDate.value));
        return WorklogServices.getWorklogHistoryRangeDate(firstDay, today)
          .pipe(
            catchError((err) => {
              SweetAlert.error(err.status, err?.response?.errorMessages[0]);
              isLoading.value = undefined;
              return NEVER;
            }),
            finalize(() => {
              rangeDate.value = [new Date(currentRange[0]), currentRange[1] ? new Date(currentRange[1]) : null];
              console.log(rangeDate.value);
            })
          );
      }
    )
  )
  .subscribe({
    next: (data) => {
      issues.value = Object.keys(data).map((key) => {
        return {
          header: key,
          worklogs: data[key]
        };
      }).reverse();
      isLoading.value = false;
    }
  });

onMounted(() => {
  getWorklogHistories$.next();
});

function updateHistoriesRange() {
  getWorklogHistories$.next();
}

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

.history-container {
  height: 300px;
  overflow: auto;
  margin: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

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
