export type Model = 'unexpected' | 'node' | 'relation'

// 根据模块序号生成RGBA颜色
export function transModelIndex2Color(model: Model, index: number): [number, number, number, number] {
  if (model !== 'node' && model !== 'relation')
    throw new Error('unexpected model')
  const MAX = 255 * 255 * 255
  const MIDDLE = Math.floor(MAX / 2)
  if (index > MIDDLE)
    throw new Error('unexpected index, beyond the maximum')
  if (index < 0)
    throw new Error('unexpected index, less than 0')
  // node: 0 ~ 255 * 255 * 255 / 2
  // relation: 255 * 255 * 255 / 2 ~ 255 * 255 * 255
  if (model === 'relation')
    index = MAX - index
  const R = Math.floor(index / (255 * 255))
  const G = Math.floor((index - R * 255 * 255) / 255)
  const B = index - R * 255 * 255 - G * 255
  const A = 255
  return [R, G, B, A]
}

// 根据RGBA颜色解析成模块序号
export function transColor2ModelIndex([R, G, B, A]: [number, number, number, number]): { model: Model, index: number } {
  if (A !== 255)
    return { model: 'unexpected', index: -1 }
  const MAX = 255 * 255 * 255
  const MIDDLE = Math.floor(MAX / 2)
  let index = R * 255 * 255 + G * 255 + B
  if (index < MIDDLE) {
    return { model: 'node', index }
  }
  else {
    index = MAX - index
    return { model: 'relation', index }
  }
}

// TODO no valid
export function hex2rgb(hex: string): [number, number, number] {
  return [Number.parseInt(`${hex[1]}${hex[2]}`, 16), Number.parseInt(`${hex[3]}${hex[4]}`, 16), Number.parseInt(`${hex[5]}${hex[6]}`, 16)]
}

export function calculateText(content: string, max: number, fontSize: number, ctx: CanvasRenderingContext2D): { content: string, width: number } {
  let width = ctx.measureText(content).width
  if (width > max) {
    content = content.substring(0, content.length - (width - max) / fontSize + 1)
    width = ctx.measureText(content).width
  }
  while (width > max) {
    content = content.substring(0, content.length - 1)
    width = ctx.measureText(content).width
  }
  return { content, width }
}
