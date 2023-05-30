<script lang="ts" setup>
import InquireCard from '@/components/inquire-card/index.vue'
import { TableOption, InquireType } from '@/types/table'
import { FormInstance, FormRules } from 'element-plus/lib/components/index.js'
import ReuseTable from '@/components/reuse-table/index.vue'
import { financeApplyCash, financeCashRecord } from '@/api/finance-manage/index'
import { Finance } from '@/types/finance'
import router from '@/router'


// 展示的信息数据, 从接口获取
const tableData = ref<Finance[]>([])
let totalNum = ref<number>(0)
const recordParams = ref({
  pageNumber: 1,
  pageSize: 1
})

// 子组件分页
const subPageChange = (e: number) => {
  console.log(`触发父组件了吗  + ::>>`, e)
  recordParams.value.pageNumber = e
  getDataList()
}
const getDataList = async () => {
  const res = await financeCashRecord({ ...recordParams.value })
  const { list, total } = res
  totalNum = total
  tableData.value = list
}
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
// 子组件table过滤
const filterMethod = e => {
  console.log(`e + ::>>`, e)
}
getDataList()

// 传给子组件的需要渲染的筛选条件
const inquireInfo = ref<InquireType[]>([
  {
    label: '商户名称',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '订单号',
    value: '',
    key: 'username',
    type: 'input'
  },
  {
    label: '时间',
    value: '',
    key: 'date',
    type: 'date'
  },
  // {
  //   label: '姓名',
  //   value: '',
  //   key: 'username',
  //   type: 'input'
  // },
  // {
  //   label: '手机号',
  //   value: '',
  //   key: 'input',
  //   type: 'input'
  // },
  // {
  //   label: '性别',
  //   value: '',
  //   key: 'sex',
  //   options: [
  //     {
  //       label: '男',
  //       value: 1
  //     },
  //     {
  //       label: '女',
  //       value: 0
  //     },
  //   ],
  //   type: 'select'
  // },
 
  
])
// 都要展示什么字段 (el-header), 在此处配置插槽信息
const option = reactive<TableOption[]>([
  {
    label: '银行名称',
    prop: 'bankTitle',
    slot: 'bankTitleSlot'
  },
  {
    label: '开户行',
    prop: 'bankHandle',
    slot: 'bankHandleSlot'
  },
  {
    label: '卡号',
    prop: 'bankNo',
    slot: 'bankNoSlot'
  },
  {
    label: '姓名',
    prop: 'name',
    slot: 'nameSlot'
  },
  {
    label: '手机号',
    prop: 'phone',
    slot: 'phoneSlot'
  },
  {
    label: '提现金额',
    prop: 'cashFund',
    slot: 'cashFundSlot'
  },
  {
    label: '审核状态',
    prop: 'status',
    slot: 'statusSlot'
  },
  {
    label: '申请时间',
    prop: 'ctime',
    slot: 'ctimeSlot'
  },
  {
    label: '备注',
    prop: 'remark',
    slot: 'remarkSlot'
  },
  {
    label: '操作',
    prop: 'edit',
    slot: 'editSlot'
  }
])
// 删除
const toDetail = (row) => {
  console.log(`row + ::>>`, row)
  router.push('./detail.vue')
}

/**
 * @apply 新增提现相关
 */

