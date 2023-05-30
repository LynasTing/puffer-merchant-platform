<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { financeWalletInfo } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'
import { useRouter } from 'vue-router'

const router = useRouter()

// 展示的信息数据, 从接口获取
const tableData = reactive<Finance[]>([])
const getDataList = async () => {
  const res = await financeWalletInfo()
  tableData.push(res)
}
getDataList()

// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '姓名',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '手机号',
    value: '',
    key: 'input',
    type: 'input'
  },
  {
    label: '性别',
    value: '',
    key: 'sex',
    options: [
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 0
      },
    ],
    type: 'select'
  },
  {
    label: '日期',
    value: '',
    key: 'date',
    type: 'date'
  },
  
])

// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '当前余额',
    prop: 'rescueFund',
    width: 200,
    slot: 'rescueFundSlot',
  },
  {
    label: '冻结金额',
    prop: 'freezeFund',
    slot: 'freezeFundSlot',
    multipleSelection: true,
  },
  {
    label: '用户数量',
    prop: 'userCount',
    slot: 'userCountSlot',
  },
  {
    label: '本月套餐消费总额',
    prop: 'thisMonthFund',
    slot: 'thisMonthFundSlot'
  },
  {
    label: '上月套餐消费总额',
    prop: 'lastMonthFund',
    slot: 'lastMonthFundSlot'
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
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="账户概览" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="primary" plain>提现申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="1">
    <template #rescueFundSlot="{ row }">
      {{ row.rescueFund || '' }}
    </template>
    <template #freezeFundSlot="{ row }">
      {{ row.freezeFund || '' }}
    </template>
    <template #userCountSlot="{ row }">
      {{ row.userCount || '' }}
    </template>
    <template #thisMonthFundSlot="{ row }">
      {{ row.thisMonthFund || '' }}
    </template>
    <template #lastMonthFundSlot="{ row }">
      {{ row.lastMonthFund || '' }}
    </template>
    <template #editSlot="{ row, index }">
      <div>
        <el-button @click="toDetail(row, index)" type="primary" plain>查询明细</el-button>
      </div>
    </template>
  </ReuseTable>
</template>

<style lang="scss" scoped>

</style>