import type { Model } from './util'
import { ref } from 'vue'
import { MAP_HEIGHT, MAP_WIDTH } from './constant'
import { useContext } from './hook'
import { transColor2ModelIndex } from './util'

export default function useGraph() {
  // 画布
  const canvas = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  // 影子画布
  const osCanvas = ref<OffscreenCanvas | null>(null)
  const osCtx = ref<OffscreenCanvasRenderingContext2D | null>(null)

  // const { scalingMapByOffsetCoordinate } = useConfig(0, 0)
  // const { drawNodeList } = useDraw(ctx, osCtx)
  const { visible, x, y, actionList, mapContext } = useContext()

  // canvas上下文初始化
  function initContext(el: HTMLCanvasElement): void {
    canvas.value = el
    ctx.value = canvas.value.getContext('2d')
    init2()

    osCanvas.value = new OffscreenCanvas(MAP_WIDTH, MAP_HEIGHT)
    osCtx.value = osCanvas.value.getContext('2d', { willReadFrequently: true })
  }

  function init2(): void {
    if (!canvas.value) {
      return
    }

    canvas.value.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()
      const { offsetX, offsetY } = e
      mapContext(offsetX, offsetY)
    })

    canvas.value.addEventListener('mousedown', (e: MouseEvent) => {
      if (ctx.value === null || osCtx.value === null) {
        return
      }
      const { offsetX, offsetY } = e
      const result = findNodeOrLineByCoordinate(osCtx.value, offsetX, offsetY)

      console.warn(result)
    })

    canvas.value.addEventListener('mousemove', () => { })

    canvas.value.addEventListener('mouseup', () => { })

    canvas.value.addEventListener('wheel', () => { })
  }

  // 滚轮事件监听 画布的缩放
  // function handleScale() {
  //   let timer: number | undefined
  //   return (e: WheelEvent) => {
  //     const { deltaY, offsetX, offsetY } = e
  //     if (typeof e.deltaY !== 'number' || e.deltaY === 0)
  //       return
  //     scalingMapByOffsetCoordinate(deltaY, offsetX, offsetY)
  //     if (timer !== undefined) {
  //       clearTimeout(timer)
  //       timer = undefined
  //     }
  //     timer = window.setTimeout(() => {
  //       // emitter.emit('mapScaleDown')
  //       // TODO draw
  //       window.clearTimeout(timer)
  //       timer = undefined
  //     }, 500)
  //   }
  // }

  return { ctx, osCtx, visible, x, y, actionList, initContext }
}

// 根据颜色反向寻找节点或连线
function findNodeOrLineByCoordinate(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number): { model: Model, index: number } | undefined {
  const m = Array.from(ctx.getImageData(x, y, 1, 1).data) as [number, number, number, number]
  const result = transColor2ModelIndex(m)
  if (result.model === 'unexpected')
    return undefined
  return result
}
