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
      <el-aside width="collapse" class="h-screen el-aside select-none">
        <el-menu :collapse="isCollapse" :default-active="_route.fullPath" router class="el-menu-vertical" background-color="#545c64" active-text-color="#ffd04b" text-color="#fff" >
          <div class="flex items-center justify-center mr-0 h-14">
            <img src="@/static/imgs/global/logo_small.png" class="h-12 w-28" v-if="!isCollapse" />
            <img src="@/static/imgs/global/logo_icon.png" class="ml-1 w-7 h-7" v-else="isCollapse" />
          </div>
          <SideBar :mainRoutes="mainRoutes" />
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="h-16 text-white bg-gray-700 ">
          <Header :changeSideBarStatus="changeSideBarStatus" />
        </el-header>
        <el-main class="py-0 bg-gray-200 ">
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
</style>