import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  // 基础功能
  {
    path: '/batch-rename',
    name: 'BatchRename',
    component: () => import('@/views/BatchRename/index.vue'),
    meta: {
      title: '批量重命名',
      parent: '基础功能',
      group: '1'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about.vue'),
    meta: { title: '关于我们' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 