<template>
  <input-text class="input-search" v-model="search" placeholder="search"
              type="text"></input-text>
  <div class="card-f">
    <template v-for="item in getList">
      <div class="card-l">
        <div>
          <span v-tooltip.top="'artifact'"
                v-if="item.parent.link">
            <a :href="host+'/browse/'+item.parent.key" target="_blank">{{ item.parent.key
              }}</a>  / </span>
          <span v-tooltip.top="'subtask'"
                class="link"><a :href="host+'/browse/'+item.key" target="_blank">{{ item.key }}</a></span>
          <span style="line-height: 1.5"> : {{ item.summary }} </span>
          <span class="status"
                :class="[item.status === 'Open'? 'open':'', item.status === 'In Progress'? 'in-progress':'']"
          > {{ item.status }} </span>
        </div>
        <div class="logwork">
        <span>
          <InputText id="timeSpent" v-model="item.timeSpent" placeholder="Time Spent" type="text" style="width:100%" />
        </span>
          <span>
          <InputText id="timeSpent" v-model="item.comment" placeholder="Comment" type="text" style="width:100%" />
        </span>
          <span><Button icon="pi pi-arrow-up" class="p-button-rounded" @click="send(item)" /></span>
        </div>
      </div>
    </template>
  </div>
  <span style="display: flex;gap: 5px;align-items: center; padding-top:10px">
    <Calendar v-model="dates" id="multiple" selectionMode="multiple" :manualInput="false"
              dateFormat="dd/mm/yy" />
    <Button
      icon="pi pi-copy"
      class="p-button-rounded p-button-warning"
      v-tooltip.top="{value:'Copy Dates', class: 'copy-tooltip'}"
    />
  </span>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, toRef } from "vue";
import type { SearchWorklog } from "@/services/AssignToMeServices";
import { AssignToMeServices } from "@/services/AssignToMeServices";
import { WorklogServices } from "@/services/WorklogServices";
import type { Ticket } from "@/Utils/Utils";
import { DateUtils, SweetAlert } from "@/Utils/Utils";
import { store } from "@/store/Store";

const dates = ref([new Date()]);
const host = toRef(store.loginStage, "host");

const list = ref<SearchWorklog[]>([]);
const search = ref<string>("");

onMounted(() => {
  AssignToMeServices.getWorklogsIssuesAssignToCurrentUser()
    .subscribe(response => {
      list.value = response;
    });
});

function send(item: SearchWorklog) {
  const data: Ticket = {
    id: item.key,
    timeSpent: item?.timeSpent || "",
    comment: item?.comment as string || ""
  };
  WorklogServices.addWorklog$(data, DateUtils.getSendingDate(dates.value[0]))
    .subscribe({
      next: (results) => {
        SweetAlert.success();
      },
      error: (err) => {
        SweetAlert.error(err.status);
      }
    });
}

const getList = computed(() => {
  return list.value?.filter(item =>
    (item?.key || '').toUpperCase().includes(search.value.toUpperCase())
    || (item?.parent?.key || '').toUpperCase().includes(search.value.toUpperCase())
    || (item?.summary || '').toUpperCase().includes(search.value.toUpperCase())
    || (item?.status || '').toUpperCase().includes(search.value.toUpperCase())
  );
});
</script>

<style scoped lang="scss">
.input-search {
  position: absolute;
  top: 43px;
  right: 50px;
  width: 260px;
}

.card-f {
  overflow: scroll;
  height: 310px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.p-button.p-button-icon-only.p-button-rounded {
  margin-top: 1px;
  width: 1.7rem;
  height: 1.7rem;
}

.card-l {
  padding: 15px;
  border-radius: 1px;
  border-radius: 5px;
  border: 1px solid #222832;
  background-color: #222832;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

a {
  color: white;
}

.status {
  margin-left: 5px;
  display: inline-block;
  font-size: 14px;
  padding: 2px;
  border-radius: 5px;
  border: 1px solid #2b323d;
  background-color: #2b323d;

  &.open {
    border: 1px solid #3569ba;
    background-color: #3569ba;
  }

  &.in-progress {
    border: 1px solid #35ba3b;
    background-color: #35ba3b;
  }
}

.logwork {
  display: grid;
  grid-template-columns: 110px 1fr 28px;
  gap: 10px;
}
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
