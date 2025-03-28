<script setup lang="ts">
import { computed } from 'vue';

  const props = withDefaults(defineProps<{
  title: string;
}>(), {
  title: '',
});

const title = computed(() => props.title);
</script>

<template>
  <div class="tool-card">
    <div class="tool-card__header">
      <div>{{ title }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.tool-card {
  width: 200px;
  height: 120px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  cursor: pointer;
}
</style>

