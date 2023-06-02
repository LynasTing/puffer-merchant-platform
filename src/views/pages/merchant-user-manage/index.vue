<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { InquireType } from '@/types/table'
import ReuseTable from '@/components/reuse-table/index.vue'
import { TableOption } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { riderPageQuery, riderSave, riderUpdate, merRideEcho, riderPersonal, riderMerEnd, riderComboSave, riderRenew } from '@/api/merchant-user-manage'
import { merFirstCombo } from '@/api/merchant-manage'
import { UserRider } from '@/types/merchantUser'
import { InfoFilled } from '@element-plus/icons-vue'
import { MerchantCombo } from '@/types/merchant'

/**
 * @options 页面options
 */
const options = ref({
  renew: [{ label: '开启', value: 1 }, { label: '关闭', value: 2 }],
  type: [{ label: '普通', value: 1 }, { label: '免押', value: 2 }, { label: '担保', value: 3 }],
  combo: <any>[]
})

/**
 * @rider 骑手列表查询
 */
let currentPage = ref<number>(1)
// 获取筛选条件
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(userParams.value).includes(key)) userParams.value[key] = e[key]
    })
    userParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    userParams.value = {
      pageNumber: 1,
      pageSize: 10,
      riderName: '',
      riderPhone: '',
      riderType: ''
    }
  }
  getDataList()
}
// pagination分页
const pageChange = (e: number) => {
  userParams.value.pageNumber = currentPage.value = e
  getDataList()
}
// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '骑手姓名',
    value: '',
    key: 'riderName',
    type: 'input'
  },
  {
    label: '骑手手机号',
    value: '',
    key: 'riderPhone',
    type: 'input'
  },
  {
    label: '骑手类型',
    value: '',
    key: 'riderType',
    options: options.value.type,
    type: 'select'
  }
])
const totalNum = ref<Number>(-1)
// 展示的信息数据, 从接口获取
const tableData = ref<UserRider[]>([])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '骑手名称',
    prop: 'riderName',
    slot: 'riderNameSlot'
  },
  {
    label: '骑手电话',
    prop: 'riderPhone',
    width: '160px',
    slot: 'riderPhoneSlot'
  },
  {
    label: '骑手类型',
    prop: 'riderType',
    slot: 'riderTypeSlot'
  },
  {
    label: '是否自动续费',
    prop: 'comboRenew',
    width: '120px',
    slot: 'comboRenewSlot'
  },
  {
    label: '套餐名称',
    prop: 'comboName',
    width: '160px',
    slot: 'comboNameSlot'
  },
  {
    label: '套餐类型',
    prop: 'comboType',
    slot: 'comboTypeSlot'
  },
  {
    label: '套餐金额',
    prop: 'buyMoney',
    slot: 'buyMoneySlot'
  },
  {
    label: '套餐有效期',
    prop: 'comboValidTime',
    slot: 'comboValidTimeSlot'
  },
  {
    label: '套餐次数',
    prop: 'comboCount',
    slot: 'comboCountSlot'
  },
  {
    label: '电池ID',
    prop: 'batteryId',
    slot: 'batteryIdSlot'
  },
  {
    label: '押金状态',
    prop: 'isDeposit',
    slot: 'isDepositSlot'
  },
  {
    label: '实名认证状态',
    prop: 'isRealName',
    width: '140px',
    slot: 'isRealNameSlot'
  },
  {
    label: '用户状态',
    prop: 'status',
    slot: 'statusSlot'
  },
  {
    label: '注册时间',
    prop: 'registerTime',
    width: '170px',
    slot: 'registerTimeSlot'
  },
  {
    label: '操作',
    prop: 'edit',
    width: '430px',
    slot: 'editSlot',
    attrs: {
      fixed: 'right'
    }
  }
])
const userParams = ref({
  pageNumber: 1,
  pageSize: 10,
  riderName: '',
  riderPhone: '',
  riderType: ''
})
const getDataList = async ()=> {
  const res = await riderPageQuery({ ...userParams.value })
  if(res) {
    const { total, list } = res
    tableData.value = list
    totalNum.value = total
  }
}
getDataList()
const formatRiderType = computed(() => {
  return function(type: number) {
    switch (type) {
      case 1:
        return '普通'
      case 2:
        return '免押'
      case 3:
        return '担保'
    }
  }
})
const formatComboType = computed(() => {
  return function(type: number) {
    switch (type) {
      case 1:
        return '按月'
      case 2:
        return '按天'
      case 3:
        return '按次'
      case 4:
        return '自定义'
    }
  }
})
/**
 * @rider 新增/编辑骑手
 */
