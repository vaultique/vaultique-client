import type { Ref } from 'vue'
import type { GraphData } from './type'
import { NODE_ITEM_SIZE } from './use-data'

export default function useDraw(ctx: Ref<CanvasRenderingContext2D | null>, osCtx: Ref<OffscreenCanvasRenderingContext2D | null>) {
  function draw(data: GraphData): void {
    if (ctx.value === null || osCtx.value === null) {
      return
    }
    drawNodeList(data.nodeList, ctx.value)
    drawOsNodeList(data.osNodeList, osCtx.value)
  }

  return { draw }
}

function drawNodeList(nodeList: Int32Array, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < nodeList.length; i = i + NODE_ITEM_SIZE) {
    ctx.beginPath()
    ctx.fillStyle = `rgba(${nodeList[i + 3]}, ${nodeList[i + 4]}, ${nodeList[i + 5]}, ${nodeList[i + 6]})`
    ctx.arc(nodeList[i + 0], nodeList[i + 1], nodeList[i + 2], 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }
}

function drawOsNodeList(osNodeList: Int32Array, osCtx: OffscreenCanvasRenderingContext2D): void {
  for (let i = 0; i < osNodeList.length; i = i + 7) {
    osCtx.beginPath()
    osCtx.fillStyle = `rgba(${osNodeList[i + 3]}, ${osNodeList[i + 4]}, ${osNodeList[i + 5]}, ${osNodeList[i + 6]})`
    osCtx.arc(osNodeList[i + 0], osNodeList[i + 1], osNodeList[i + 2], 0, 2 * Math.PI)
    osCtx.fill()
    osCtx.closePath()
  }
}
