<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { useRouter } from 'vue-router'
import { passwordLogin } from '@/api/user'

const router = useRouter()
const apiParams = ref({
  account: '15827465192',
  password: '54321'
})
const loginRef = ref<FormInstance>()
// 手机号码单独验证
const phonePass = (_rule: any, value: any, callback: any) => {
  if(!value) return callback(new Error('请输入手机号码'))
  setTimeout(() => {
    const reg = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
    if(!reg.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }else {
      callback()
    }
  }, 500)
}
// 密码单独验证
// const passwordPass = (_rule: any, value: any, callback: any) => {
//   if(!value) {
//     return callback(new Error('请输入密码'))
//   }
//   setTimeout(() => {
//     // 必须包含 大写英文字母 小写英文字母 英文小数点 长度 > 8
//     const reg = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F])[\da-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]{8,}$/
//     if(!reg.test(value)) {
//       console.log(`密码 + ::>>`, value)
//       return callback(new Error('密码需包含大、小写的英文字母、数字、仅一位的英文小数点, 并不少于8位'))
//     }else {
//       callback()
//     }
//   }, 500)
// }
// 表单验证
const loginRule = reactive<FormRules>({
  account: [{ validator: phonePass, trigger: 'blur' }],
  password: [{ 
    // validator: passwordPass,
    trigger: 'blur' }]
})
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      const res = await passwordLogin({ ...apiParams.value })
      if(res === '请求成功') {
        ElNotification({
          title: '操作成功',
          message: '将为您跳转至菜单页面',
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
        setTimeout(() => {
          router.push('/')
        }, 0.8 * 1000)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-950">
    <div class="flex justify-between">
      <img src="@/static/imgs/global/login_box.png">
      <div class="flex flex-col items-center justify-between py-5 text-gray-400 bg-white rounded-r-xl login-box">
        <img src="@/static/imgs/global/logo_black.png" class="w-40 h-16 ">
        <el-form :model="apiParams" :rules="loginRule" ref="loginRef">
          <el-form-item prop="account">
            <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model.number="apiParams.account" size="large" placeholder="请输入手机号码" maxlength="11" type="tel" class="el-input" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="apiParams.password" type="password" size="large" placeholder="请输入密码" maxlength="16" show-password class="el-input" @keyup.enter.native="submitForm(loginRef)" />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitForm(loginRef)" class="w-32">登录</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 348px;
  height: 348px;
}
.login-box {
  width: 348px;
  height: 348px;
  img {
    width: 160px;
    height: 64px;
  }
}
.el-input {
  width: 200px !important;
}
</style>