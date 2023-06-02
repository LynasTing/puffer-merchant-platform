import _request from "@/utils/request"
import { Api, PostApi } from "@/types/global"
import { merchantType, MerchantComboType } from '@/types/merchant'

// 商户分页查询
export const merchantPageQuery = (data: object) => {
  return _request<Api<merchantType>>({
    url: '/mer/merchantPageQuery',
    data
  })
}
// // 套餐申请
// export const merApplyFor = (data: object) => {
//   return _request<Api<PasswordLoginType>>({
//     url: '/mer/merApplyFor',
//     data
//   })
// }
// 一级商户套餐查询
export const merFirstCombo = () => {
  return _request<Api<MerchantComboType>>({
    url: '/mer/firstMerchant/combo'
  })
}
// 二级商户套餐绑定
export const secondaryComboBind = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/secondaryMerchant/combo',
    data
  })
}
// 二级商户新增
export const merchantSave = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/merchantSave',
    data
  })
}
// 二级商户修改回显
export const merchantEcho = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/merchantEcho',
    data
  })
}
// 二级商户修改
export const merchantUpdate = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/merchantUpdate',
    data
  })
}