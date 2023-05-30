 
<script lang="ts" setup>
import { TableOption, TableData } from '@/types/table'

const emit = defineEmits(['pageChange'])
const props = defineProps<Props>()
watch(props.tableData, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
type Props = {
  option: Array<TableOption>
  tableData: Array<TableData>
  total: Number
}
let currPage = ref<Number>(1)
// 分页
const handlePageChange = (e: number) => {
  currPage.value = e
  emit('pageChange', e)
}
</script>
<template>
  <div class="w-full bg-red-300 ">
  <el-table v-if="tableData.length" :data="tableData" v-bind="{ border: true }" highlight-current-row class="el-table" :header-cell-style="{ background: '#f5f7fa' }" style="width: 80%">
    <el-table-column type="selection" width="50px" v-if="option?.multipleSelection" />
    <el-table-column v-if="false" type="index" label="序号" width="70" fixed="left">
      <template #default="{ $index }">
        <i>{{ $index + 1 }}</i>
      </template>
    </el-table-column>
    <el-table-column v-for="col in option" :resizable="false" :key="col.prop" :label="col.label" :prop="col.prop" :width="col.width" v-bind="{ ...col.attrs }">
      <template #header>
        <span>{{ col.label }}</span>
      </template>
      <template #default="{ row, $index }" v-if="col.slot" >
        <slot :name="col.slot" :row="row" :index="$index" ></slot>
      </template>
    </el-table-column>
  </el-table>
<el-empty v-else description="暂无数据" class="bg-white" />
</div>

  <div class="bg-white flex px-8 pt-10 pb-3 justify-end items-center">
    <div class="text-sm text-gray-500 ">
      共<text class="text-blue-500"> {{ ' ' + total + ' ' }} </text>条
    </div>
    <el-pagination v-model:current-page="currPage" :page-size="10" layout="prev, pager, next, jumper" :total="total" @current-change="handlePageChange" />
  </div>
</template>

<style lang="scss" scoped>
.el-table {
  width: 100% !important;
  height: 100%;
  ::v-deep(.cell){
    text-align: center !important
  }
}
::v-deep(.el-table__column-filter-trigger) {
  margin-left: 8px;
}
</style>