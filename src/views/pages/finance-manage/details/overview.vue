<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { financeWalletInfo, financeWalletDetail } from '@/api/finance-manage/index'
import { Detail, Finance } from '@/types/finance'

// 展示的信息数据, 从接口获取
let totalNum = ref<Number>(0)
const overviewCard = ref()
const tableData = ref<Detail[]>([])
let currentPage = ref<number>(1)
const detailParams = ref({
  pageNumber: 1,
  pageSize: 10,
  orderNumber: ''
})
// 子组件筛选
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(detailParams.value).includes(key)) detailParams.value[key] = e[key]
    })
    detailParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    detailParams.value = {
      pageNumber: 1,
      pageSize: 10,
      orderNumber: ''
    }
  }
  getDataList()
}
// pagination分页
const pageChange = (e: number) => {
  detailParams.value.pageNumber = currentPage.value = e
  getDataList()
}
const getOverview = async () => {
  const res = await financeWalletInfo()
  overviewCard.value = res
}
getOverview()
const getDataList = async () => {
  const res = await financeWalletDetail({ ...detailParams.value })
  if(res) {
    const { list, total } = res
    tableData.value = list
    totalNum = total
  }
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
    label: '订单号',
    value: '',
    width: '300px',
    key: 'orderNumber',
    type: 'input'
  }
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '订单编号',
    prop: 'orderNumber',
    width: '300px',
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
  <el-card class="mb-6" shadow="hover">
    <h2 class="text-2xl font-bold mb-3">概览</h2>
    <el-descriptions class="margin-top" :column="5" border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item text-sm">
          <i class="iconfont icon-yue"></i>
          当前余额
        </div>
      </template>
      <span class="text-blue-400 text-base">{{ overviewCard?.rescueFund || 0 }}</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item text-sm">
          <i class="iconfont icon-benyue"></i>
          本月套餐消费总额
        </div>
      </template>
      <span class="text-blue-400 text-base">{{ overviewCard?.thisMonthFund || 0 }}</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item text-sm">
          <i class="iconfont icon-dongjiejine"></i>
          冻结金额
        </div>
      </template>
      <span class="text-blue-400 text-base">{{ overviewCard?.freezeFund || 0 }}</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item text-sm">
          <i class="iconfont icon-yonghu"></i>
          用户数量
        </div>
      </template>
      <span class="text-blue-400 text-base">{{ overviewCard?.userCount || 0}}</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item text-sm">
          <i class="iconfont icon-dc-icon-benyuehuoderongziqiye text-3xl"></i>
          上月套餐消费总额
        </div>
      </template>
      <span class="text-blue-400 text-base">{{ overviewCard?.lastMonthFund || 0}}</span>
    </el-descriptions-item>
  </el-descriptions>
  </el-card>
  <InquireCard :inquireInfo="inquireInfo" title="明细" @getChildren="getChildren" />
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
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
</template>

<style lang="scss" scoped>

</style>