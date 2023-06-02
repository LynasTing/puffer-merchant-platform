import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import NProgress from "nprogress"
// import { cancelAsk } from '@/utils/request'

NProgress.configure({ showSpinner: false })
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/pages/login/index.vue')
  },
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'merchantOverview' },
    component: Layout,
    children: [
      {
        path: '/merchant-manage',
        name: 'merchantManage',
        meta: { icon: 'Management', title: '商户管理' },
        component: () => import('@/views/pages/merchant-manage/index.vue'),
        children: [
          {
            path: '/merchant-overview',
            name: 'merchantOverview',
            meta: { icon: 'HomeFilled', title: '商户概览' },
            component: () => import('@/views/pages/merchant-manage/overview.vue')
          },
        ]
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
        meta: { icon: 'Wallet', title: '商户财务管理' },
        component: () => import('@/views/pages/finance-manage/index.vue'),
        children: [
          {
            path: '/finance-overview',
            name: 'financeOverview',
            meta: { icon: 'List', title: '财务总览' },
            component: () => import('@/views/pages/finance-manage/overview.vue')
          },
          {
            path: '/finance-secondary',
            name: 'financeSecondary',
            meta: { icon: 'Search', title: '二级商户信息' },
            component: () => import('@/views/pages/finance-manage/secondary.vue')
          },
          {
            path: '/finance-apply-cash',
            name: 'financeApplyCash',
            meta: { icon: 'Memo', title: '提现记录' },
            component: () => import('@/views/pages/finance-manage/applyCash.vue')
          },
          {
            path: '/finance-charge-records',
            name: 'financeChargeRecord',
            meta: { icon: 'Money', title: '充值记录' },
            component: () => import('@/views/pages/finance-manage/charge.vue')
          }
        ]
      },
      // {
      //   path: '/rider-change-battery-records',
      //   name: 'RiderChangeBatteryRecords',
      //   meta: { icon: 'Bicycle', title: '骑手换电记录' },
      //   component: () => import('@/views/pages/rider-change-battery-records/index.vue')
      // }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // cancelAsk()
  NProgress.start() 
  next()
})
router.afterEach(() => {
  NProgress.done() 
})

export default router