const applyDialog = ref(false)
const applyRef = ref<FormInstance>()
const applyParams = ref({
  bankTitle: '',
  bankHandle: '',
  bankNo: '',
  name: '',
  phone: '',
  cashFund: '',
})
const formatBankNo = (e) => {
  let accountChar 
  if (e.value == '') return
  var account = new String (e.value)
  account = account.substring(0,22) /*帐号的总数, 包括空格在内 */
  if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
        /* 对照格式 */
        if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
            var accountNumeric = accountChar = "", i;
            for (i=0;i<account.length;i++){
                accountChar = account.substr (i,1);
                if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i=0;i<accountNumeric.length;i++){    /* 可将以下空格改为-,效果也不错 */
                if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
                account = account + accountNumeric.substr (i,1)
            }
        }
    }
    else
    {
        account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
    }
    if (account != e.value) e.value = account
}
const cardPass = (_rule: any, value: any, callback: any) => {
  console.log(`value + ::>>`, value)
  if(!value) return callback(new Error('请输入银行卡号'))
  setTimeout(() => {
    const regExp = /^([1-9]{1})(\d{14}|\d{18})$/; 
    if(!regExp.test(value.trim())) {
      return callback(new Error('请输入正确的银行卡号(15 ~ 19位)')) 
    }else {
      callback()
    }
  }, 500)
}
const applyRule = reactive<FormRules>({
  bankTitle: [{ required: true, trigger: 'blur', message: '请输入银行名称' }],
  bankHandle: [{ required: true, trigger: 'blur', message: '请输入开户行' }],
  bankNo: [{ validator: cardPass, trigger: 'blur' }],
  name: [{ required: true, trigger: 'blur', message: '请输入持卡人姓名' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入银行预留号码' }],
  cashFund: [{ required: true, trigger: 'blur', message: '请输入提现金额' }]
})
// 提交提现
const applySubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if(valid) {
      const res  = await financeApplyCash({ ...applyParams }) as unknown as string
      if(res === '请求成功') {
        ElNotification({
          title: '操作成功',
          message: res,
          type: 'success',
          showClose: false,
          duration: 1.5 * 1000
        })
      }
    }else {
      console.log('error submit!', fields)
    }
  })
}
// 关闭提现弹窗
const closeApplySubmit = () => {
  applyDialog.value = false
  applyRef.value?.resetFields()
}
</script>

<template>
  <InquireCard :inquireInfo="inquireInfo" title="提现记录" @getChildren="getDataList">
    <template #btnSlot>
      <el-button type="primary" plain @click="applyDialog = true">提现申请</el-button>
    </template>
  </InquireCard>
  <ReuseTable :option="option" :tableData="tableData" :total="totalNum" @pageChange="subPageChange">
    <template #bankTitleSlot="{ row }">
      {{ row.bankTitle || '--' }}
    </template>
    <template #bankHandleSlot="{ row }">
      {{ row.bankHandle || '--' }}
    </template>
    <template #bankNoSlot="{ row }">
      {{ row.bankNo || '--' }}
    </template>
    <template #nameSlot="{ row }">
      {{ row.name || '--' }}
    </template>
    <template #phoneSlot="{ row }">
      {{ row.phone || '--' }}
    </template>
    <template #cashFundSlot="{ row }">
      {{ row.cashFund || '--' }}
    </template>
    <template #statusSlot="{ row }">
      <span>{{ formatStatus(row.status) || '--' }}</span>
    </template>
    <template #ctimeSlot="{ row }">
      <span>{{ row.ctime || '--' }}</span>
    </template>
    <template #remarkSlot="{ row }">
      {{ row.remark || '--' }}
    </template>
    <template #editSlot="{ row, index }">
      <div>
        <el-button @click="toDetail(row, index)" type="primary" plain>查询明细</el-button>
      </div>
    </template>
  </ReuseTable>
  <el-dialog v-model="applyDialog" title="提现申请" width="500px" @closed="closeApplySubmit">
    <el-form :model="applyParams" :rules="applyRule" ref="applyRef">
      <el-form-item prop="bankTitle">
        <el-input v-model.number="applyParams.bankTitle" placeholder="请输入银行名称">
          <template #prepend>银行名称</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="bankHandle">
        <el-input v-model.number="applyParams.bankHandle" placeholder="请输入开户行">
          <template #prepend>开户行</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="bankNo">
        <el-input v-model="applyParams.bankNo" maxlength="19" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入银行卡号">
          <template #prepend>卡号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="applyParams.name" placeholder="请输入姓名" max-length="12">
          <template #prepend>姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model.number="applyParams.phone" maxlength="11" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入手机号码">
          <template #prepend>手机号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="cashFund">
        <el-input v-model.number="applyParams.cashFund" maxlength="7" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="请输入提现金额 ">
          <template #prepend>提现金额</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-10 ">
      <el-button type="info" plain @click="closeApplySubmit">取消</el-button>
      <el-button type="primary" plain @click="applySubmit(applyRef)">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>