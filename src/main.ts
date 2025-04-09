import { createApp } from 'vue'
import App from './App.vue'
import { useFile, useWindow } from './global'
import router from './router'

import './styles/index.less'

const { init: initWindowInfo } = useWindow()
const { init: initFile } = useFile()

bootstrap()

async function bootstrap(): Promise<void> {
  await initWindowInfo()
  await initFile()

  createApp(App)
    .use(router)
    .mount('#app')
}
