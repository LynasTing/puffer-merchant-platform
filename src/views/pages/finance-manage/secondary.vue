<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { TableOption, InquireType } from '@/types/table'
import ReuseTable from '@/components/reuse-table/index.vue'
import { financeSubMerchant } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'

// 展示的信息数据, 从接口获取
const subMerParams = ref({
  pageNumber: 1,
  pageSize: 10
})
let currentPage = ref<number>(1)
// 获取筛选条件
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(subMerParams.value).includes(key)) subMerParams.value[key] = e[key]
    })
    subMerParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    subMerParams.value = {
      pageNumber: 1,
      pageSize: 10
    }
  }
  getDataList()
}
// pagination分页
const pageChange = (e: number) => {
  subMerParams.value.pageNumber = currentPage.value =   e
  getDataList()
}
let totalNum = ref<Number>(0)
const tableData = ref<Finance[]>([])
const getDataList = async () => {
  const res = await financeSubMerchant({ ...subMerParams.value })
  if(res) {
    const { list, total } = res
    tableData.value = list
    totalNum.value = total
  }
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
  }
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

</script>

<template>
  <div class="mb-6 text-2xl font-semibold card-header">二级商户信息</div>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
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