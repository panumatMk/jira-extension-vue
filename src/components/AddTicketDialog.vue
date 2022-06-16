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
      <Button label="Add" @click="addTicket" autofocus />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { Service } from "@/services/Service";

const jiraId = ref();

const props = defineProps(["display"]);
const emit = defineEmits(["onCloseModal", "onAddIssue"]);

function closeModal() {
  emit("onCloseModal", false);
}

function addTicket() {
  Service.getIssue$(jiraId.value)
    .subscribe({
      next: (data) => {
        emit("onAddIssue", { id: data.id, label: data.summary });
      }
    });
}
</script>

<style scoped>

</style>
