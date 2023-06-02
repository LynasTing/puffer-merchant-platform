export type UserRider = {
  id: number
  accountUid: string
  // 商家编码
  merCode: string
  // 骑手名称
  riderName: string
  // 骑手电话
  riderPhone: string
  // 类型 1普通 2免押 3担保
  riderType: number
  // 是否自动续费 0否 1是
  comboRenew: number
  // 套餐名称
  comboName: string
  // 套餐类型 1按月 2按天 3按次 4自定义
  comboType: number
  // 套餐金额
  buyMoney: number
  // 套餐有效期
  comboValidTime: string
  // 套餐次数
  comboCount: number
  // 电池ID
  batteryId: string
  // 更新时间
  utime: string
  // 押金 1已缴纳 0未缴纳
  isDeposit: number
  // 实名 0未 1已
  isRealName: string
  // 用户状态 0正常 1冻结
  status: number
  // 注册时间
  registerTime: string
}
export interface UserRiderType {
  msg: string
  code: string
  data: {
    total: number
    list: UserRider[]
  }
}