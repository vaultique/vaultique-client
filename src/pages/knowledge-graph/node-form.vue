<script setup lang="ts">
import type { Node } from './type'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { DEFAULT_NODE_RADIUS } from './constant'

const props = defineProps<{ x?: number, y?: number }>()

const emit = defineEmits<{
  cancel: []
  submit: [value: Node]
}>()

const node = ref<Node>(generate())

function generate(): Node {
  return { label: 'STRUCTURE', uuid: uuidv4(), name: '', x: props.x ?? 0, y: props.y ?? 0, r: DEFAULT_NODE_RADIUS }
}

function handleSubmit(): void {
  emit('submit', node.value)
}
</script>

<template>
  <div class="node-form">
    <div>
      <div>ID</div>
      <input :value="node.uuid" :readonly="true">
    </div>
    <div>
      <div>位置</div>
      <input :value="`[${node.x}, ${node.y}]`" :readonly="true">
    </div>
    <div>
      <div>类型</div>
      <input v-model="node.label">
    </div>
    <div>
      <div>名称</div>
      <input v-model="node.name">
    </div>
    <div>
      <div>半径</div>
      <input v-model.number="node.r">
    </div>
    <div>
      <button @click="handleSubmit">
        确认
      </button>
      <button @click="emit('cancel')">
        取消
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.node-form {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  padding: 20px;
}
</style>
