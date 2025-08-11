// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from '@/api/http'   // 如果你要把 axios 挂载到全局
import './index.css'

const app = createApp(App)

//  注册 Pinia
const pinia = createPinia()
app.use(pinia)

//️ 注册路由
app.use(router)


//  挂载
app.mount('#app')
