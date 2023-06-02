<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import ReuseTable from '@/components/reuse-table/index.vue'
import { financeApplyCash, financeCashRecord } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'

// 展示的信息数据, 从接口获取
const tableData = ref<Finance[]>([])
let currentPage = ref<number>(1)
let totalNum = ref<number>(0)
const recordParams = ref({
  pageNumber: 1,
  pageSize: 10,
  status: ''
})

// 子组件筛选
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(recordParams.value).includes(key)) recordParams.value[key] = e[key]
    })
    recordParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    recordParams.value = {
      pageNumber: 1,
      pageSize: 10,
      status: ''
    }
  }
  getDataList()
}
// pagination分页
const pageChange = (e: number) => {
  recordParams.value.pageNumber = currentPage.value = e
  getDataList()
}
const getDataList = async () => {
  const res = await financeCashRecord({ ...recordParams.value })
  if(res) {
    const { list, total } = res
    totalNum = total
    tableData.value = list
  }
}
const formatStatus = computed(() => {
  return function(status: number) {
    switch (status) {
      case 0:
        return '审核中'
      case 1:
        return '审核通过'
      case 2:
        return  '驳回'
    }
  }
})
getDataList()

// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '状态',
    value: '',
    key: 'status',
    type: 'select',
    options: [
      {
        label: '审核中',
        value: '0'
      },
      {
        label: '审核通过',
        value: '1'
      },
      {
        label: '驳回',
        value: '2'
      }
    ]
  }
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '银行名称',
    prop: 'bankTitle',
    slot: 'bankTitleSlot'
  },
  {
    label: '开户行',
    prop: 'bankHandle',
    slot: 'bankHandleSlot'
  },
  {
    label: '卡号',
    prop: 'bankNo',
    slot: 'bankNoSlot'
  },
  {
    label: '姓名',
    prop: 'name',
    slot: 'nameSlot'
  },
  {
    label: '手机号',
    prop: 'phone',
    slot: 'phoneSlot'
  },
  {
    label: '提现金额',
    prop: 'cashFund',
    slot: 'cashFundSlot'
  },
  {
    label: '审核状态',
    prop: 'status',
    slot: 'statusSlot'
  },
  {
    label: '申请时间',
    prop: 'ctime',
    slot: 'ctimeSlot'
  },
  {
    label: '备注',
    prop: 'remark',
    slot: 'remarkSlot'
  }
])

/**
 * @apply 新增提现相关
 */

const applyDialog = ref(false)
const applyRef = ref<FormInstance>()
const applyParams = ref({
  bankTitle: '',
  bankHandle: '',
  bankNo: '',
  name: '',
  phone: '',
  cashFund: '',
})
const cardPass = (_rule: any, value: any, callback: any) => {
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
  bankHandle: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
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
      const res = await financeApplyCash({ ...applyParams.value }) as unknown as string
      if(res === '请求成功') {
        ElNotification({
          title: '操作成功',
          message: res,
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
        getDataList()
        closeApplySubmit()
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
  <InquireCard :inquireInfo="inquireInfo" title="提现记录" @getChildren="getChildren">
    <template #btnSlot>
      <el-button type="primary" plain @click="applyDialog = true">提现申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
    <template #bankTitleSlot="{ row }">
      {{ row.bankTitle || '--' }}
    </template>
    <template #bankHandleSlot="{ row }">
      {{ row.bankHandle || '--' }}
    </template>
    <template #bankNoSlot="{ row }">
      {{ row.bankNo || '--' }}
    </template>
    <template #nameSlot="{ row }">
      {{ row.name || '--' }}
    </template>
    <template #phoneSlot="{ row }">
      {{ row.phone || '--' }}
    </template>
    <template #cashFundSlot="{ row }">
      {{ row.cashFund || '--' }}
    </template>
    <template #statusSlot="{ row }">
      <span>{{ formatStatus(row.status) || '--' }}</span>
    </template>
    <template #ctimeSlot="{ row }">
      <span>{{ row.ctime || '--' }}</span>
    </template>
    <template #remarkSlot="{ row }">
      {{ row.remark || '--' }}
    </template>
  </ReuseTable>
  <el-dialog v-model="applyDialog" title="提现申请" width="500px" @closed="closeApplySubmit">
    <el-form :model="applyParams" :rules="applyRule" ref="applyRef" label-width="100px" label-position="left">
      <el-form-item prop="bankTitle" label="银行名称">
        <el-input v-model.number="applyParams.bankTitle" placeholder="请输入银行名称" />
      </el-form-item>
      <el-form-item prop="bankHandle" label="开户行">
        <el-input v-model.number="applyParams.bankHandle" placeholder="请输入开户行" />
      </el-form-item>
      <el-form-item prop="bankNo" label="卡号" required>
        <el-input v-model="applyParams.bankNo" maxlength="19" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入银行卡号" />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="applyParams.name" placeholder="请输入姓名" max-length="12" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model.number="applyParams.phone" maxlength="11" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item prop="cashFund" label="提现金额">
        <el-input v-model.number="applyParams.cashFund" maxlength="7" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入提现金额" />
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeApplySubmit">取消</el-button>
      <el-button type="primary" plain @click="applySubmit(applyRef)">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>