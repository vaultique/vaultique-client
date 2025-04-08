<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ date: string }>()

const emit = defineEmits<{
  preview: []
  next: []
}>()

const date = computed<string>(() => props.date)

const router = useRouter()

function jumpToToolList(): void {
  router.back()
}

function handleNext(): void {
  emit('next')
}

function handlePreview(): void {
  emit('preview')
}
</script>

<template>
  <div class="header-bar" data-tauri-drag-region>
    <button @click="jumpToToolList">
      首页
    </button>
    <button @click="handlePreview">
      上月
    </button>
    <div>{{ date }}</div>
    <button @click="handleNext">
      下月
    </button>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  gap: 12px;
  padding: 10px;
}
</style>
