import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { resolve } from 'path'
export default defineConfig({
  plugins: [
    vue(),
    vueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'], dts: 'src/auto-import.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // 自动导入scss变量和mixins变量
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/styles/common.scss";
        `
      }
    }
  },
  server: {
    open: true
  }
})
