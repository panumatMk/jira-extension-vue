<template>
  <Dialog header="Add" v-model:visible="props.display"
          :closable="false"
          :style="{width: '400px'}" :modal="true">
    <div>
      <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                Jira #
            </span>
        <InputText placeholder="" v-model="jiraId" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" @click="closeModal" class="p-button-text" />
      <Button label="Add" @click="addIssue" autofocus />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { Service } from "@/services/Service";
import { SweetAlert } from "@/Utils/Utils";

const jiraId = ref();

const props = defineProps(["display"]);
const emit = defineEmits(["onCloseModal", "onAddIssue"]);

function closeModal() {
  jiraId.value = "";
  emit("onCloseModal", false);
}

function addIssue() {
  Service.getIssue$(jiraId.value)
    .subscribe({
      next: (data) => {
        jiraId.value = "";
        emit("onAddIssue", { id: data.id, label: data.summary });
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

.swal2-title
  font-family: 'Kanit', sans-serif
  font-family: 'Poppins', sans-serif
  color: white
</style>
