import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/iconfont.css'
import "nprogress/nprogress.css"
import router from './router'
import { store } from '@/store'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(store)
app.mount('#app')
