<script lang="ts" setup>
import { logout, passwdChange } from '@/api/user'
import { useRouter } from 'vue-router'
import { SwitchButton, Edit } from '@element-plus/icons'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'

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
      }, 1.5 * 1000)
    }
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '您点击了取消'
    })
  })
}
// 修改密码
const editDialog = ref<Boolean>(false)
const editRef = ref<FormInstance>()
const editParams = ref({ oldPassword: '', newPassword: '' })
// 密码验证
const passwordPass = (_rule: any, value: any, callback: any) => {
  if(!value) return callback(new Error('请输入密码'))
  setTimeout(() => {
    // 必须包含 大写英文字母 小写英文字母 英文小数点 长度 > 8
    const reg = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F])[\da-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]{8,}$/
    if(!reg.test(value)) {
      return callback(new Error('密码需各包含大、小写的英文字母、数字、仅一位的英文小数点, 并不少于8位'))
    }else {
      callback()
    }
  }, 500)
}
const editRule = reactive<FormRules>({
  oldPassword: [{ required: true, trigger: 'blur', message: '请输入您的旧密码' }, { min: 5, max: 16, message: '请输入8~16位字符' }],
  newPassword: [{ required: true, trigger: 'blur', message: '请输入您的新密码' }, { min: 5, max: 16, message: '请输入8~16位字符' }]
  // newPassword: [{ validator: passwordPass, required: true }, { min: 8, max: 16, message: '请输入8~16位字符' }]
})
// 取消修改密码
const editCancel = () => {
  editDialog.value = false
  editRef.value?.resetFields()
}
// 提交修改密码
const editSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res = await passwdChange({ ...editParams.value }) 
      if(res === '请求成功') {
        await logout()
        editCancel()
        ElNotification({
          title: '操作成功，请您重新登录',
          message: res,
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
        setTimeout(() => {
          router.push('/login')
        }, 1.5 * 1000)
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}
const editPassWord = () => {
  editDialog.value = true
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
              <el-dropdown-item :icon="Edit" @click="editPassWord">修改密码</el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" @click="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>
  </header>
  <el-dialog v-model="editDialog" width="450px" title="修改登录密码" @close="editCancel">
    <el-form :model="editParams" :rules="editRule" ref="editRef" label-position="right">
      <el-form-item prop="oldPassword" label="旧密码" class="items-center">
        <el-input v-model="editParams.oldPassword" type="password" size="large" placeholder="请输入旧密码" maxlength="16" show-password class="el-input" />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码" class="items-center">
        <el-input v-model="editParams.newPassword" type="password" size="large" placeholder="请输入新密码" maxlength="16" show-password class="el-input" />
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="editCancel">取消</el-button>
      <el-button type="primary" plain @click="editSubmit(editRef)">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>