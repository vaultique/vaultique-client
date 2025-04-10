import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const TOOL_RECORD: Record<string, { name: string, title: string }> = {
  BASE64: { name: 'base64', title: 'base64编解码' },
  UUID: { name: 'uuid', title: 'UUID生成' },
  TIMESTAMP: { name: 'timestamp', title: '时间戳' },
  HTTP: { name: 'http', title: 'HTTP测试' },
  WEB_SOCKET: { name: 'web-socket', title: 'WebSocket测试' },
  CLOCK: { name: 'clock', title: '时钟' },
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/tool-list',
    component: () => import('@/pages/tool-list/index.vue'),
  },
  {
    path: '/todo',
    component: () => import('@/pages/todo/index.vue'),
  },
  {
    path: '/calendar',
    component: () => import('@/pages/calendar/index.vue'),
  },
  {
    path: '/log',
    component: () => import('@/pages/log/index.vue'),
  },
]

Object.values(TOOL_RECORD).forEach((tool) => {
  routes.push({
    path: `/tool/${tool.name}`,
    component: () => import(`@/pages/tool/${tool.name}.vue`),
  })
})

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
