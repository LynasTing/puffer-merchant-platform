<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { TableOption, InquireType } from '@/types/table'
import { merchantPageQuery, merchantSave, merchantEcho, merchantUpdate, merFirstCombo, secondaryComboBind } from '@/api/merchant-manage/index'
import { merchant, MerchantCombo } from '@/types/merchant'

const options = ref({
  type: [{ text: '企业', value: 0 }, { text: '个体', value: 1 }],
  grade: [{ text: '二级', value: 2 }],
  merCombo: []
})
/**
 * @table数据
 */
const merchantParams = ref({
  pageNumber: 1,
  pageSize: 10,
  merName: '',
  likPhone: '',
  merType: '',
  merSuperior: '',
  status: ''
})
let currentPage = ref<number>(1)
let totalNum = ref<number>(0)
const tableData = ref<merchant[]>([])
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(merchantParams.value).includes(key)) merchantParams.value[key] = e[key]
    })
    merchantParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    merchantParams.value = {
      pageNumber: 1,
      pageSize: 10,
      merName: '',
      likPhone: '',
      merType: '',
      merSuperior: '',
      status: ''
    }
  }
  getDataList()
}
const getDataList = async () => {
  const res = await merchantPageQuery({ ...merchantParams.value })
  if(res) {
    tableData.value = res.list
    totalNum = res.total
  }
}
getDataList()
const formatCredit = computed(() => {
  return function(merCredit: string) {
    switch (merCredit) {
      case '3':
        return '担保商户'
      case '4':
        return '免押商户'
      case '9':
        return  '个体普通用户'
    }
  }
})
// pagination分页
const pageChange = (e: number) => {
  merchantParams.value.pageNumber = currentPage.value = e
  getDataList()
}
// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '商户名称',
    value: '',
    key: 'merName',
    type: 'input'
  },
  {
    label: '手机号',
    value: '',
    key: 'likPhone',
    type: 'input'
  },
  {
    label: '商户类型',
    value: '',
    key: 'merType',
    type: 'select',
    options: [
      {
        label: '个体',
        value: '1'
      },
      {
        label: '企业',
        value: '0'
      }
    ]
  },
  {
    label: '上级商户',
    value: '',
    key: 'merSuperior',
    type: 'input'
  },
  {
    label: '状态',
    value: '',
    key: 'status',
    type: 'select',
    options: [
      {
        label: '禁用',
        value: '1'
      },
      {
        label: '启用',
        value: '0'
      }
    ]
  },
  // {
  //   label: '日期',
  //   value: '',
  //   key: 'date',
  //   type: 'date'
  // },
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '商户名称',
    prop: 'merName',
    slot: 'merNameSlot'
  },
  {
    label: '联系人',
    prop: 'likName',
    slot: 'likNameSlot',
  },
  {
    label: '手机号',
    prop: 'likPhone',
    width: '120px',
    slot: 'likPhoneSlot'
  },
  {
    label: '商户类型',
    prop: 'merType',
    slot: 'merTypeSlot'
  },
  {
    label: '商户地址',
    prop: 'merAddress',
    slot: 'merAddressSlot'
  },
  {
    label: '商户logo',
    prop: 'merLogo',
    slot: 'merLogoSlot'
  },
  {
    label: '商户信用等级',
    prop: 'merCredit',
    width: '120px',
    slot: 'merCreditSlot'
  },
  {
    label: '商户等级',
    prop: 'grade',
    slot: 'gradeSlot'
  },
  {
    label: '上级商户',
    prop: 'merSuperior',
    slot: 'merSuperiorSlot'
  },
  {
    label: '邀请码',
    prop: 'invitationCode',
    slot: 'invitationCodeSlot'
  },
  {
    label: '状态',
    prop: 'status',
    slot: 'statusSlot'
  },
  {
    label: '注册时间',
    prop: 'registerTime',
    width: '180px',
    slot: 'registerTimeSlot'
  },
  {
    label: '修改时间',
    prop: 'utime',
    width: '180px',
    slot: 'utimeSlot'
  },
  {
    label: '操作',
    prop: 'edit',
    width: '200px',
    slot: 'editSlot',
    attrs: {
      fixed: 'right'
    }
  }
])
/**
 * @二级商户新增修改
 */
