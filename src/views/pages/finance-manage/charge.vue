<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { financeChangeRecord, financeApplyCharge } from '@/api/finance-manage/index'
import router from '@/router'


// 展示的信息数据, 从接口获取
const tableData = ref<Finance[]>([])
let totalNum = ref<number>(0)
const recordParams = ref({
  pageNumber: 1,
  pageSize: 1
})

// 子组件分页
const subPageChange = (e: number) => {
  console.log(`触发父组件了吗  + ::>>`, e)
  recordParams.value.pageNumber = e
  getDataList()
}
const getDataList = async () => {
  const res = await financeChangeRecord({ ...recordParams.value })
  const { list, total } = res
  totalNum = total
  tableData.value = list
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
  },
  {
    label: '操作',
    prop: 'edit',
    slot: 'editSlot'
  }
])
// 删除
const toDetail = (row) => {
  console.log(`row + ::>>`, row)
  router.push('./detail.vue')
}

/**
 * @apply 充值申请相关
 */

const chargeDialog = ref(false)
const chargeRef = ref<FormInstance>()
const chargeParams = ref({
  chargeFund: '',
  remark: '',
  payFile: ''
})
const chargeRule = reactive<FormRules>({
  chargeFund: [{ required: true, trigger: 'blur', message: '请输入充值金额' }],
  remark: [{ required: false, trigger: 'blur', message: '请输入备注' }],
  payFile: [{ required: true, trigger: 'change', message: '请上传支付凭证' }]
})
// 提交提现
const applySubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res  = await financeApplyCash({ ...chargeParams }) as unknown as string
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
  chargeDialog.value = false
  chargeRef.value?.resetFields()
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="充值记录" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="primary" plain @click="chargeDialog = true">充值申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="subPageChange">
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
    <template #editSlot="{ row, index }">
      <div>
        <el-button @click="toDetail(row, index)" type="primary" plain>查询明细</el-button>
      </div>
    </template>
  </ReuseTable>
  <el-dialog v-model="chargeDialog" title="充值申请" width="500px" @closed="closeApplySubmit">
    <el-form :model="chargeParams" :rules="chargeRule" ref="chargeRef">
      <el-form-item prop="bankTitle">
        <el-input v-model.number="chargeParams.chargeFund" placeholder="请输入充值金额" maxlength="19" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
          <template #prepend>充值金额</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="bankNo">
        <el-input v-model="chargeParams.payFile"  placeholder="请上传支付凭证">
          <template #prepend>支付凭证</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="bankHandle">
        <el-input v-model.number="chargeParams.remark" placeholder="请输入备注">
          <template #prepend>备注</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeApplySubmit">取消</el-button>
      <el-button type="primary" plain @click="applySubmit(chargeRef)">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>