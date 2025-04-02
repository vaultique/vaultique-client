<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  count: number
}>()

const count = computed<number>(() => props.count)
</script>

<template>
  <div class="group-sub-header">
    <div class="name">
      已完成
    </div>
    <div class="count">
      {{ count }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.group-sub-header {
  font-weight: bold;
  font-size: 14px;
  margin: 6px 0;
  display: flex;
  flex-direction: row;

  .count {
    margin-left: 8px;
    color: #949494;
  }
}
</style>
