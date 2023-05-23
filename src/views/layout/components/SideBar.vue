<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  mainRoutes: {
    type: Array,
    default: []
  }
})
const go = (item: object) => {
  router.push({ path: item?.path })
}
</script>
    
<template>
  <template v-for="item in props.mainRoutes" :key="item.path">
    <el-sub-menu v-if="item?.children?.length" :index="item.path" @click="go(item)">
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SideBar :mainRoutes="item?.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path" @click="go(item)">
      <el-icon>
        <component :is="item.meta?.icon" />
      </el-icon>
      <span>{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template> 
<style lang="scss" scoped>
.el-menu {
  border: none;
}
.el-col-menu {
  height: 100vh;
}
// .el-col-16 {
//   max-width: 200px;
// }
</style>