const isEdit = ref<Boolean>(false)
const subMerchantDialog = ref<Boolean>(false)
const subMerchantRef = ref<FormInstance>()
const subMerchantParams = ref({
  merName: '',
  likName: '',
  likPhone: '',
  merType: '',
  merGrade: 2
})
// 手机号码单独验证
const validPhone = (_rule: any, value: any, callback: any) => {
  if(!value) return callback(new Error('请输入手机号码'))
  setTimeout(() => {
    const reg = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
    if(!reg.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }else {
      callback()
    }
  }, 300)
}
const subMerchantRule = reactive<FormRules>({
  merName: [{ required: true, trigger: 'blur', message: '请输入商户名称' }],
  likName: [{ required: true, trigger: 'blur', message: '请输入联系人' }],
  likPhone:[{ validator: validPhone, trigger: 'blur' }],
  merType: [{ required: true, trigger: 'change', message: '请选择商户类型' }],
  merGrade: [{ required: true, trigger: 'change', message: '请选择商户等级' }]
})
// 编辑
const editSubMerchant = async (row: merchant) => {
  const res = await merchantEcho({ id: row.id})
  Object.keys(res).forEach(key => {
    if(Object.keys(subMerchantParams.value).includes(key)) subMerchantParams.value[key] = res[key]
  })
  isEdit.value = subMerchantDialog.value = true
}
// 提交新增/修改二级商户
const subMerchant = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res = isEdit.value ? (await merchantUpdate({ ...subMerchantParams.value }) as unknown as string) : (await merchantSave({ ...subMerchantParams.value }) as unknown as string)
      if(res === '请求成功') {
        ElNotification({
          title: `${isEdit.value ? '修改' : '新增'}成功`,
          message: res,
          type: 'success',
          showClose: false,
          duration: 2 * 1000
        })
        getDataList()
        closeSubMerchantSubmit()
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}
// 取消新增二级商户
const closeSubMerchantSubmit = () => {
  subMerchantRef.value?.resetFields()
  isEdit.value = subMerchantDialog.value = false
}
/**
 * @绑定二级套餐
 */
const currCombo = ref<Number>(0)
const bindComboDialog = ref<Boolean>(false)
const firstCombos = ref<MerchantCombo[]>([])
const selectCombo = (_item: MerchantCombo, index: number) => {
  currCombo.value = index
  bindComboParams.value.comboId = _item.id
}
const bindComboParams = ref({
  comboId: 0,
  merId: 0
})

