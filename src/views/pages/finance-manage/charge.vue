<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import ReuseTable from '@/components/reuse-table/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import { financeChangeRecord, financeApplyCharge } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'
import { staticUrl } from '@/utils/static'


// 展示的信息数据, 从接口获取
const baseUrl = import.meta.env.IMG
const tableData = ref<Finance[]>([])
let totalNum = ref<number>(0)
let currentPage = ref<number>(1)
const recordParams = ref({
  pageNumber: 1,
  pageSize: 10,
  status: ''
})
// 子组件筛选
const getChildren = (e: any[]) => {
  if(Object.keys(e).length) {
    Object.keys(e).forEach((key: string) => {
      if(Object.keys(recordParams.value).includes(key)) recordParams.value[key] = e[key]
    })
    recordParams.value.pageNumber = currentPage.value =  1
  }else {
    currentPage.value =  1
    recordParams.value = {
      pageNumber: 1,
      pageSize: 10,
      status: ''
    }
  }
  getDataList()
}
// pagination分页
const pageChange = (e: number) => {
  recordParams.value.pageNumber = currentPage.value = e
  getDataList()
}
const getDataList = async () => {
  const res = await financeChangeRecord({ ...recordParams.value })
  if(res) {
    const { list, total } = res
    totalNum = total
    tableData.value = list
  }
}
getDataList()
const formatStatus = computed(() => {
  return function(status: number) {
    switch (status) {
      case 0:
        return '审核中'
      case 1:
        return '审核通过'
      case 2:
        return  '驳回'
    }
  }
})
// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '状态',
    value: '',
    key: 'status',
    type: 'select',
    options: [
      {
        label: '审核中',
        value: '0'
      },
      {
        label: '审核通过',
        value: '1'
      },
      {
        label: '驳回',
        value: '2'
      }
    ]
  }
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '订单号',
    prop: 'orderNumber',
    width: '300px',
    slot: 'orderNumberSlot'
  },
  {
    label: '充值金额',
    prop: 'chargeFund',
    slot: 'chargeFundSlot'
  },
  {
    label: '状态',
    prop: 'status',
    slot: 'statusSlot'
  },
  {
    label: '支付凭证',
    prop: 'payDocument',
    slot: 'payDocumentSlot'
  },
  {
    label: '备注',
    prop: 'remark',
    slot: 'remarkSlot'
  },
  {
    label: '创建时间',
    prop: 'ctime',
    slot: 'ctimeSlot'
  },
  {
    label: '更新时间',
    prop: 'utime',
    slot: 'utimeSlot'
  },
])

/**
 * @apply 充值申请相关
 */
const chargeDialog = ref(false)
const imageUrl = ref('')
const payFile = ref<File>()
const chargeRef = ref<FormInstance>()
const chargeParams = ref({
  chargeFund: '',
  remark: '',
  payFile
})
const chargeRule = reactive<FormRules>({
  chargeFund: [{ required: true, trigger: 'blur', message: '请输入充值金额' }],
  remark: [{ required: false, trigger: 'blur', message: '请输入备注' }],
  payFile: [{ required: true, trigger: 'change', message: '请上传支付凭证' }]
})
// 文件上传限制
const uploadFile = (e: { target: { files: File[] } }) => {
  if(!e) return 
  const file: File = e?.target?.files[0]
  const isJPG = file.type === 'image/jpg'
  const isJPEG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  if (!isJPG && !isJPEG && !isPNG) {
    ElMessage.error('请上传jpg/png格式的图片!')
    return false
  } else if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过2MB!')
    return false
  }
  imageUrl.value = URL.createObjectURL(file!)
  chargeParams.value.payFile = file
}
// 提交提现
const applySubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const formData = new FormData()
      formData.append('payFile', chargeParams.value.payFile)
      formData.append('chargeFund', chargeParams.value.chargeFund)
      formData.append('remark', chargeParams.value.remark)
      const res = await financeApplyCharge(formData) as unknown as string
      if(res === '请求成功') {
        ElNotification({
          title: '操作成功',
          message: res,
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
        getDataList()
        closeApplySubmit()
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}

// 关闭充值弹窗
const closeApplySubmit = () => {
  chargeDialog.value = false
  imageUrl.value = ''
  payFile.value = undefined
  chargeRef.value?.resetFields()
  chargeParams.value = {
    chargeFund: '',
    remark: '',
    payFile: '' || undefined
  }
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="充值记录" @getChildren="getChildren">
    <template #btnSlot>
      <el-button type="primary" plain @click="chargeDialog = true">充值申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="pageChange" :currentPage="currentPage">
    <template #orderNumberSlot="{ row }">
      {{ row.orderNumber || '--' }}
    </template>
    <template #chargeFundSlot="{ row }">
      {{ row.chargeFund || '--' }}
    </template>
    <template #statusSlot="{ row }">
      {{ formatStatus(row.status) || '--' }}
    </template>
    <template #payDocumentSlot="{ row }">
      <el-image style="width: 100px; height: 100px" :src="baseUrl + row.payDocument" fit="fill" class="rounded-lg" >
        <template #error>
          <el-image style="width: 100px; height: 100px" :src="staticUrl('global/default_cloud.jpg')" fit="fill" />
        </template>
      </el-image>
    </template>
    <template #remarkSlot="{ row }">
      {{ row.remark || '--' }}
    </template>
    <template #ctimeSlot="{ row }">
      {{ row.ctime || '--' }}
    </template>
    <template #utimeSlot="{ row }">
      {{ row.utime || '--' }}
    </template>
  </ReuseTable>
  <el-dialog v-model="chargeDialog" title="充值申请" width="500px" @closed="closeApplySubmit">
    <el-form :model="chargeParams" :rules="chargeRule" ref="chargeRef" label-width="100px" label-position="left">
      <el-form-item prop="chargeFund" label="充值金额">
        <el-input v-model.number="chargeParams.chargeFund" placeholder="请输入充值金额" maxlength="7" oninput="value=value.replace(/[^0-9.]/g,'')" />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="chargeParams.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item prop="payFile" label="支付凭证">
        <div class="flex items-center relative">
          <div class="relative upload-div w-36 h-36 iconfont" :class="imageUrl ? 'opacity-0 z-10' : ''">
            <input type="file" @change="uploadFile($event)" accept="image/jpeg, image/jpg, image/png" class="upload_file w-full h-full cursor-pointer opacity-0" />
          </div>
          <el-image v-if="imageUrl" :src="imageUrl" class=" absolute -left-36 w-36 h-36 rounded-md cursor-pointer iconfont up-img"/>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeApplySubmit">取消</el-button>
      <el-button type="primary" plain @click="applySubmit(chargeRef)">确定</el-button>
    </div>
  </el-dialog>
</template>

<style  lang="scss" scoped>
.pay-file {
  border: 1px solid #d7dce4;
}
.upload-div {
  color: #8c939d;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: "\e78a";
    font-size: 28px;
    transform: translate(-50%, -50%) 
  }
}
</style>