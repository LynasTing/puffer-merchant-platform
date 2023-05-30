<script lang="ts" setup>
import { logout } from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapse = ref(false)
const fullFlag = ref(false)
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
  if (fullFlag.value) {
    const exitFullScreen = document.exitFullscreen
    if (exitFullScreen) exitFullScreen.call(document)
  } else {
    const htmlDOM = document.documentElement
    const enterFullScreen = htmlDOM.requestFullscreen
    if (enterFullScreen) {
      enterFullScreen.call(htmlDOM)
    } else {
      ElMessage({
        message: '您的浏览器不支持全屏浏览，请升级或更换浏览器！',
        type: 'error'
      })
    }
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
  .then(async () => {
   
    const msg = await logout()
    if(msg === '请求成功') {
      ElNotification({
        title: '操作成功',
        message: '将为您跳转至登陆页面',
        type: 'success',
        showClose: false,
        duration: 1.5 * 1000
      })
      setTimeout(() => {
        router.push('/login')
      }, 1.5 * 1000);
    }
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '用户点击取消'
    })
  })
}
onMounted(() => {
  // 容错各种内核浏览器的全屏 
  document.addEventListener("fullscreenchange", () => {
    fullFlag.value = !fullFlag.value
  })
  document.addEventListener("mozfullscreenchange", () => {
    fullFlag.value = !fullFlag.value
  })
  document.addEventListener("webkitfullscreenchange", () => {
    fullFlag.value = !fullFlag.value
  })
  document.addEventListener("msfullscreenchange", () => {
    fullFlag.value = !fullFlag.value
  })
})
</script>

<template>
  <header class="flex items-center justify-between w-full h-full ">
    <i class="block text-black iconfont cursor-pointer" :class="isCollapse ? 'icon-zhankaicebianlan2x' : 'icon-shouqicebianlan2x'" @click="changeSideBar" />
    <ul class="flex items-center">
      <li @click.stop="fullScreen">
        <el-icon v-if="!fullFlag" class="align-middle cursor-pointer" size="24px" color="#333">
          <FullScreen />
        </el-icon>
        <i v-else class="block iconfont icon-tuichuquanping cursor-pointer" @keydown.esc.native />
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