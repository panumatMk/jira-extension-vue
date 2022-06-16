<template>
  <div>
    <DataTable
      :value="list"
      :scrollable="true"
      scrollHeight="300px"
      @rowReorder="onRowReorder"
      editMode="cell"
      @cell-edit-complete="onCellEditComplete"
      class="editable-cells-table"
      rowGroupMode="subheader"
      groupRowsBy="id"
      sortField="id"
      sortMode="single"
      :sortOrder="1"
    >
      <Column :rowReorder="true" headerStyle="width: 1rem"/>
      <Column field="timeSpent" header="timeSpent">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus />
        </template>
      </Column>
      <Column field="comment" header="Comment" style="width: 100px;">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus />
        </template>
      </Column>
      <Column header="Action">
        <template #body="{data}">
          {{ "test" }}
        </template>
      </Column>
      <template #groupheader="{data}">
        <div class="group-header">
          <span>{{ data["id"] }} {{ data["label"] }}</span>
          <span>
            <Button icon="pi pi-plus" @click="addNewRow(data)"
                    class="p-button-sm p-button-rounded p-button-success p-button-outlined" />
          </span>
        </div>
      </template>
      <template #footer>
        <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openAddModal" />
      </template>
      <template #empty>
        No Ticket found.
      </template>
    </DataTable>

    <AddTicketDialog :display="openAddDialog" @onCloseModal="closeAddModal"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ticket } from "@/Utils/Utils";
import { JIRA } from "@/Utils/Utils";
import { Subject } from "rxjs";
import AddTicketDialog from "@/components/AddTicketDialog.vue";

const updateTickets$ = new Subject<Ticket[]>();
updateTickets$.subscribe((tickets) => JIRA.updateTickets(tickets));

const list = ref<Ticket[]>();
const openAddDialog = ref(false);
onMounted(() => {
  list.value = [
    {
      id: "AG-123",
      label: "Edit",
      timeSpent: "15m",
      comment: "124234234"
    },
    {
      id: "AG-123",
      label: "Edit",
      timeSpent: "15m",
      comment: "124234234"
    },
    {
      id: "BO-xxx",
      label: "Update",
      timeSpent: "15m",
      comment: "124234234"
    }
  ];

  JIRA.getTickets().subscribe((tickets) => {
    if (tickets !== undefined) {
      list.value = tickets;
    }
  });
});

const onRowReorder = (event: any) => {
  list.value = event.value;
  updateTickets$.next(event.value as Ticket[]);
};

function onCellEditComplete() {
  updateTickets$.next(list.value as Ticket[]);
}

function openAddModal() {
  openAddDialog.value = true;
}

function closeAddModal(data: boolean){
  openAddDialog.value = data;
}

function addNewRow({ id, label }: Ticket) {
  const newTicket: Ticket = {
    id,
    label,
    timeSpent: "",
    comment: ""
  };
  list.value = [...list.value || [], newTicket];
  updateTickets$.next(list.value);
}
</script>

<style scoped lang="sass">
::v-deep .p-rowgroup-header>td
  padding: 0.5rem 1rem !important

.group-header
  width: 100%
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

</style>
