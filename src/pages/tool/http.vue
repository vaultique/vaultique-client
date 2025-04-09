<script setup lang="ts">
import { BaseDirectory, readDir, readTextFile, remove, writeTextFile } from '@tauri-apps/plugin-fs'
import { ref } from 'vue'
import { HTTP_CACHE_DIR } from '../../global/constant'
import { sendHttpRequest } from '../../invokes/http'
import HeaderBar from './header-bar.vue'

const MAX_HISTORY_COUNT = 10

const url = ref<string>('http://192.168.104.117:8099/us-api/user/login')
// const url = ref<string>('http://www.baidu.com');
const method = ref<string>('POST')
const headers = ref<Record<string, string>>({
  'Content-Type': 'application/json',
})
const body = ref<string>('{"username":"admin","password":"admin"}')

const response = ref('')

const historyList = ref<string[]>([])

loadCache()

async function handleSendHttpRequest(): Promise<void> {
  const res = await sendHttpRequest({
    url: url.value,
    method: method.value,
    headers: headers.value,
    body: body.value,
  })
  response.value = res
  await addCache(JSON.stringify(res))
  await loadCache()
}

async function addCache(cache: string): Promise<void> {
  await writeTextFile(`${HTTP_CACHE_DIR}\\${new Date().getTime()}`, cache, { baseDir: BaseDirectory.Document })
}

async function loadCache(): Promise<void> {
  const entries = await readDir(HTTP_CACHE_DIR, { baseDir: BaseDirectory.Document })
  const list = entries
    .filter(x => x.isFile)
    .sort((a, b) => Number.parseInt(b.name) - Number.parseInt(a.name))
  let count = 0
  const collect: string[] = []
  const removeCollect: string[] = []
  for (const entry of list) {
    if (count >= MAX_HISTORY_COUNT) {
      removeCollect.push(entry.name)
      break
    }
    const path = `${HTTP_CACHE_DIR}\\${entry.name}`
    const content = await readTextFile(path, { baseDir: BaseDirectory.Document })
    collect.push(content)
    count++
  }
  historyList.value = collect

  removeCacheList(removeCollect)
}

async function removeCacheList(list: string[]): Promise<void> {
  for await (const name of list) {
    const path = `${HTTP_CACHE_DIR}\\${name}`
    await remove(path, { baseDir: BaseDirectory.Document })
  }
}
</script>

<template>
  <div class="too-http">
    <HeaderBar />
    <div>
      <button @click="handleSendHttpRequest">
        发送HTTP请求
      </button>
    </div>

    <div>{{ response }}</div>

    <div>history</div>
    <div v-for="(n, i) in historyList" :key="i">
      {{ n }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.too-http {
  display: flex;
  flex-direction: column;
}
</style>
