import axios, { AxiosError, AxiosResponse } from 'axios'
import { showLoading, hideLoading } from './loading'

console.log(`当前环境process.env.NODE_ENV + ::>>`, import.meta.env.VITE_BASE_API)
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  method: 'post',
  timeout: 5000
})
// let cancelArr: AxiosCancel[] = []
// export const cancelAsk = () => {
//   cancelArr = cancelArr?.forEach(item =>{
//     item.cancel()
//     return false
//   })
// }

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    showLoading()
    // 断网提示
    if (!navigator.onLine) {
      ElMessageBox.alert(
        '您的网络故障，请检查!',
        '温馨提示',
        {
          confirmButtonText: '好的',
          type: 'warning'
        }
      )
    }
    // cancelArr.filter(item => {
    //   if(item.url === config.url && item.method === config?.method) {
    //     item.cancel()
    //     return false
    //   }
    //   return true
    // })
    // config.cancelToken = new axios.CancelToken(cancel => {
    //   cancelArr.push({
    //     url: config.url,
    //     method: config.method,
    //     cancel
    //   })
    // }) 
    // // 在发送请求之前做些什么 (配置请求头、加入token等)
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(`error.request + ::>>`, error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  (result: AxiosResponse) => {
    setTimeout(() => {
      hideLoading()
    }, 200)
    const { code, data, msg } = result.data
    if(code === '200') {
      return data
    }else {
      ElMessage.error(msg)
    }
  },
  (error: AxiosError<any>) => {
    // 网络超时
    if(!error.response) {
      console.log(`网络超时 + ::>>`, )
    }else {
      ElMessage({
        message: '服务器异常，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
      console.log(`error.response.data.message + ::>>`, error.response.data.message)
      return Promise.reject(new Error('error'))
    }
  }
)
export default request