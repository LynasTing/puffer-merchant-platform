<script lang="ts" setup>
import { InquireType } from '@/types/table'

const emit = defineEmits(['getChildren'])
let info = {}
const props = defineProps({
  inquireInfo: {
    type: Array<InquireType>,
      default: [],
      required: true
  },
  title: {
    type: String,
    default: '页面标题',
    required: true
  }
})
// 触发父组件方法
const onSubmit = (type?: string) => {
  if(type === 'reset') props.inquireInfo.forEach((item: any) => item.value = '')
  info = props.inquireInfo.reduce((prev: any, cur: any) => {
    if (cur.value) {
      prev[cur.key] = cur.value
    }
    return prev
  }, {})
  emit('getChildren', info)
}
</script>
<template>
  <div class="page-view">
    <div class="mb-3 text-2xl font-semibold card-header">
      {{ props.title }}
    </div>
    <el-card class="mb-5" shadow="hover">
      <template #header>
        <div class="text-base font-medium">筛选条件:</div>
      </template>
      <article class="flex">
        <div class="search-range">
          <template  v-for="item in props.inquireInfo" :key="item.label">
            <div class="search-condition" v-if="item.type === 'input'">
              <div>{{ item.label }}：</div>
              <el-input v-model="item.value" :placeholder="`请输入${item.label}`" clearable />
            </div>
            <div class="search-condition" v-if="item.type === 'select'">
              <div>{{ item.label }}：</div>
              <el-select v-model="item.value" :placeholder="`请选择${item.label}`">
                <el-option v-for="sub in item.options" :key="sub.value" :label="sub.label" :value="sub.value" :disabled="sub.disabled"  />
              </el-select>
            </div>
            <div class="search-condition" v-if="item.type === 'date'">
              <div>{{ item.label }}：</div> 
              <el-date-picker v-model="item.value" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" />
            </div>
          </template>
          <div class="flex items-center ml-4">
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="onSubmit('reset')">重置</el-button>
          </div>
        </div>
        <div class="btn-range">
          <slot name="btnSlot"></slot>
        </div>
      </article>
    </el-card>
  </div>  
</template>  
<style lang="scss" scoped>
.page-view {
  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9)
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9)
  }
}  
</style>