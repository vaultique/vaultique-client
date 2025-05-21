<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ContextAction } from './use-context'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  x: number
  y: number
  actionList: ContextAction[]
}>()

const emit = defineEmits<{
  action: [value: ContextAction]
}>()

const { actionList } = toRefs(props)

const styles = computed<CSSProperties>(() => {
  return {
    top: `${props.y}px`,
    left: `${props.x}px`,
  }
})

function handleAction(action: ContextAction): void {
  emit('action', action)
}
</script>

<template>
  <div class="context-menu" :style="styles">
    <div v-for="action in actionList" :key="action.type" @click="handleAction(action)">
      {{ action.title }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.context-menu {
  position: fixed;
  background-color: #fff;
  cursor: pointer;
}
</style>
