<script lang="ts" setup>
interface User {
  date: string
  name: string
  address: string
}
const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <div class="page-view">
    <div class="mb-3 text-2xl font-semibold card-header">
      页面标题
    </div>
    <el-card class="mb-5" shadow="hover">
      <template #header>
        <div class="text-lg font-medium">筛选条件:</div>
      </template>
      <article class="flex">
        <div class="search-range">
          <div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div>
          <div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div>
          <div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div><div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div><div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div><div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div>
          <div class="search-condition">
            <div>姓名：</div>
            <el-input placeholder="请输入姓名" clearable />
          </div>
        </div>
        <div class="btn-range">
          <el-button type="primary">Primary</el-button>
          <el-button type="primary">Primary</el-button>
          <el-button type="primary">Primary</el-button>
          <el-button type="primary">Primary</el-button>
          <el-button type="primary">Primary</el-button>
        </div>
      </article>
    </el-card>
    <el-card>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.page-view {
  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}
</style>