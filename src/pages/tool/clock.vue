<script setup lang="ts">
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'
import { computed, ref } from 'vue'
import { HALF_HOUR } from './constant'
import HeaderBar from './header-bar.vue'

const countdown = ref<number>(HALF_HOUR)
const text = computed<string>(() => {
  const m = Math.floor(countdown.value / 60)
  const s = countdown.value % 60
  return `${m}:${s}`
})

let timer: number | undefined

function handleCountdown(): void {
  if (timer === undefined) {
    countdown.value = HALF_HOUR
    timer = window.setInterval(() => {
      countdown.value = countdown.value - 1
      if (countdown.value === 0) {
        notice()
        window.clearInterval(timer)
        timer = undefined
      }
    }, 1000)
  }
  else {
    countdown.value = HALF_HOUR
  }
}

async function notice(): Promise<void> {
  let permissionGranted = await isPermissionGranted()

  // 如果没有，我们需要请求它
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
  }

  // 一旦获得许可，我们就可以发送通知
  if (permissionGranted) {
    sendNotification({ title: 'Vaultique', body: 'time is over' })
  }
}
</script>

<template>
  <div class="clock-page">
    <HeaderBar />
    <div>
      <button @click="handleCountdown">
        倒计时30分钟
      </button>
    </div>
    <div class="count-down">
      {{ text }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.clock-page {

  .count-down {
    font-size: 36px;
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>
