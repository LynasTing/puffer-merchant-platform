<script lang="ts" setup>
import SideBar from './components/SideBar.vue'
import Header from './components/Header.vue'
import BreadCrumbsTitle from './components/BreadCrumbsTitle.vue'
import { useRoute, useRouter } from 'vue-router'

const _route = useRoute()
const isCollapse = ref(false)
const myRouter = useRouter()
const _routes = myRouter.options.routes
// 获取要在layout布局中展示的路由数组
const mainRoutes = _routes.find(v => v.name === 'Home')?.children
// 更改侧边栏状态(收缩或展开)
const changeSideBarStatus = (e: boolean) => {
  isCollapse.value = e
}
</script>

<template>
  <div class="w-full h-full">
    <el-container class="el-container">
      <el-aside width="collapse" class="h-screen el-aside select-none ">
        <el-menu :collapse="isCollapse" :default-active="_route.path" router class="el-menu-vertical h-full" background-color="#304156" active-text-color="#409eff" text-color="#BFCBD9" >
          <div class="flex items-center justify-center mr-0 h-14 min-w-min">
            <img src="@/static/imgs/global/logo_white.png" class="h-12 w-28" v-if="!isCollapse" />
            <img src="@/static/imgs/global/logo_icon.png" class="ml-1 w-7 h-7" v-else="isCollapse" />
          </div>
          <SideBar :mainRoutes="mainRoutes" />
        </el-menu>
      </el-aside>
      <el-container :class="!isCollapse ? 'main-ml-open' : 'main-ml-close'" class="flex flex-col max-h-screen overflow-y-auto">
        <el-header class="h-16 bg-white">
          <Header :changeSideBarStatus="changeSideBarStatus" />
        </el-header>
        <el-main class="py-0 bg-gray-100">
          <BreadCrumbsTitle />
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-aside {
  background-color: #545c64;
}
.el-menu-vertical {
  border: none;
}
// .main-ml-open {
//   margin-left: 153px;
// }
// .main-ml-close {
//   margin-left: 64px;
//   transition: all .5s;
// }
</style>