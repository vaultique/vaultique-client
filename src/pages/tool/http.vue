<script setup lang="ts">
import type { HTTP_METHOD } from './use-http'
import { VDropdown } from '../../components'
import { sendHttpRequest } from '../../invokes/http'
import HeaderBar from './header-bar.vue'
import useHttp from './use-http'
import useHttpHistory from './use-http-history'

const { url, method, request, response, methodList, setMethod } = useHttp()

const { historyList, loadCache, addCache } = useHttpHistory()

loadCache()

async function handleSendHttpRequest(): Promise<void> {
  const res = await sendHttpRequest(request.value)
  response.value = res
  await addCache(JSON.stringify(res))
  await loadCache()
}
</script>

<template>
  <div class="http-page">
    <HeaderBar />
    <div class="base-info">
      <VDropdown :list="methodList" @select="option => setMethod(option.value as HTTP_METHOD)">
        <div class="http-method">
          {{ method }}
        </div>
      </VDropdown>
      <input v-model="url" class="http-url" type="text">
      <button class="send" @click="handleSendHttpRequest">
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
.http-page {
  display: flex;
  flex-direction: column;
}

.base-info {
  display: flex;
  flex-direction: row;

  &>.http-method {
    flex: 0 0 100px;
  }

  &>.http-url {
    flex: 1;
  }
}
</style>