const bindSubCombo = async (e: merchant ) => {
  bindComboParams.value.merId = e.id
  const res = await merFirstCombo()
  bindComboParams.value.comboId = res[0]?.id
  firstCombos.value = res
  bindComboDialog.value = true
}
// 取消绑定二级套餐
const closeBindCombo = () => {
  bindComboDialog.value = false
  bindComboParams.value = { comboId: 0, merId: 0 }
}
// 提交二级商户套餐绑定
const bindComboSubmit = async () => {
  if(!bindComboParams.value.comboId) {
    ElMessage({
      message: '您还未选择套餐，请选择',
      type: 'error',
      duration: 2 * 1000
    })
    return 
  }
  const res = await secondaryComboBind({ ...bindComboParams.value })
  if(res === '请求成功') {
    ElNotification({
      title: `绑定成功`,
      message: res,
      type: 'success',
      showClose: false,
      duration: 2 * 1000
    })
    getDataList()
    closeBindCombo()
  }
}
</script>
<template>
  <InquireCard :inquireInfo="inquireInfo" title="商户概览" @getChildren="getChildren">
    <template #btnSlot>
      <el-button type="primary" plain @click.stop="subMerchantDialog = true">二级商户新增</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
    <template #merNameSlot="{ row }">
      {{ row.merName || '--' }}
    </template>
    <template #likNameSlot="{ row }">
      {{ row.likName || '--' }}
    </template>
    <template #likPhoneSlot="{ row }">
      {{ row.likPhone || '--' }}
    </template>
    <template #merTypeSlot="{ row }">
      {{ row.merType ? '个体' : '企业' }}
    </template>
    <template #merAddressSlot="{ row }">
      {{ row.merAddress || '--' }}
    </template>
    <template #merLogoSlot="{ row }">
      {{ row.merLogo || '--' }}
    </template>
    <template #merCreditSlot="{ row }">
      {{ formatCredit(row.merCredit) || '--' }}
    </template>
    <template #gradeSlot="{ row }">
      {{ row.grade || '--' }}
    </template>
    <template #merSuperiorSlot="{ row }">
      {{ row.merSuperior || '--' }}
    </template>
    <template #invitationCodeSlot="{ row }">
      {{ row.invitationCode || '--' }}
    </template>
    <template #statusSlot="{ row }">
      <span :class="row.status ? 'text-red-400 ' : 'text-green-400'">{{ row.status ? '禁用' : '启用' }}</span>
    </template>
    <template #registerTimeSlot="{ row }">
      {{ row.registerTime || '--' }}
    </template>
    <template #utimeSlot="{ row }">
      {{ row.utime || '--' }}
    </template>
    <template #editSlot="{ row, index }">
      <div class="flex justify-center">
        <el-button @click="editSubMerchant(row)" type="primary" plain>修改</el-button>
        <el-button @click="bindSubCombo(row)" type="primary" plain>绑定套餐</el-button>
      </div>
    </template>
  </ReuseTable>
  <!-- 新增/修改二级商户 -->
  <el-dialog v-model="subMerchantDialog" :title="`${isEdit ? '修改' : '新增'}二级商户`" width="500px" @closed="closeSubMerchantSubmit">
    <el-form :model="subMerchantParams" :rules="subMerchantRule" ref="subMerchantRef" label-position="left" label-width="100px">
      <el-form-item prop="merName" label="商户名称">
        <el-input v-model="subMerchantParams.merName" placeholder="请输入商户名称" />
      </el-form-item>
      <el-form-item prop="likName" label="联系人">
        <el-input v-model="subMerchantParams.likName" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item prop="likPhone" label="联系电话" required>
        <el-input v-model="subMerchantParams.likPhone" maxlength="11" type="tel" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item prop="merGrade" label="商户等级">
        <el-select v-model="subMerchantParams.merGrade" placeholder="请选择商户类型" disabled >
          <el-option v-for="item in options.grade" :key="item.value" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="merType" label="商户类型">
        <div class="flex">
          <el-select v-model="subMerchantParams.merType" placeholder="请选择商户类型" >
            <el-option v-for="item in options.type" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeSubMerchantSubmit">取消</el-button>
      <el-button type="primary" plain @click="subMerchant(subMerchantRef)">确定</el-button>
    </div>
  </el-dialog>
  <!-- 绑定商户套餐dialog -->
  <el-dialog v-model="bindComboDialog" title="绑定商户套餐" width="900px" @closed="closeBindCombo">
    <ul class="flex justify-between flex-wrap overflow-auto px-6 py-6 combo-list" v-infinite-scroll="(_load: any) =>{} ">
      <li class="w-5/12 mb-4 h-96 select-none" v-for="(item, index) in firstCombos" :key="index" @click="selectCombo(item, index)">
        <el-card class="cursor-pointer h-full desc-card wrap" shadow="hover" :class="currCombo === index ? 'select-card' : ''">
          <el-descriptions title="套餐信息" direction="vertical" border :column="2">
            <el-descriptions-item label="名称">{{ item.comboInfo || '--' }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ item.comboType }}</el-descriptions-item>
            <el-descriptions-item label="金额">{{ item.comboMoney || '--' }}</el-descriptions-item>
            <el-descriptions-item label="可用次数">{{ item.comboCount || 0 }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ item.ctime }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </li>
    </ul>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeBindCombo">取消</el-button>
      <el-button type="primary" plain @click="bindComboSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.combo-list {
  max-height: 550px;
  .desc-card {
    border: 1px solid transparent;
  }
  .select-card {
    border: 1px solid #409eff !important
  }
}
</style>