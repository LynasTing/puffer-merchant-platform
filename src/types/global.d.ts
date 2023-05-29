// 所有的接口的通用类型
export interface Api<T> {
  code: string
  result: T
  msg: string
}
// 模拟登录 
export interface PasswordLoginType {
  code: string
  msg: string
  result: string
}
// 登出
export interface LogoutType {
  code: string
  msg: string
}
// Axios取消
export type AxiosCancel = {
	url: string
	method?: string
	cancel: func
}

// 路由侧边菜单
export type AsideMenuType = {
  children?: Array
  component: func
  meta: {
    icon: string
    title: string
  }
  name: string
  path: string
}