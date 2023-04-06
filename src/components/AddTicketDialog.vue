<template>
  <Dialog :header="labelMode" v-model:visible="props.display"
          :closable="false"
          :style="{width: '400px'}" :modal="true">
      <div>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                Jira #
            </span>
              <InputText placeholder="" v-model="jiraId"/>
          </div>
      </div>
    <template #footer>
      <Button label="Cancel" @click="closeModal" class="p-button-text" />
        <Button :label="labelMode" @click="addIssue" autofocus/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {defineEmits, ref, computed} from "vue";
import {SweetAlert} from "@/Utils/Utils";
import {IssueServices} from "@/services/IssueServices";

const jiraId = ref();

const props = defineProps(["display", "mode"]);
const emit = defineEmits(["onCloseModal", "onAddIssue"]);
const labelMode = computed(() => props.mode === 'add' ? 'Add' : 'Edit');

function closeModal() {
    jiraId.value = "";
    emit("onCloseModal", false);
}

function addIssue() {
    if (props.mode === 'add') {
        IssueServices.getIssue$(jiraId.value)
            .subscribe({
                next: (data) => {
                    jiraId.value = "";
                    emit("onAddIssue", {id: data.id, label: data.summary});
                },
                error: (err) => {
                    SweetAlert.error(err.status, err?.response?.errorMessages[0]);
                }
            });
    } else {
        IssueServices.getIssue$(jiraId.value)
            .subscribe({
                next: (data) => {
                    jiraId.value = "";
                    emit("onAddIssue", {id: data.id, label: data.summary});
                },
                error: (err) => {
                    SweetAlert.error(err.status, err?.response?.errorMessages[0]);
                }
            });
    }
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