const currRiderId = ref<Number>(-1)
const riderDialog = ref<Boolean>(false)
const riderRef = ref<FormInstance>()
const riderParams = ref({
  riderName: '',
  riderPhone: '',
  riderType: '',
  comboRenew: 1,
  comboId: ''
})
const riderRule = reactive<FormRules>({
  riderName: [
    { required: true, trigger: 'blur', message: '请输入骑手姓名' },
    { min: 2, max: 12, message: '请输入2~12个字长' }
  ],
  riderPhone: [{ required: true, trigger: 'blur', message: '请输入骑手电话号' }],
  riderType: [{ required: true, trigger: 'change', message: '请选择骑手类型' }],
  comboRenew: [{ required: true, trigger: 'change', message: '请选择是否自动续费' }],
  comboId: [{ required: true, trigger: 'change', message: '请选择要绑定的套餐' }]
})
// 新增骑手
const newRider = async () => {
  if(currRiderId.value === -1) await getComboList()
  riderDialog.value = true
}
// 骑手修改
const editRider = async (row: UserRider) => {
  const res = await merRideEcho({ id: row.id})
  Object.keys(res).forEach(key => {
    if(Object.keys(riderParams.value).includes(key)) riderParams.value[key] = res[key]
  })
  currRiderId.value = row.id
  newRider()
}
// 获取套餐列表
const getComboList = async () => {
  const res = await merFirstCombo()
  options.value.combo = res
}
getComboList()
// 取消新增/编辑
const closeRiderOperation = () => {
  riderDialog.value = false
  currRiderId.value = -1
  riderRef.value?.resetFields()
}
// 提交新增/编辑
const riderOperationSubmit = async (formEl: FormInstance | undefined) => {
  if(!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res = currRiderId.value ? await riderUpdate({ ...riderParams.value, id: currRiderId.value })  as unknown as string : await riderSave({ ...riderParams.value })  as unknown as string
      if(res === '请求成功') {
        ElNotification({
          title: `${currRiderId.value ? '修改' : '新增'}成功`,
          message: res,
          type: 'success',
          showClose: false,
          duration: 2 * 1000
        })
        userParams.value.pageNumber = currentPage.value =  1
        getDataList()
        closeRiderOperation()
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}
/**
 * @comboEdit 套餐修改或续费
 */
const currCombo = ref(-1)
const editOrRenewalDialog = ref(false)
const currType = ref('')
const editOrRenewalParams = ref({
  comboId: -1,
  riderName: '',
  riderPhone: '',
  merCode: '',
  accountUid: ''
})
const editOrRenewal = async (e: UserRider, type: string) => {
  Object.keys(e).forEach(key => {
    if(Object.keys(editOrRenewalParams.value).includes(key)) editOrRenewalParams.value[key] = e[key]
  })
  currType.value = type
  editOrRenewalDialog.value = true
}
// 提交修改或续费
const editOrRenewalSubmit = async () => {
  if(currCombo.value === -1) {
    ElMessage.error('请您先选择套餐!')
    return
  }
  editOrRenewalParams.value.comboId = currCombo.value
  const res = currType.value === '修改' ? (await riderComboSave({ ...editOrRenewalParams.value }) as unknown as string) : (await riderRenew({ ...editOrRenewalParams.value }) as unknown as string)
  if(res === '请求成功') {
    ElNotification({
      title: '操作成功',
      message: res,
      type: 'success',
      showClose: false,
      duration: 1.5 * 1000
    })
    getDataList()
    editOrRenewalClose()
  }
}
// 选择套餐
const selectCombo = (_item: MerchantCombo, index: number) => {
  currCombo.value = index
  editOrRenewalParams.value.comboId = _item.id
}
// 取消修改或续费
const editOrRenewalClose = () => {
  editOrRenewalDialog.value = false
  currCombo.value = -1
  editOrRenewalParams.value = {
    comboId: -1,
    riderName: '',
    riderPhone: '',
    merCode: '',
    accountUid: ''
  }
}
/**
 * @转个人骑手
 */
const toPersonal = async (e: UserRider) => {
  const res = await riderPersonal({ accountUid: e.accountUid, merCode: e.merCode }) as unknown as string
  if(res === '请求成功') {
    ElNotification({
      title: res,
      message: res,
      type: 'success',
      showClose: false,
      duration: 2 * 1000
    })
    userParams.value.pageNumber = currentPage.value =  1
    getDataList()
  }
}
/**
 * @终止套餐
 */
const terminateCombo = async (e: UserRider) => {
  const res = await riderMerEnd({ accountUid: e.accountUid }) as unknown as string
  if(res === '请求成功') {
    ElNotification({
      title: res,
      message: res,
      type: 'success',
      showClose: false,
      duration: 2 * 1000
    })
    userParams.value.pageNumber = currentPage.value =  1
    getDataList()
  }
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="骑手概览" @getChildren="getChildren">
    <template #btnSlot>
      <el-button type="primary" plain @click="newRider">新增骑手</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
    <template #riderNameSlot="{ row }">
      {{ row.riderName || '--' }}
    </template>
    <template #riderPhoneSlot="{ row }">
      {{ row.riderPhone || '--' }}
    </template>
    <template #riderTypeSlot="{ row }">
      {{ formatRiderType(row.riderType) || '--' }}
    </template>
    <template #comboRenewSlot="{ row }">
      {{ row.comboRenew ? '是' : '否' }}
    </template>
    <template #comboNameSlot="{ row }">
      {{ row.comboName || '--' }}
    </template>
    <template #comboTypeSlot="{ row }">
      {{ formatComboType(row.comboType) }}
    </template>
    <template #buyMoneySlot="{ row }">
      {{ row.buyMoney || '--' }}
    </template>
    <template #comboValidTimeSlot="{ row }">
      {{ row.comboValidTime || '--' }}
    </template>
    <template #comboCountSlot="{ row }">
      {{ row.comboCount || '--' }}
    </template>
    <template #batteryIdSlot="{ row }">
      {{ row.batteryId || '--' }}
    </template>
    <template #isDepositSlot="{ row }">
      {{ row.isDeposit ? '已缴纳' : '未缴纳' }}
    </template>
    <template #isRealNameSlot="{ row }">
      {{ row.isRealName ? '已实名' : '未实名' }}
    </template>
    <template #statusSlot="{ row }">
      <span :class="row.status ? 'text-red-400' : 'text-green-400'" >{{ row.status ? '冻结' : '正常' }}</span>
    </template>
    <template #registerTimeSlot="{ row }">
      {{ row.registerTime || '--' }}
    </template>
    <template #editSlot="{ row }">
      <div class="flex items-center">
        <el-button @click="editRider(row)" size="small" type="primary" plain>编辑</el-button>
        <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF" :hide-after="50" title="确定将用户转为个人骑手吗?" @confirm="toPersonal(row)">
          <template #reference>
            <el-button size="small" type="warning" plain>转个人骑手</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF" :hide-after="50" title="确定将用户套餐终止吗?" @confirm="terminateCombo(row)">
          <template #reference>
            <el-button size="small" type="danger" plain>终止套餐</el-button>
          </template>
        </el-popconfirm>
        <el-button @click="editOrRenewal(row, '修改')" size="small" type="warning" plain>套餐修改</el-button>
        <el-button @click="editOrRenewal(row, '续费')" size="small" type="primary" plain v-show="row.comboId">套餐续费</el-button>
      </div>
    </template>
  </ReuseTable>
  <!-- 新增/修改骑手 -->
  <el-dialog v-model="riderDialog" :title="`${ currRiderId ? '修改' : '新增' }骑手`" width="500px"  @closed="closeRiderOperation">
    <el-form :model="riderParams" :rules="riderRule" ref="riderRef" :scroll-to-error="true" label-position="left" label-width="130px">
      <el-form-item prop="riderName" label="骑手姓名">
        <el-input v-model="riderParams.riderName" placeholder="请输入骑手姓名" max-length="12" />
      </el-form-item>
      <el-form-item prop="riderPhone" label="手机号">
        <el-input v-model.number="riderParams.riderPhone" maxlength="11" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入骑手手机号码" />
      </el-form-item>
      <el-form-item prop="riderType" label="骑手类型">
        <el-select v-model="riderParams.riderType" placeholder="请选择骑手类型" >
          <el-option v-for="item in options.type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="comboRenew" label="是否自动续费">
        <el-select v-model="riderParams.comboRenew" placeholder="请选择是否自动续费" >
          <el-option v-for="item in options.renew" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="comboId" label="绑定套餐" v-if="currRiderId == -1">
        <el-select v-model="riderParams.comboId" placeholder="请选择绑定套餐" >
          <el-option v-for="item in options.combo" :key="item.id" :label="item.comboInfo" :value="item.id" />
        </el-select>
      </el-form-item>
      <div class="flex justify-end mt-10 ">
        <el-button type="info" plain @click="closeRiderOperation">取消</el-button>
        <el-button type="primary" plain @click="riderOperationSubmit(riderRef)">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
  <!-- 套餐续费/修改 -->
  <el-dialog v-model="editOrRenewalDialog" :title="`套餐${ currType }`" width="900px" @closed="editOrRenewalClose">
    <ul class="flex justify-between flex-wrap overflow-auto px-6 py-6 combo-list" v-infinite-scroll="(_load: any) =>{} ">
      <li class="w-5/12 mb-4 h-96 select-none" v-for="(item, index) in options.combo" :key="index" @click="selectCombo(item, index)">
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
      <el-button type="info" plain @click="editOrRenewalClose">取消</el-button>
      <el-button type="primary" plain @click="editOrRenewalSubmit()">确定</el-button>
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