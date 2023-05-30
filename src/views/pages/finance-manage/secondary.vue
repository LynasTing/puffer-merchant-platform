<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import ReuseTable from '@/components/reuse-table/index.vue'
import { financeSubMerchant } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'
import router from '@/router'

// 展示的信息数据, 从接口获取
const subMerParams = ref({
  pageNumber: 1,
  pageSize: 10
})
let totalNum = ref<Number>(0)
const tableData = ref<Finance[]>([])
const getDataList = async () => {
  const res = await financeSubMerchant({ ...subMerParams })
  const { list, total } = res
  tableData.value = list
  totalNum.value = total
}
// 子组件table过滤
const filterMethod = e => {
  console.log(`e + ::>>`, e)
}
getDataList()

// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '商户名称',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '订单号',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '时间',
    value: '',
    key: 'date',
    type: 'date'
  },
  // {
  //   label: '姓名',
  //   value: '',
  //   key: 'username',
  //   type: 'input'
  // },
  // {
  //   label: '手机号',
  //   value: '',
  //   key: 'input',
  //   type: 'input'
  // },
  // {
  //   label: '性别',
  //   value: '',
  //   key: 'sex',
  //   options: [
  //     {
  //       label: '男',
  //       value: 1
  //     },
  //     {
  //       label: '女',
  //       value: 0
  //     },
  //   ],
  //   type: 'select'
  // },
 
  
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '归属商户',
    prop: 'superior',
    slot: 'superiorSlot'
  },
  {
    label: '商户名称',
    prop: 'name',
    slot: 'nameSlot'
  },
  {
    label: '手机号',
    prop: 'phone',
    slot: 'phoneSlot'
  },
  {
    label: '信用等级',
    prop: 'merCredit',
    slot: 'merCreditSlot',
    
  },
  {
    label: '账户余额',
    prop: 'resueFund',
    slot: 'resueFundSlot'
  },
  {
    label: '冻结金额',
    prop: 'freezeFund',
    slot: 'freezeFundSlot'
  },
  {
    label: '注册时间',
    prop: 'registerTime',
    slot: 'registerTimeSlot'
  }
])
// 删除
const toDetail = (row) => {
  console.log(`row + ::>>`, row)
  router.push('./detail.vue')
}

/**
 * @apply 提现相关
 */

const applyDialog = ref(false)
const applyRef = ref<FormInstance>()
const applyParams = ref({
  bankTitle: '',
  bankHandler: '',
  bankNo: '',
  name: '',
  phone: '',
  cashFund: '',
})
const cardPass = (_rule: any, value: any, callback: any) => {
  console.log(`value + ::>>`, value)
  if(!value) return callback(new Error('请输入银行卡号'))
  setTimeout(() => {
    const regExp = /^([1-9]{1})(\d{14}|\d{18})$/; 
    if(!regExp.test(value.trim())) {
      return callback(new Error('请输入正确的银行卡号(15 ~ 19位)')) 
    }else {
      callback()
    }
  }, 500)
}
const applyRule = reactive<FormRules>({
  bankTitle: [{ required: true, trigger: 'blur', message: '请输入银行名称' }],
  bankHandler: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankNo: [{ validator: cardPass, trigger: 'blur' }],
  name: [{ required: true, trigger: 'blur', message: '请输入持卡人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入银行预留号码' }],
  cashFund: [{ required: true, trigger: 'blur', message: '请输入提现金额' }]
})
// 提交提现
const applySubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res  = await financeApplyCash({ ...applyParams }) as unknown as string
      if(res === '请求成功') {
        ElNotification({
          title: '操作成功',
          message: res,
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}
// 关闭提现弹窗
const closeApplySubmit = () => {
  applyDialog.value = false
  applyRef.value?.resetFields()
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="二级商户信息" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="primary" plain @click="applyDialog = true">提现申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum">
    <template #superiorSlot="{ row }">
      {{ row.superior || '--' }}
    </template>
    <template #nameSlot="{ row }">
      {{ row.name || '--' }}
    </template>
    <template #userCountSlot="{ row }">
      {{ row.userCount || '--' }}
    </template>
    <template #phoneSlot="{ row }">
      {{ row.phone || '--' }}
    </template>
    <template #merCreditSlot="{ row }">
      {{ row.merCredit || 0 }}
    </template>
    <template #resueFundSlot="{ row }">
      {{ row.resueFund || '--' }}
    </template>
    <template #freezeFundSlot="{ row }">
      {{ row.freezeFund || '--' }}
    </template>
    <template #registerTimeSlot="{ row }">
      {{ row.registerTime || '--' }}
    </template>
  </ReuseTable>
</template>

<style lang="scss" scoped>

</style>