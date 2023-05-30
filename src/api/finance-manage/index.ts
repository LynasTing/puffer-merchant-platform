import _request from "@/utils/request"
import { Api, LogoutType, PasswordLoginType } from "@/types/global"
import { FinanceWalletInfo, FinanceCashRecord, financeDetail, FinanceSecondary } from '@/types/finance'
import { PostApi } from '@/types/global'


// 查询二级商户信息
export const financeSubMerchant = (data: object) => {
  return _request<Api<FinanceSecondary>>({
    url: '/finance/subMerchant',
    data
  })
}
// 账户概览
export const financeWalletInfo = () => {
  return _request<Api<FinanceWalletInfo>>({
    url: '/finance/walletInfo'
  })
}
// 账户明细
export const financeWalletDetail = (data: object) => {
  return _request<Api<financeDetail>>({
    url: '/finance/walletDetail',
    data
  })
}
// 提现记录查询
export const financeCashRecord = (data: object) => {
  return _request<Api<FinanceCashRecord>>({
    url: '/finance/cashRecord',
    data
  })
}
// 提现申请
export const financeApplyCash = (data: object) => {
  return _request<Api<PostApi>>({
    url: '/finance/applyCash',
    data
  })
}
// 充值记录查询
export const financeChangeRecord = (data: object) => {
  return _request<Api<LogoutType>>({
    url: '/finance/chargeRecord',
    data
  })
}
// 充值申请
export const financeApplyCharge = (data: object) => {
  return _request<Api<LogoutType>>({
    url: '/finance/applyCharge',
    data
  })
}