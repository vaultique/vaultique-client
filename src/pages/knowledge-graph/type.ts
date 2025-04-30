
export type Node = {
  label: string
  uuid: string
  name: string
  x: number
  y: number
  r: number
}

export type Edge = {
  label: string
  source: string
  target: string
}

export type GraphData = {
  nodeList: Int32Array // x,y,r,r,g,b,a
  osNodeList: Int32Array // x,y,r,r,g,b,a x,y,r,r,g,b,a
  nodeTextList: string[]
  nodeDetailList: Node[]

  relationList: Int32Array // x,y,x,y,x,y,x,y
  osRelationList: Int32Array // x,y,x,y,x,y,x,y,r,g,b,a
  relationTextList: string[]
  relationDetailList: Edge[]
}
