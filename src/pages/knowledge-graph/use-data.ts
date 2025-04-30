import type { Edge, GraphData, Node } from './type'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { debounce } from 'lodash'
import { computed, ref } from 'vue'
import { KNOWLEDGE_GRAPH_FILE_EDGE, KNOWLEDGE_GRAPH_FILE_NODE } from '../../global/constant'
import { hex2rgb, transModelIndex2Color } from './util'

export const NODE_ITEM_SIZE = 7
export const OS_NODE_ITEM_SIZE = NODE_ITEM_SIZE
export const SELECTED_NODE_SIZE = NODE_ITEM_SIZE * 2
export const RELATION_ITEM_SIZE = 8
export const OS_RELATION_ITEM_SIZE = 12
export const SELECTED_RELATION_SIZE = OS_RELATION_ITEM_SIZE

const INIT_NODE: Node[] = [
  { label: 'STRUCTURE', uuid: 'bfa0083a-b73a-4a3d-a00e-8f7b97961a86', name: '计算机', x: 0, y: 0, r: 50 },
  { label: 'STRUCTURE', uuid: '83795e70-0f82-4856-944c-9d624384e623', name: '编程语言', x: 100, y: 0, r: 50 },
  { label: 'LANGUAGE', uuid: 'a24d2862-536b-4f94-b396-feed4ac643fa', name: 'JavaScript', x: -100, y: 0, r: 50 },
  { label: 'LANGUAGE', uuid: '96f872e2-6c0b-471a-a75d-05cced04b04f', name: 'rust', x: 0, y: 100, r: 50 },
  { label: 'STRUCTURE', uuid: '10d1c545-9d69-4513-afd7-8d07c45c5867', name: '工具', x: 0, y: -100, r: 50 },
]
const INIT_EDGE: Edge[] = [
  { label: 'RELATION', source: 'bfa0083a-b73a-4a3d-a00e-8f7b97961a86', target: '83795e70-0f82-4856-944c-9d624384e623' },
  { label: '', source: 'bfa0083a-b73a-4a3d-a00e-8f7b97961a86', target: '10d1c545-9d69-4513-afd7-8d07c45c5867' },
  { label: '', source: '83795e70-0f82-4856-944c-9d624384e623', target: 'a24d2862-536b-4f94-b396-feed4ac643fa' },
  { label: '', source: '83795e70-0f82-4856-944c-9d624384e623', target: '96f872e2-6c0b-471a-a75d-05cced04b04f' },
]

export default function useData() {
  const nodeList = ref<Node[]>([])
  const edgeList = ref<Edge[]>([])

  const graph = computed<GraphData>(() => {
    return trans(nodeList.value, edgeList.value)
  })

  async function load() {
    const nc = await readTextFile(KNOWLEDGE_GRAPH_FILE_NODE, { baseDir: BaseDirectory.Document })
    nodeList.value = JSON.parse(nc)
    const ec = await readTextFile(KNOWLEDGE_GRAPH_FILE_EDGE, { baseDir: BaseDirectory.Document })
    edgeList.value = JSON.parse(ec)
  }

  async function init() {
    await writeTextFile(KNOWLEDGE_GRAPH_FILE_NODE, JSON.stringify(INIT_NODE), { baseDir: BaseDirectory.Document })
    await writeTextFile(KNOWLEDGE_GRAPH_FILE_EDGE, JSON.stringify(INIT_EDGE), { baseDir: BaseDirectory.Document })
  }

  async function addNode(n: Node) {
    nodeList.value.push(n)
    await writeTextFile(KNOWLEDGE_GRAPH_FILE_NODE, JSON.stringify(nodeList.value), { baseDir: BaseDirectory.Document })
    await load()
  }

  async function addEdge() {

  }

  async function removeNode(uuid: string) {
    const i = nodeList.value.findIndex(x => x.uuid === uuid)
    if (i === -1) {
      return
    }
    nodeList.value.splice(i, 1)
    await writeTextFile(KNOWLEDGE_GRAPH_FILE_NODE, JSON.stringify(nodeList.value), { baseDir: BaseDirectory.Document })
    await load()
  }

  async function move(uuid: string, x: number, y: number) {
    const i = nodeList.value.findIndex(x => x.uuid === uuid)
    if (i === -1) {
      return
    }
    nodeList.value[i].x = x
    nodeList.value[i].y = y
    await writeTextFile(KNOWLEDGE_GRAPH_FILE_NODE, JSON.stringify(nodeList.value), { baseDir: BaseDirectory.Document })
    await load()
  }

  async function editNode() {

  }

  return { nodeList, edgeList, graph, load, init, addNode, removeNode, move: debounce(move, 1000) }
}

