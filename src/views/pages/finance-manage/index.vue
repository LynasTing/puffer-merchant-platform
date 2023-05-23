<template>
  <ReuseTable :option="option" :tableData="tableData">
    <template #dateSlot="{ row }">
      {{ row.date }}
    </template>
    <template #nameSlot="{ row }">
      {{ row.name }}
    </template>
    <template #addressSlot="{ row }">
      {{ row.address }}
    </template>
    <template #sexSlot="{ row }">
      {{ row.sex }}
    </template>
    <template #editSlot="{ row, index }">
      <div>
        <el-button @click="deleteRow(row, index)" type="danger" plain>删除</el-button>
        <el-button @click="viewRow(row)" plain>查看</el-button>
      </div>
    </template>
  </ReuseTable>
</template>
<script setup lang="ts">
import ReuseTable from '@/components/ReuseTable.vue'
import { TableData, TableOption } from '@/types/table'

// 展示的信息数据, 从接口获取
const tableData = reactive<TableData[]>([
  {
    date: '2016-05-03',
    name: '1',
    address: '北京',
    sex: '男'
  },
  {
    date: '2016-05-02',
    name: '2',
    address: '上海',
    sex: '男',
  },
  {
    date: '2016-05-04',
    name: '3',
    address: '南京',
    sex: '男'
  }
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '日期',
    prop: 'date',
    width: 200,
    slot: 'dateSlot',
  },
  {
    label: '名称',
    prop: 'name',
    slot: 'nameSlot',
    multipleSelection: true,
  },
  {
    label: '地址',
    prop: 'address',
    slot: 'addressSlot',
  },
  {
    label: '性别',
    prop: 'sex',
    width: '70px',
    slot: 'sexSlot'
  },
  {
    label: '操作',
    prop: 'edit',
    slot: 'editSlot'
  }
])
// 删除
const deleteRow = (row: TableData, index: number) => { 
  ElMessageBox.confirm('确定删除当前项吗？', '删除', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      tableData.splice(index, 1)
      ElNotification({
        title: '操作成功',
        type: 'success',
        showClose: false,
        duration: 1.5 * 1000
      })
    })
    .catch(() => {
      ElNotification({
        title: '用户取消',
        type: 'info',
        showClose: false,
        duration: 1.5 * 1000
      })
    })
}
</script>
<style></style>