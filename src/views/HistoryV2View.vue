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
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success p-button-text"
              @click="openEditModal(worklog)" />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="removeWorklog(worklog.key, worklog.worklogId, issue.index)" />
          </span>
        </template>
      </Fieldset>
    </template>
  </div>

  <Dialog header="Add" v-model:visible="openEditDialog"
          :closable="false"
          :style="{width: '400px'}" :modal="true">
    <div style="display: flex;flex-direction: column;gap: 10px;">
      <div style="word-wrap: break-word;line-height: 1.5em">
        <span style="font-weight: bold;"> [{{ issueKey }}]</span> <span> {{ summary }} </span>
      </div>
      <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                time spent
            </span>
        <InputText placeholder="" v-model="timeSpent" />
      </div>
      <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                comment
            </span>
        <InputText placeholder="" v-model="comment" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" @click="closeEditModal()" class="p-button-text" />
      <Button label="Edit" @click="editWorklog" autofocus />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef } from "vue";
import { WorklogServices } from "@/services/WorklogServices";
import { store } from "@/store/Store";
import { catchError, finalize, NEVER, Subject, switchMap } from "rxjs";
import { SweetAlert } from "@/Utils/Utils";
import EditLogworkDialog from "@/components/EditLogworkDialog.vue";

const isLoading = ref(true);
const issues = ref<Date[]>();
const host = toRef(store.loginStage, "host");
const firstDay = new Date();
const today = new Date();
firstDay.setDate(today.getDate() - 7);
const rangeDate = ref([firstDay, today]);
const openEditDialog = ref(false);

const timeSpent = ref();
const comment = ref();
const issueKey = ref();
const summary = ref();
const worklogId = ref();
const started = ref();

const getWorklogHistories$ = new Subject<void>();
getWorklogHistories$
  .pipe(
    switchMap(() => {
        isLoading.value = true;
        const startDate =  JSON.parse(JSON.stringify(rangeDate.value[0]));
        const endDate = rangeDate.value[1] ? JSON.parse(JSON.stringify(rangeDate.value[1])): null;
        return WorklogServices.getWorklogHistoryRangeDate(new Date(startDate), endDate? new Date(endDate) : null)
          .pipe(
            catchError((err) => {
              SweetAlert.error(err.status, err?.response?.errorMessages[0]);
              isLoading.value = undefined;
              return NEVER;
            }),
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
        getWorklogHistories$.next();
      },
      error: (err) => SweetAlert.error(err.status, err?.response?.errorMessages[0])
    });
}

function openEditModal(worklog : any) {
  console.log(worklog);
  updateDetail({...worklog});
  openEditDialog.value = true;
}

const updateDetail = ((issueDetail: any) => {
  worklogId.value = issueDetail.worklogId;
  summary.value = issueDetail.summary;
  issueKey.value = issueDetail.key;
  timeSpent.value = issueDetail.timeSpent;
  comment.value = issueDetail.comment;
  started.value = issueDetail.started;
})

function closeEditModal() {
  openEditDialog.value = false;
}

function onEditIssue() {
  closeEditModal();
}

function editWorklog(worklog: any) {
  WorklogServices.editWorklog$(issueKey.value, {
    id: worklogId.value,
    comment: comment.value,
    started: started.value,
    timeSpent: timeSpent.value
  }, worklog.started)
    .subscribe({
      next: (_) => {
        openEditDialog.value = false
        SweetAlert.success();
        getWorklogHistories$.next();
      },
      error: (err) => {
        SweetAlert.error(err.status, err?.response?.errorMessages[0]);
      }
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

.p-button.p-button-rounded.p-button-danger.p-button-text, .p-button.p-button-rounded.p-button-success.p-button-text {
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
