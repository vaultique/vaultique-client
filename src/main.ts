import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { useFile, useStore, useWindow } from './global'
import router from './router'
import './styles/index.less'

// TODO save in rust and load before app open
const { init: initWindowInfo } = useWindow()
const { init: initFile } = useFile()

bootstrap()

async function bootstrap(): Promise<void> {
  await initFile()

  const pinia = createPinia()
  const app = createApp(App)
  app.use(router)
  app.use(pinia)

  const { init: initStore } = useStore()

  await initWindowInfo()
  await initStore()

  app.mount('#app')
}
