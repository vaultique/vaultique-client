import { ref } from 'vue'

/**
 * TODO
 *
 * 只绘制已绘制节点关联的线
 * 连线hover状态
 * 画布或节点拖动过程中无需做ID识别
 * 缩放比小于给定值后 节点及连线不可选择
 */
// class MapConfig {
//   private MAP_SCALE_STAGE = 0.03
//   private MAP_MAX_SCALE = 5
//   private MAP_MIN_SCALE = 0.01
//   private MAP_WIDTH = 0
//   private MAP_HEIGHT = 0
//   private mapScale: number = 1
//   private mapOffsetX: number = 0
//   private mapOffsetY: number = 0

//   constructor(width: number, height: number) {
//     this.MAP_WIDTH = width
//     this.MAP_HEIGHT = height
//   }

//   public movingMap(deltaX: number, deltaY: number): void {
//     this.mapOffsetX += deltaX
//     this.mapOffsetY += deltaY
//   }

//   public movingToTargetByOriginalCoordinate(x: number, y: number): void {
//     this.mapOffsetX = (-x + this.MAP_WIDTH / 2) * this.mapScale
//     this.mapOffsetY = (-y + this.MAP_HEIGHT / 2) * this.mapScale
//   }

//   public scalingMap(delta: number): void {
//     const deltaScale = delta / 100 * this.MAP_SCALE_STAGE
//     this.mapScale = Math.min(Math.max(this.mapScale - deltaScale, this.MAP_MIN_SCALE), this.MAP_MAX_SCALE)
//   }

//   public scalingMapByOffsetCoordinate(delta: number, offsetX: number, offsetY: number): void {
//     const deltaScale = delta / 100 * this.MAP_SCALE_STAGE
//     const [x, y] = this.getOriginalCoordinateByOffsetCoordinate(offsetX, offsetY)
//     const deltaX = Math.floor(deltaScale * x)
//     const deltaY = Math.floor(deltaScale * y)

//     const actualScale = Math.min(Math.max(this.mapScale - deltaScale, this.MAP_MIN_SCALE), this.MAP_MAX_SCALE)
//     if (actualScale === this.mapScale)
//       return

//     this.mapScale = actualScale
//     this.mapOffsetX = this.mapOffsetX + deltaX
//     this.mapOffsetY = this.mapOffsetY + deltaY
//   }

//   public getOriginalCoordinateByOffsetCoordinate(offsetX: number, offsetY: number): [number, number] {
//     const x = offsetX / this.mapScale - this.mapOffsetX / this.mapScale
//     const y = offsetY / this.mapScale - this.mapOffsetY / this.mapScale
//     return [x, y]
//   }

//   public getMapRange(): [number, number, number, number] {
//     const x = -this.mapOffsetX / this.mapScale
//     const y = -this.mapOffsetY / this.mapScale
//     const w = this.MAP_WIDTH / this.mapScale
//     const h = this.MAP_HEIGHT / this.mapScale
//     return [x, y, w, h]
//   }

//   public getConfig(): { mapScale: number, mapOffsetX: number, mapOffsetY: number } {
//     return {
//       mapScale: this.mapScale,
//       mapOffsetX: this.mapOffsetX,
//       mapOffsetY: this.mapOffsetY,
//     }
//   }
// }

const MAP_MAX_SCALE = 5
const MAP_MIN_SCALE = 0.01
const MAP_SCALE_STAGE = 0.03

export default function useConfig(w: number, h: number) {
  const mapScale = ref<number>(1)
  const mapOffsetX = ref<number>(0)
  const mapOffsetY = ref<number>(0)
  const width = ref<number>(w)
  const height = ref<number>(h)

  // constructor(width: number, height: number) {
  //   this.MAP_WIDTH = width
  //   this.MAP_HEIGHT = height
  // }

  function movingMap(deltaX: number, deltaY: number): void {
    mapOffsetX.value = mapOffsetX.value + deltaX
    mapOffsetY.value = mapOffsetY.value + deltaY
  }

  function movingToTargetByOriginalCoordinate(x: number, y: number): void {
    mapOffsetX.value = (-x + width.value / 2) * mapScale.value
    mapOffsetY.value = (-y + height.value / 2) * mapScale.value
  }

  function scalingMap(delta: number): void {
    const deltaScale = delta / 100 * MAP_SCALE_STAGE
    mapScale.value = Math.min(Math.max(mapScale.value - deltaScale, MAP_MIN_SCALE), MAP_MAX_SCALE)
  }

  function scalingMapByOffsetCoordinate(delta: number, offsetX: number, offsetY: number): void {
    const deltaScale = delta / 100 * MAP_SCALE_STAGE
    const [x, y] = getOriginalCoordinateByOffsetCoordinate(offsetX, offsetY)
    const deltaX = Math.floor(deltaScale * x)
    const deltaY = Math.floor(deltaScale * y)

    const actualScale = Math.min(Math.max(mapScale.value - deltaScale, MAP_MIN_SCALE), MAP_MAX_SCALE)
    if (actualScale === mapScale.value)
      return

    mapScale.value = actualScale
    mapOffsetX.value = mapOffsetX.value + deltaX
    mapOffsetY.value = mapOffsetY.value + deltaY
  }

  function getOriginalCoordinateByOffsetCoordinate(offsetX: number, offsetY: number): [number, number] {
    const x = offsetX / mapScale.value - mapOffsetX.value / mapScale.value
    const y = offsetY / mapScale.value - mapOffsetY.value / mapScale.value
    return [x, y]
  }

  function getMapRange(): [number, number, number, number] {
    const x = -mapOffsetX.value / mapScale.value
    const y = -mapOffsetY.value / mapScale.value
    const w = width.value / mapScale.value
    const h = height.value / mapScale.value
    return [x, y, w, h]
  }

  function getConfig(): { mapScale: number, mapOffsetX: number, mapOffsetY: number } {
    return {
      mapScale: mapScale.value,
      mapOffsetX: mapOffsetX.value,
      mapOffsetY: mapOffsetY.value,
    }
  }

  return {
    movingMap,
    movingToTargetByOriginalCoordinate,
    scalingMap,
    scalingMapByOffsetCoordinate,
    getMapRange,
    getConfig,
  }
}
