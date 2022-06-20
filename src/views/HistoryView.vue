<template>
  <div class="card">
    <Carousel :value="issues" :numVisible="1" :numScroll="1" :page="3">
      <template #item="slotProps">
        <div class="issue-item">
          <div class="issue-item-content">
            {{slotProps.data.header}}
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { HistoryServices } from "@/services/HistoryServices";

const issues = ref([]);
issues.value = [
  { header: 'M' },
  { header: 'E' },
  { header: 3 },
  { header: 3 },
  { header: 3 },
];
onMounted(() => {
  HistoryServices.getAllWorklogsOfWeek().subscribe((data) => {
    issues.value = Object.keys(data).map((key) => {
      return {
        header: key,
        [key]: data[key]
      };
    });
  });
});

</script>

<style lang="scss" scoped>
::v-deep(.p-carousel-container){
  width: 540px;
  margin-left: -20px;
}

.issue-item {
  .issue-item-content {
    border: 1px solid var(--surface-border);
    border-radius: 3px;
    margin: .3rem;
    text-align: center;
    padding: 2rem 0;
    height: 310px;
  }
}
</style>
