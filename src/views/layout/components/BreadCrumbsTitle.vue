<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
interface BreadCrumbs<T> extends Array<T> {}

const router = useRouter()
const _myRoute = useRoute()
let titles = ref<BreadCrumbs<{ title: string, path: string }>>([])

watch(_myRoute, n => {
  if(!titles.value?.map(i => i.path).includes(n.path) && n.fullPath !== '/merchant-manage') {
    const tag = { title: _myRoute.meta.title as string, path: _myRoute.path }
    titles.value.push(tag)
  }
}, { immediate: true })
const tagsClose = (item: { title: string, path: string }, i: number) => {
  titles.value.splice(titles.value.indexOf(item), 1) 
  if(!titles.value.length) {
    router.push('/')
    return 
  }
  const lastRoute = titles.value[i]
  lastRoute ? router.push(lastRoute.path) : router.push(titles.value[i - 1].path)
}
</script>

<template>
  <div class="h-8 mb-4 select-none">
    <el-tag size="large" closable class="mr-2 cursor-pointer" @close="tagsClose(item, index)" v-for="(item, index) in titles" :key="item.path">
      <router-link :to="item.path">
        {{ item.title }}
      </router-link>
    </el-tag>
  </div>
</template>

<style lang="scss" scoped>
</style>