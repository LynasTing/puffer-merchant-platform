/**
 * 解决vue3 + ts 项目中, 资源引用报错问题
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
} 
