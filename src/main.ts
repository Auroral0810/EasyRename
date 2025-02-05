import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import type { Component } from 'vue'

/// <reference types="element-plus/global" />

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as Component)
}

app.use(pinia)  // 确保在其他插件之前注册 Pinia
app.use(ElementPlus)
app.use(router)

app.mount('#app')