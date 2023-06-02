import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// 需要yarn add @types/node -D
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
  base: process.env.NODE_ENV === 'production' ? './' : '/',
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
    hmr: true ,
    host: '0.0.0.0',
    port: 7777,
    open: true,
    cors: true, // 允许ajax跨域
    proxy: {
      '/merchant': {
        target: `http://fz.hthuandian.cn/merchant`,
        changeOrigin: true, // 是否跨域
        rewrite: path => path.replace(/^\/merchant/, '') 
        // ws: true,  // 如果要代理 websockets,需要配置这个参数
        // secure: true,  // 如果是https接口,需要配置这个参数
      }
    },
  },
  build: {
    outDir: 'merchant-platform'
  }
})
