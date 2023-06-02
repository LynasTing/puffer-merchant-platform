import _request from "@/utils/request"
import { Api, PostApi } from "@/types/global"
import { UserRiderType } from '@/types/merchantUser'


// 获取骑手列表
export const riderPageQuery = (data: object) => {
  return _request<Api<UserRiderType>>({
    url: '/mer/merRiderPageQuery',
    data
  })
}
// 骑手新增
export const riderSave = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/riderSave',
    data
  })
}
// 骑手修改回显 
export const merRideEcho = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/merRideEcho',
    data
  })
}
// 骑手修改
export const riderUpdate = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/riderUpdate',
    data
  })
}
// 转个人骑手
export const riderPersonal = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/riderPersonal',
    data
  })
}
// 套餐终止
export const riderMerEnd = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/riderMerEnd',
    data
  })
}
// 套餐修改
export const riderComboSave = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/mer/riderComboSave',
    data
  })
}
// 套餐续费
export const riderRenew = (data: object) => {
  return _request<Api<PostApi>>({
    url: 'mer/riderRenew',
    data
  })
}

