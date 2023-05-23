<script lang="ts" setup>

const isCollapse = ref(false)
const fullFlag = ref(true)
const props = defineProps({
  changeSideBarStatus: {
    type: Function,
    required: true
  }
})
// 更改侧边栏收缩状态
const changeSideBar = () => {
  isCollapse.value = !isCollapse.value
  props?.changeSideBarStatus(isCollapse.value)
}
// 全屏
const fullScreen = () => {
  let element = document.documentElement
  fullFlag.value = document.fullscreenElement === null ? false : true
  if(fullFlag.value) {
    if(document.exitFullscreen) document.exitFullscreen()
  }else {
    if(element.requestFullscreen) element.requestFullscreen()
  }
}
// 登出
const logOut = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '退出登录', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    appendTo: 'body',
    center: true
  })
  .then(() => {
    ElNotification({
      title: '操作成功',
      message: '将为您跳转至登陆页面',
      type: 'success',
      showClose: false,
      duration: 2 * 1000
    })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '用户点击取消'
    })
  })
}
</script>

<template>
  <header class="flex items-center justify-between w-full h-full ">
    <i class="block text-white iconfont cursor-pointer" :class="isCollapse ? 'icon-zhankaicebianlan2x' : 'icon-shouqicebianlan2x'" @click="changeSideBar" />
    <ul class="flex items-center">
      <li @click="fullScreen" @keydown.esc.native>
        <el-icon v-if="fullFlag" class="align-middle cursor-pointer" size="24px">
          <FullScreen />
        </el-icon>
        <i v-else class="block text-white iconfont icon-tuichuquanping cursor-pointer" />
      </li>
      <li class="mx-6">河豚换电河豚换电河豚换电河豚换电</li>
      <li>
        <el-dropdown>
          <img src="@/static/imgs/global/default_cloud.jpg" class="w-8 h-8 rounded-full">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>

</style>