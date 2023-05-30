import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/iconfont.css'
import "nprogress/nprogress.css"
import 'default-passive-events'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import router from './router'
import { store } from '@/store'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')
