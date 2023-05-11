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
    >
      <Column :rowReorder="true" headerStyle="max-width: 50px" bodyStyle="max-width: 50px;justify-content:center" />
      <Column field="timeSpent" header="Time Spent" headerStyle="max-width: 120px" bodyStyle="max-width: 120px">

        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus style="max-width: 100px" />
        </template>
      </Column>
      <Column field="comment" header="Comment" headerStyle="max-width: 252px"
              bodyStyle="max-width: 252px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus style="width: 100%" />
        </template>
      </Column>
      <Column header="Action" headerStyle="max-width: 100px" bodyStyle="max-width: 100px">
        <template #body="{data,index}">
          <div style="display: flex;gap:7px;justify-content: flex-end;width:100%" >
            <Button icon="pi pi-arrow-up" class="p-button-rounded" @click="send(index)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="remove(data)" />
          </div>
        </template>
      </Column>
      <template #groupheader="{data}">
        <div class="group-header">

          <span>
              <i class="pi pi-pencil" @click="editTicket(data)"></i>&nbsp;
            <a :href="host+'/browse/'+data['id']" target="_blank" style="color: white">[{{
                data["id"]
                }}]</a> {{ data["label"] }}</span>
            <span>

          </span>
            <div style="display: flex;gap:7px;max-width: 100px;">

            <Button icon="pi pi-plus" @click="addIssue(data)"
                    class="p-button-sm p-button-rounded p-button-success p-button-outlined"/>
            </div>
        </div>
      </template>
      <template #footer>
        <div style="display: flex;gap: 15px;}">
          <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openAddModal" />
          <span style="display: flex;gap: 5px;align-items: center;">
            <Calendar id="multiple" v-model="dates" selectionMode="multiple" :manualInput="false"
                      dateFormat="dd/mm/yy"/>
            <Button
                    icon="pi pi-copy"
                    class="p-button-rounded p-button-warning"
                    v-tooltip.top="{value:'Copy Dates', class: 'copy-tooltip'}"
                    @click="copy"
            />
          </span>
        </div>
      </template>
        <template #empty>
            No Issue found.
        </template>
    </DataTable>

      <AddTicketDialog :display="openAddDialog" :ticket="selectEditTicket" :mode="ticketMode" @onCloseModal="closeAddModal"
                       @onAddIssue="onAddIssue($event)" @onEditIssue="onEditIssue($event)"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, toRef} from "vue";
import type {Ticket} from "@/Utils/Utils";
import {DateUtils, JIRA, SweetAlert, Utils} from "@/Utils/Utils";
import {iif, Subject} from "rxjs";
import AddTicketDialog from "@/components/AddTicketDialog.vue";
import {store} from "@/store/Store";
import {WorklogServices} from "@/services/WorklogServices";

const updateTickets$ = new Subject<Ticket[]>();
updateTickets$.subscribe((tickets) => JIRA.updateTickets(tickets));
const dates = ref([new Date()]);
const list = ref<Ticket[]>([]);
const host = toRef(store.loginStage, "host");
const openAddDialog = ref(false);
const ticketMode = ref<'add' | 'edit'>();
const selectEditTicket = ref<Ticket>();
onMounted(() => {
    JIRA.getTickets().subscribe((tickets) => {
        list.value = tickets ? Object.values(tickets) : [];
    });
});

const onRowReorder = (event: any) => {
    list.value = event.value;
    updateTickets$.next(event.value as Ticket[]);
};

function onCellEditComplete(event: any) {
  let { data, newValue, field } = event;
  console.log(data, newValue, field);
  data[field] = newValue;
  updateTickets$.next(list.value as Ticket[]);
}

function openAddModal() {
    openAddDialog.value = true;
    ticketMode.value = 'add';
    selectEditTicket.value= undefined;
}

function closeAddModal(open: boolean) {
  openAddDialog.value = open;
  selectEditTicket.value = undefined;
}

function addIssue({id, label, mode = 'add'}: Ticket&{mode?:string}) {
    if (mode === 'add') {
        const newTicket: Ticket = {
            id,
            label,
            timeSpent: "",
            comment: ""
        };
        list.value = [...list.value || [], newTicket];
        updateTickets$.next(list.value);
    } else {

        if (list.value?.length > 0) {
            const cloneList = [...list.value || []];
            const newCloneList = cloneList.map(item => {
                console.log(id, label, mode, selectEditTicket.value?.id,item.id,cloneList);
                if (item.id === selectEditTicket.value!.id) {
                    item.id = id;
                    item.label = label;
                    return item;
                }
                return item;
            })
            updateTickets$.next(newCloneList || []);
        }
    }
}

function editTicket(data: Ticket) {
    openAddDialog.value = true;
    ticketMode.value = 'edit';
    selectEditTicket.value = {...data};
}

function onAddIssue(data: any) {
    addIssue(data);
    closeAddModal(false);
}

function onEditIssue(data: any) {
    addIssue(data);
    closeAddModal(false);
}
function send(index: number) {
    const ticketList = (list.value ? [...list.value] : []) as Ticket[];
    const listData = ticketList.sort((a, b) => {
        return a.id >= b.id ? 1 : -1;
    });
    const data = listData[index];
    iif(() => dates.value.length === 1,
        WorklogServices.addWorklog$(data, DateUtils.getSendingDate(dates.value[0])),
        WorklogServices.addWorklogs$(data, DateUtils.getSendingDates(dates.value))
    ).subscribe({
        next: (results) => {
            console.log(results);
            SweetAlert.success();
        },
        error: (err) => {
            SweetAlert.error(err.status);
        }
    });
}

function remove(data: Ticket) {
  list.value = list.value?.filter((d) => d !== data);
  updateTickets$.next(list.value as Ticket[]);
}

function copy() {
  Utils.copyToClipboard(DateUtils.DATE_VAR);
}
</script>

<style scoped lang="sass">
.p-button.p-button-icon-only.p-button-rounded
  width: 1.7rem
  height: 1.7rem

.p-datatable-scrollable .p-datatable-thead > tr > th
  justify-content: center


.group-header
  width: 100%
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

</style>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700&family=Poppins:wght@300&display=swap')
.swal2-popup
  background-color: #2a323d

.swal2-container
  z-index: 1200

.swal2-title
  font-family: 'Kanit', sans-serif
  font-family: 'Poppins', sans-serif
  color: white
</style>
