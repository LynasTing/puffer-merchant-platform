export type Finance = {
  thisMonthFund: sting
  lastMonthFund: sting
  freezeFund: sting
  rescueFund: sting
  userCount: sting
}
// 财务概览
export type FinanceWalletInfo = {
  code: string
  msg: string
  data: {
    thisMonthFund: sting
    lastMonthFund: sting
    freezeFund: sting
    rescueFund: sting
    userCount: number
  }
}
export type level2 = {
  superior: string
  name: string
  phone: string
  registerTime: string
  freezeFund: string
  resueFund: string
}
// 二级商户账户信息
export type FinanceSubMerchant = {
  code: string
  msg: string
  data: level2[]
}
export type Detail = {
  comboName: string
  ctime: string
  fund: string
  id: number
  merCode: string
  orderNumber: string
  type: number
  userName: string
  userPhone: string
  utime: string
}
// 财务明细
export type financeDetail = {
  code: string
  msg: string
  data: {
    list: Detail[]
    total: number
  }
}
export type CashRecord = {
  id: number
  merCode: string
  orderNumber: string
  bankTitle: string
  bankHandle: string
  bankNo: string
  name: string
  phone: string
  cashFund: string
  status: number
  remark: string | null
  ctime: string
  utime: string
}
// 提现记录查询
export type FinanceCashRecord = {
  code: string
  msg: string
  data: {
    total: number
    list: CashRecord[]
  }
}

// 二级商户账户信息
export type FinanceSecondary = {
  code: string
  msg: string
  data: {
    superior: string
    name: string
    phone: string
    registerTime: string
    merCredit: number
    freezeFund: string
    rescueFund: string
  }[]
}