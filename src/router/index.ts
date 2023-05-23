import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import NProgress from "nprogress"

NProgress.configure({ showSpinner: false })
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'merchantManage' },
    component: Layout,
    children: [
      {
        path: '/merchant-manage',
        name: 'merchantManage',
        meta: { icon: 'Management', title: '商户管理' },
        component: () => import('@/views/pages/merchant-manage/index.vue')
      },
      {
        path: '/merchant-user-manage',
        name: 'merchantUserManage',
        meta: { icon: 'User', title: '商户用户管理' },
        component: () => import('@/views/pages/merchant-user-manage/index.vue')
      },
      {
        path: '/finance-manage',
        name: 'financeManage',
        meta: { icon: 'Wallet', title: '财务管理' },
        component: () => import('@/views/pages/finance-manage/index.vue')
      },
      {
        path: '/rider-change-battery-records',
        name: 'RiderChangeBatteryRecords',
        meta: { icon: 'Bicycle', title: '骑手换电记录' },
        component: () => import('@/views/pages/rider-change-battery-records/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/pages/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start() 
  next()
})
router.afterEach(() => {
  NProgress.done() 
})

export default router
