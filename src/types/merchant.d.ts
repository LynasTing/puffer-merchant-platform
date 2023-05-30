export type merchant = {
value: any
merGrade: any
  id: number
  // 商户编码
  merCode: string
  // 商户名称
  merName: string
  // 联系人
  likName: string
  // 联系电话
  likPhone: string
  // 商户类型 0企业 1个体
  merType: number | string
  // 商户地址
  merAddress: string
  // 商户logo
  merLogo: string
  // 商户信用等级 3担保商户 4免押商户 9普通个体用户
  merCredit: string
  // 商户等级
  grade: string | number
  // 上级商户
  merSuperior: string
  // 邀请码
  invitationCode: string
  // 状态 0启用 1禁用
  status: number
  // 注册时间
  registerTime: string
  // 修改时间
  utime: string
}
// 商户分页查询
export type merchantType = {
  code: string
  msg: string
  data: {
    total: number
    list: merchant[]
  }
}