<template>
  <el-table :data="tableData" v-bind="{ border: true }" highlight-current-row class="el-table">
    <el-table-column type="selection" width="50px" v-if="option?.multipleSelection" />
    <el-table-column type="index" label="序号" width="70" fixed="left">
      <template #default="{ $index }">
        <i>{{ $index + 1 }}</i>
      </template>
    </el-table-column>
    <el-table-column v-for="col in option" :key="col.prop" :label="col.label" :prop="col.prop" :width="col.width" v-bind="{ ...col.attrs }">
      <template #header>
        <span>{{ col.label }}</span>
      </template>
      <template #default="{ row, $index }" v-if="col.slot">
        <slot :name="col.slot" :row="row" :index="$index" ></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
 
<script lang="ts" setup>
import { TableOption, TableData } from '@/types/table'
type Props = {
  option: Array<TableOption>
  tableData: Array<TableData>
}
const props = defineProps<Props>()
watch(props.tableData, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
</script>
<style lang="scss" scoped>
.el-table ::v-deep(.cell){
  text-align: center !important
}
</style>