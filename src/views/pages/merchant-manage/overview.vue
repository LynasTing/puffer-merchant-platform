<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { TableOption, InquireType } from '@/types/table'
import { merchantPageQuery, merchantSave, merchantEcho, merchantUpdate } from '@/api/merchant-manage/index'
import { merchant } from '@/types/merchant'
import { useRouter } from 'vue-router'

const router = useRouter()
const options = ref({
  type: [{ text: '企业', value: 0 }, { text: '个体', value: 1 }],
  merCombo: []
})
/**
 * @table数据
 */
const merchantParams = ref({
  pageNumber: 1,
  pageSize: 10
})
let totalNum = ref<Number>(0)
const tableData = ref<merchant[]>([])
const getDataList = async () => {
  const res = await merchantPageQuery({ ...merchantParams.value })
  tableData.value = res.list
  totalNum = res.total
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
// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '姓名',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '手机号',
    value: '',
    key: 'input',
    type: 'input'
  },
  {
    label: '性别',
    value: '',
    key: 'sex',
    options: [
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 0
      },
    ],
    type: 'select'
  },
  {
    label: '日期',
    value: '',
    key: 'date',
    type: 'date'
  },
  
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
    width: '110px',
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
const idEdit = ref<Boolean>(false)
const subMerchantDialog = ref<Boolean>(false)

const subMerchantRef = ref<FormInstance>()
const subMerchantParams = ref({
  merName: '',
  likName: '',
  likPhone: '',
  merType: '',
  merGrade: 2
})
const subMerchantRule = reactive<FormRules>({
  merName: [{ required: true, trigger: 'blur', message: '请输入商户名称' }],
  likName: [{ required: true, trigger: 'blur', message: '请输入联系人' }],
  likPhone: [{ required: true, trigger: 'blur', message: '请输入联系电话' }],
  merType: [{ required: true, trigger: 'change', message: '请选择商户类型' }],
  merGrade: [{ required: true, trigger: 'change', message: '请选择商户等级' }]
})
// 编辑
const editSubMerchant = async (row: merchant) => {
  const res = await merchantEcho({ id: row.id})
  Object.keys(res).forEach(key => {
    if(Object.keys(subMerchantParams.value).includes(key)) subMerchantParams.value[key] = res[key]
  })
  idEdit.value = subMerchantDialog.value = true
}
// 提交新增/修改二级商户
const subMerchant = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res = idEdit ? await merchantUpdate({ ...subMerchantParams.value }) as unknown as string : await merchantSave({ ...subMerchantParams.value }) as unknown as string
      console.log(`res + ::>>`, res)
      if(res === '请求成功') {
        ElNotification({
          title: `${idEdit ? '修改' : '新增'}成功`,
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
  subMerchantDialog.value = false
  subMerchantRef.value?.resetFields()
}
/**
 * @绑定二级套餐
 */
const currMerchantId = ref<Number>(-1)
const bindComboDialog = ref<Boolean>(false)
const bindComboRef = ref<FormInstance>()
const bindComboParams = ref({
  merCombo: '',
  merId: ''
})
const bindComboRule = reactive<FormRules>({
  merCombo: [{ required: true, trigger: 'change', message: '请选级商户套餐' }]
})
const bindSubCombo = (e: merchant) => {
  currMerchantId.value = e.id
  console.log(`e + ::>>`, e)
  // res
  bindComboDialog.value = true

}
// 取消绑定二级套餐
const closeBindCombo = () => {
  bindComboDialog.value = false
  bindComboRef.value?.resetFields()
}
// 提交二级商户套餐绑定
const bindComboSubmit = async (formEl: FormInstance | undefined) => {
  console.log(` 提交二级商户套餐绑定+ ::>>`, )
  return 
  // if (!formEl) return
  // await formEl.validate(async (valid: boolean, fields: any) => {
  //   if(valid) {
  //     return 
  //     const res = await ()
  //     console.log(`res + ::>>`, res)
  //     if(res === '请求成功') {
  //       ElNotification({
  //         title: `${idEdit ? '修改' : '新增'}成功`,
  //         message: res,
  //         type: 'success',
  //         showClose: false,
  //         duration: 2 * 1000
  //       })
  //       getDataList()
  //       closeSubMerchantSubmit()
  //     }
  //   }else {
  //     console.log('error submit!', fields)
  //   }
  // })
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="商户概览" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="primary" plain @click.stop="subMerchantDialog = true">二级商户新增</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum">
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
  <el-dialog v-model="subMerchantDialog" :title="`${idEdit ? '修改' : '新增'}二级商户`" width="500px" @closed="closeSubMerchantSubmit">
    <el-form :model="subMerchantParams" :rules="subMerchantRule" ref="subMerchantRef">
      <el-form-item prop="merName">
        <el-input v-model.number="subMerchantParams.merName" placeholder="请输入商户名称">
          <template #prepend>商户名称</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="likName">
        <el-input v-model.number="subMerchantParams.likName" placeholder="请输入联系人">
          <template #prepend>联系人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="likPhone">
        <el-input v-model.number="subMerchantParams.likPhone" maxlength="11" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入联系电话">
          <template #prepend>联系电话</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="merGrade">
        <el-input v-model="subMerchantParams.merGrade" disabled oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入商户等级">
          <template #prepend>商户等级</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="merType">
        <div class="flex">
          <div class="mr-4 bg-gray-100 text-gray-500  rounded-md px-4">商户类型</div>
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
  <el-dialog v-model="bindComboDialog" title="绑定商户套餐" width="500px"  @closed="closeBindCombo">
    <el-form :model="bindComboParams" :rules="bindComboRule" ref="bindComboRef">
      <el-form-item prop="merCombo">
        <div class="flex">
          <div class="mr-4 bg-gray-100 text-gray-500 rounded-md px-4">商户类型</div>
          <el-select v-model="bindComboParams.merCombo" placeholder="请选择商户类型" >
            <el-option v-for="item in options.type" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <div class="flex justify-end mt-10 ">
        <el-button type="info" plain @click="closeBindCombo">取消</el-button>
        <el-button type="primary" plain @click="bindComboSubmit(bindComboRef)">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>