<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import HeaderBar from './header-bar.vue'

// 参考 https://tool.chinaz.com/tools/unixtime.aspx

const timestamp = ref<number>(dayjs().unix())
const mode = ref<'s' | 'ms'>('s')
const text = computed<number>(() => timestamp.value * (mode.value === 's' ? 1 : 1000))
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    timestamp.value = dayjs().unix()
  }, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
})

const time = ref<string>('')
const date = ref<string>('')
function handleTrans(): void {
  date.value = dayjs.unix(Number(time.value)).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <div class="timestamp-page">
    <HeaderBar />
    <div>
      <div>
        <button @click="mode = 's'">
          秒
        </button>
        <button @click="mode = 'ms'">
          毫秒
        </button>
      </div>
      <div>现在的Unix时间戳(Unix timestamp)是: {{ text }}</div>

      <div style="margin-top: 24px;">
        <button @click="handleTrans">
          时间戳转日期
        </button>
        <input v-model="time" type="text">
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>
