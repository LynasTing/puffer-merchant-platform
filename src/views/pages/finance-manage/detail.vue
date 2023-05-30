<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { TableOption, InquireType } from '@/types/table'
import ReuseTable from '@/components/reuse-table/index.vue'
import { financeWalletDetail } from '@/api/finance-manage/index'
import { Detail } from '@/types/finance'

// 展示的信息数据, 从接口获取
let totalNum = ref<Number>(0)
const tableData = ref<Detail[]>([])
const detailParams = ref({
  pageNumber: 1,
  pageSize: 1
})
const getDataList = async () => {
  const res = await financeWalletDetail({ ...detailParams.value })
  const { list, total } = res
  tableData.value = list
  totalNum = total
}
getDataList()
const formatType = computed(() => {
  return function(type: number) {
    switch (type) {
      case 1:
        return '充值'
      case 2:
        return '提现'
      case 3:
        return  '返现'
      case 4:
        return  '佣金'
      case 5:
        return  '赠送'
      case 6:
        return  '套餐消费'
      case 7:
        return  '套餐返还'
      case 8:
        return  '冻结押金'
      case 9:
        return  '解冻押金'
    }
  }
})

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
    label: '订单编号',
    prop: 'orderNumber',
    slot: 'orderNumberSlot'
  },
  {
    label: '类型',
    prop: 'type',
    slot: 'typeSlot'
  },
  {
    label: '金额',
    prop: 'fund',
    slot: 'fundSlot'
  },
  {
    label: '套餐名称',
    prop: 'comboName',
    slot: 'comboNameSlot'
  },
  {
    label: '骑手名称',
    prop: 'userName',
    slot: 'userNameSlot'
  },
  {
    label: '手机号',
    prop: 'userPhone',
    slot: 'userPhoneSlot'
  },
  {
    label: '创建时间',
    prop: 'ctime',
    slot: 'ctimeSlot'
  },
  {
    label: '更新时间',
    prop: 'utime',
    slot: 'utimeSlot'
  }
])
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="账户财务明细" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="danger" plain>12351</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum">
    <template #orderNumberSlot="{ row }">
      {{ row.orderNumber || '--' }}
    </template>
    <template #typeSlot="{ row }">
      {{ formatType(row.type) || '--' }}
    </template>
    <template #fundSlot="{ row }">
      {{ row.fund || '--' }}
    </template>
    <template #comboNameSlot="{ row }">
      {{ row.comboName || '--' }}
    </template>
    <template #userNameSlot="{ row }">
      {{ row.userName || '--' }}
    </template>
    <template #userPhoneSlot="{ row }">
      {{ row.userPhone || '--' }}
    </template>
    <template #ctimeSlot="{ row }">
      {{ row.ctime || '--' }}
    </template>
    <template #utimeSlot="{ row }">
      {{ row.utime || '--' }}
    </template>
  </ReuseTable>
  <template>
    <RouterView />
  </template>
</template>

<style lang="scss" scoped>

</style>