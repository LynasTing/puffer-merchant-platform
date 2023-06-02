export interface TableOption {
  // 字段名称
  prop?: string
  // 多选
  multipleSelection?: true
  // 表头
  label: string
  fixed?: string
  // 对应列的宽度
  width?: string | number
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  // 自定义列模板的插槽名
  slot?: string
  // 是否是操作项
  action?: boolean
  // 是否可以编辑
  editable?: boolean
  // 属性
  attrs?: object
}
 
export interface TableData {
  date?: string
  name?: string
  address?: string
  sex?: string
}

export const option: TableOption[] = [{
  multipleSelection: true,
}]
// 页面筛选条件
export type InquireType = {
  label: string
  value: any
  key: string
  options?: Array
  type: string
  width?: string
}