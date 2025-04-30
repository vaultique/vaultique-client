<script setup lang="ts">
import type { ContextAction } from './use-context'
import { onMounted, ref } from 'vue'
import { ContextMenu, HeaderBar, NodeForm } from './component'
import { MAP_HEIGHT, MAP_WIDTH } from './constant'
import { useData, useDraw, useGraph } from './hook'
import { CONTEXT_ACTION_NODE_ADD } from './use-context'
import { Node } from './type'

const canvasEl = ref<HTMLCanvasElement>()

const { ctx, osCtx, visible, actionList, x, y, initContext } = useGraph()

const { graph, load, addNode } = useData()

const { draw } = useDraw(ctx, osCtx)

load()

onMounted(() => {
  initContext(canvasEl.value!)

  setTimeout(() => {
    draw(graph.value)
  }, 1500)
})

const nodeX = ref<number>(0)
const nodeY = ref<number>(0)
const formVisible = ref<boolean>(false)
function handleAction(action: ContextAction): void {
  visible.value = false
  if (action.type === CONTEXT_ACTION_NODE_ADD) {
    nodeX.value = action.context.x
    nodeY.value = action.context.y
    formVisible.value = true
  }
}
function handleFormCancel(): void {
  formVisible.value = false
}
async function handleSubmit(n: Node): Promise<void> {
  formVisible.value = false
  await addNode(n)
  draw(graph.value)
}
</script>

<template>
  <div class="knowledge-graph">
    <HeaderBar />
    <canvas ref="canvasEl" :width="MAP_WIDTH" :height="MAP_HEIGHT" />
    <ContextMenu v-show="visible" :x="x" :y="y" :action-list="actionList" @action="handleAction" />
    <NodeForm v-if="formVisible" :x="nodeX" :y="nodeY" @cancel="handleFormCancel" @submit="handleSubmit" />
  </div>
</template>

<style lang="less" scoped>
.knowledge-graph {
  display: flex;
  flex-direction: column;
}

canvas {
  background-color: antiquewhite;
}
</style>
