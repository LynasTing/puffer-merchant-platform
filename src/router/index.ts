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
          // {
          //   path: '/finance-overview',
          //   name: 'financeOverview',
          //   meta: { icon: 'List', title: '财务总览' },
          //   component: () => import('@/views/pages/finance-manage/overview.vue')
          // },
          {
            path: '/finance-details',
            name: 'financeDetails',
            meta: { icon: 'List', title: '账户明细' },
            component: () => import('@/views/pages/finance-manage/details/index.vue'),
            children: [
              {
                path: '/overview',
                name: 'financeOverview',
                meta: { icon: 'View', title: '总览' },
                component: () => import('@/views/pages/finance-manage/details/overview.vue')
              },
              {
                path: '/apply-cash',
                name: 'financeApplyCash',
                meta: { icon: 'Memo', title: '提现单' },
                component: () => import('@/views/pages/finance-manage/details/applyCash.vue')
              },
              {
                path: '/charge-records',
                name: 'financeChargeRecord',
                meta: { icon: 'Money', title: '充值单' },
                component: () => import('@/views/pages/finance-manage/details/charge.vue')
              }
            ]
          },
          {
            path: '/finance-secondary',
            name: 'financeSecondary',
            meta: { icon: 'CopyDocument', title: '二级商户信息' },
            component: () => import('@/views/pages/finance-manage/secondary.vue')
          },
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
  {
    path: '/404',
    component: () => import('@/views/pages/error/404.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
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