function trans(nl: Node[], el: Edge[]): GraphData {
  const nodeLength = nl.length
  const nodeList = new Int32Array(nodeLength * NODE_ITEM_SIZE)
  const osNodeList = new Int32Array(nodeLength * OS_NODE_ITEM_SIZE)
  const nodeTextList: string[] = Array.from({ length })
  for (let i = 0; i < nodeLength; i++) {
    const { x, y, r, name } = nl[i]
    const c = hex2rgb('#000000')
    nodeList![NODE_ITEM_SIZE * i + 0] = x
    nodeList![NODE_ITEM_SIZE * i + 1] = y
    nodeList![NODE_ITEM_SIZE * i + 2] = r
    nodeList![NODE_ITEM_SIZE * i + 3] = c[0]
    nodeList![NODE_ITEM_SIZE * i + 4] = c[1]
    nodeList![NODE_ITEM_SIZE * i + 5] = c[2]
    nodeList![NODE_ITEM_SIZE * i + 6] = 255

    nodeTextList[i] = name

    const [cr, cg, cb, ca] = transModelIndex2Color('node', i)
    osNodeList![OS_NODE_ITEM_SIZE * i + 0] = x
    osNodeList![OS_NODE_ITEM_SIZE * i + 1] = y
    osNodeList![OS_NODE_ITEM_SIZE * i + 2] = r
    osNodeList![OS_NODE_ITEM_SIZE * i + 3] = cr
    osNodeList![OS_NODE_ITEM_SIZE * i + 4] = cg
    osNodeList![OS_NODE_ITEM_SIZE * i + 5] = cb
    osNodeList![OS_NODE_ITEM_SIZE * i + 6] = ca
  }

  const relationLength = el.length
  const relationList = new Int32Array(relationLength * RELATION_ITEM_SIZE)
  const osRelationList = new Int32Array(relationLength * OS_RELATION_ITEM_SIZE)
  const relationTextList: string[] = Array.from({ length: relationLength })
  for (let i = 0; i < relationLength; i++) {
    const { source, target, label } = el[i]

    const fromIndex = nl.findIndex(m => m.uuid === source)
    const toIndex = nl.findIndex(m => m.uuid === target)

    const { x: x1, y: y1, r: r1 } = nl[fromIndex]
    const { x: x2, y: y2, r: r2 } = nl[toIndex]

    const [ax, ay, bx, by, mx3, my3, mx4, my4] = calculateRelationPointsByTwoCircleCenter(x1, y1, r1, x2, y2, r2)

    relationList[RELATION_ITEM_SIZE * i + 0] = ax
    relationList[RELATION_ITEM_SIZE * i + 1] = ay
    relationList[RELATION_ITEM_SIZE * i + 2] = bx
    relationList[RELATION_ITEM_SIZE * i + 3] = by
    relationList[RELATION_ITEM_SIZE * i + 4] = mx3
    relationList[RELATION_ITEM_SIZE * i + 5] = my3
    relationList[RELATION_ITEM_SIZE * i + 6] = mx4
    relationList[RELATION_ITEM_SIZE * i + 7] = my4

    relationTextList[i] = label

    const [px1, py1, px2, py2, px3, py3, px4, py4] = calculateRectPoint(ax, ay, bx, by, 10)
    const [lr, lg, lb, la] = transModelIndex2Color('relation', i)
    osRelationList[OS_RELATION_ITEM_SIZE * i + 0] = px1
    osRelationList[OS_RELATION_ITEM_SIZE * i + 1] = py1
    osRelationList[OS_RELATION_ITEM_SIZE * i + 2] = px2
    osRelationList[OS_RELATION_ITEM_SIZE * i + 3] = py2
    osRelationList[OS_RELATION_ITEM_SIZE * i + 4] = px3
    osRelationList[OS_RELATION_ITEM_SIZE * i + 5] = py3
    osRelationList[OS_RELATION_ITEM_SIZE * i + 6] = px4
    osRelationList[OS_RELATION_ITEM_SIZE * i + 7] = py4
    osRelationList[OS_RELATION_ITEM_SIZE * i + 8] = lr
    osRelationList[OS_RELATION_ITEM_SIZE * i + 9] = lg
    osRelationList[OS_RELATION_ITEM_SIZE * i + 10] = lb
    osRelationList[OS_RELATION_ITEM_SIZE * i + 11] = la
  }

  return {
    nodeList,
    osNodeList,
    nodeTextList,
    nodeDetailList: nl,

    relationList,
    osRelationList,
    relationTextList,
    relationDetailList: el,
  }
}

export function calculateRelationPointsByTwoCircleCenter(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): [number, number, number, number, number, number, number, number] {
  const [ax, ay, bx, by] = calculateIntersectionPointsOfTwoCircleCenter(x1, y1, r1, x2, y2, r2)
  const [cx, cy, dx, dy] = calculateIntersectionPointsOfTwoCircleCenter(ax, ay, 10, bx, by, 20)
  const [, , , , mx3, my3, mx4, my4] = calculateRectPoint(cx, cy, dx, dy, 10)
  return [ax, ay, bx, by, mx3, my3, mx4, my4]
}

// 计算俩点连线与两个圆的交点
export function calculateIntersectionPointsOfTwoCircleCenter(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): [number, number, number, number] {
  // 计算向量AB
  const ABx = x2 - x1
  const ABy = y2 - y1

  // 计算AB的长度
  const ABLength = Math.sqrt(ABx * ABx + ABy * ABy)

  // 单位化向量AB
  const unitABx = ABx / ABLength
  const unitABy = ABy / ABLength

  // 计算向量AR和向量BR
  const ARx = unitABx * r1
  const ARy = unitABy * r1
  const BRx = -unitABx * r2
  const BRy = -unitABy * r2

  // 计算交点坐标
  const ax = x1 + ARx
  const ay = y1 + ARy
  const bx = x2 + BRx
  const by = y2 + BRy

  return [ax, ay, bx, by]
}

// 根据2点计算矩形4个顶点
export function calculateRectPoint(x1: number, y1: number, x2: number, y2: number, r: number): [number, number, number, number, number, number, number, number] {
  const slope = (y2 - y1) / (x2 - x1)
  const perpendicularSlope = -1 / slope
  const angle = Math.atan(perpendicularSlope)

  const A = {
    x: x1 + r * Math.cos(angle),
    y: y1 + r * Math.sin(angle),
  }

  const B = {
    x: x1 - r * Math.cos(angle),
    y: y1 - r * Math.sin(angle),
  }

  const C = {
    x: x2 + r * Math.cos(angle),
    y: y2 + r * Math.sin(angle),
  }

  const D = {
    x: x2 - r * Math.cos(angle),
    y: y2 - r * Math.sin(angle),
  }

  return [A.x, A.y, B.x, B.y, D.x, D.y, C.x, C.y]
}
