import _request from "@/utils/request"
import { Api, PasswordLoginType, LogoutType, PostApi } from "@/types/global"
// 账号密码登录
export const passwordLogin = (data: object) => {
  return _request<Api<PasswordLoginType>>({
    url: '/login',
    data
  })
}
// 登出
export const logout = () => {
  return _request<Api<LogoutType>>({
    url: '/logout'
  })
}
// 登出
export const passwdChange = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/passwdChange',
    data
  })
}
