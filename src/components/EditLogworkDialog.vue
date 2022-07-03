<template>
  <Dialog header="Add" v-model:visible="props.display"
          :closable="false"
          :style="{width: '400px'}" :modal="true">
    <div style="display: flex;flex-direction: column;gap: 10px;">
      <div style="word-wrap: break-word;">
        <span style="font-weight: bold;"> [{{ issueDetail.key }}]</span>
        <span> {{ issueDetail.summary }} </span>
      </div>
      <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                time spent
            </span>
        <InputText placeholder="" v-model="issueDetail.timeSpent" />
      </div>
      <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                comment
            </span>
        <InputText placeholder="" v-model="issueDetail.comment" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" @click="closeModal" class="p-button-text" />
      <Button label="Edit" @click="editWorklog" autofocus />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { SweetAlert } from "@/Utils/Utils";
import { IssueServices } from "@/services/IssueServices";
import { WorklogServices } from "@/services/WorklogServices";

const issueDetail = ref();

const props = defineProps(["display", "issueDetail"]);
const emit = defineEmits(["onCloseModal", "onEditWorklog"]);

function closeModal() {
  emit("onCloseModal", false);
}

function editWorklog() {
  WorklogServices.editWorklog$(issueDetail.value.key, issueDetail.value, issueDetail.value.started)
    .subscribe({
      next: (data) => {
        emit("onEditWorklog", );
      },
      error: (err) => {
        SweetAlert.error(err.status, err?.response?.errorMessages[0]);
      }
    });
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700&family=Poppins:wght@300&display=swap')
.swal2-popup
  background-color: #2a323d

.swal2-container
  z-index: 1200

.swal2-title, .swal2-html-container
  font-family: 'Kanit', sans-serif
  font-family: 'Poppins', sans-serif
  color: white
</style>
