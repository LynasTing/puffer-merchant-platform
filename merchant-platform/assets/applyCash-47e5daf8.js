import{d as H,r as d,s as P,a as V,o as D,c as I,e as o,w as t,f as a,t as R,F as U,v as j,i as p,y as i,b as h,E as B,h as M,l as O,m as $,g as z}from"./index-3a9c1492.js";import{I as A}from"./index-c28e4fd9.js";import{R as G}from"./index-ecab751f.js";import{c as L,d as J}from"./index-a60b3a53.js";const K={class:"flex justify-end mt-10"},le=H({__name:"applyCash",setup(Q){const y=d([]);let f=d(1),S=d(0);const m=d({pageNumber:1,pageSize:10,status:""}),_=n=>{Object.keys(n).length?(Object.keys(n).forEach(l=>{Object.keys(m.value).includes(l)&&(m.value[l]=n[l])}),m.value.pageNumber=f.value=1):(f.value=1,m.value={pageNumber:1,pageSize:10,status:""}),g()},N=n=>{m.value.pageNumber=f.value=n,g()},g=async()=>{const n=await L({...m.value});if(n){const{list:l,total:s}=n;S=s,y.value=l}},C=P(()=>function(n){switch(n){case 0:return"审核中";case 1:return"审核通过";case 2:return"驳回"}});g();const F=d([{label:"状态",value:"",key:"status",type:"select",options:[{label:"审核中",value:"0"},{label:"审核通过",value:"1"},{label:"驳回",value:"2"}]}]),x=V([{label:"银行名称",prop:"bankTitle",slot:"bankTitleSlot"},{label:"开户行",prop:"bankHandle",slot:"bankHandleSlot"},{label:"卡号",prop:"bankNo",slot:"bankNoSlot"},{label:"姓名",prop:"name",slot:"nameSlot"},{label:"手机号",prop:"phone",slot:"phoneSlot"},{label:"提现金额",prop:"cashFund",slot:"cashFundSlot"},{label:"审核状态",prop:"status",slot:"statusSlot"},{label:"申请时间",prop:"ctime",slot:"ctimeSlot"},{label:"备注",prop:"remark",slot:"remarkSlot"}]),c=d(!1),k=d(),r=d({bankTitle:"",bankHandle:"",bankNo:"",name:"",phone:"",cashFund:""}),E=V({bankTitle:[{required:!0,trigger:"blur",message:"请输入银行名称"}],bankHandle:[{required:!0,trigger:"blur",message:"请输入开户行"}],bankNo:[{validator:(n,l,s)=>{if(!l)return s(new Error("请输入银行卡号"));setTimeout(()=>{if(/^([1-9]{1})(\d{14}|\d{18})$/.test(l.trim()))s();else return s(new Error("请输入正确的银行卡号(15 ~ 19位)"))},500)},trigger:"blur"}],name:[{required:!0,trigger:"blur",message:"请输入持卡人姓名"}],phone:[{required:!0,trigger:"blur",message:"请输入银行预留号码"}],cashFund:[{required:!0,trigger:"blur",message:"请输入提现金额"}]}),T=async n=>{n&&await n.validate(async(l,s)=>{if(l){const u=await J({...r.value});u==="请求成功"&&(B({title:"操作成功",message:u,type:"success",showClose:!1,duration:1.5*1e3}),g(),v())}else console.log("error submit!",s)})},v=()=>{var n;c.value=!1,(n=k.value)==null||n.resetFields()};return(n,l)=>{const s=M,u=O,b=$,w=z,q=j;return D(),I(U,null,[o(A,{inquireInfo:a(F),title:"提现记录",onGetChildren:_},{btnSlot:t(()=>[o(s,{type:"primary",plain:"",onClick:l[0]||(l[0]=e=>c.value=!0)},{default:t(()=>[p("提现申请")]),_:1})]),_:1},8,["inquireInfo"]),o(G,{option:a(x),tableData:a(y),total:a(S),onPageChange:N,currentPage:a(f)},{bankTitleSlot:t(({row:e})=>[p(i(e.bankTitle||"--"),1)]),bankHandleSlot:t(({row:e})=>[p(i(e.bankHandle||"--"),1)]),bankNoSlot:t(({row:e})=>[p(i(e.bankNo||"--"),1)]),nameSlot:t(({row:e})=>[p(i(e.name||"--"),1)]),phoneSlot:t(({row:e})=>[p(i(e.phone||"--"),1)]),cashFundSlot:t(({row:e})=>[p(i(e.cashFund||"--"),1)]),statusSlot:t(({row:e})=>[h("span",null,i(a(C)(e.status)||"--"),1)]),ctimeSlot:t(({row:e})=>[h("span",null,i(e.ctime||"--"),1)]),remarkSlot:t(({row:e})=>[p(i(e.remark||"--"),1)]),_:1},8,["option","tableData","total","currentPage"]),o(q,{modelValue:a(c),"onUpdate:modelValue":l[8]||(l[8]=e=>R(c)?c.value=e:null),title:"提现申请",width:"500px",onClosed:v},{default:t(()=>[o(w,{model:a(r),rules:a(E),ref_key:"applyRef",ref:k,"label-width":"100px","label-position":"left"},{default:t(()=>[o(b,{prop:"bankTitle",label:"银行名称"},{default:t(()=>[o(u,{modelValue:a(r).bankTitle,"onUpdate:modelValue":l[1]||(l[1]=e=>a(r).bankTitle=e),modelModifiers:{number:!0},placeholder:"请输入银行名称"},null,8,["modelValue"])]),_:1}),o(b,{prop:"bankHandle",label:"开户行"},{default:t(()=>[o(u,{modelValue:a(r).bankHandle,"onUpdate:modelValue":l[2]||(l[2]=e=>a(r).bankHandle=e),modelModifiers:{number:!0},placeholder:"请输入开户行"},null,8,["modelValue"])]),_:1}),o(b,{prop:"bankNo",label:"卡号",required:""},{default:t(()=>[o(u,{modelValue:a(r).bankNo,"onUpdate:modelValue":l[3]||(l[3]=e=>a(r).bankNo=e),maxlength:"19",oninput:"value=value.replace(/^\\.+|[^\\d.]/g,'')",placeholder:"请输入银行卡号"},null,8,["modelValue"])]),_:1}),o(b,{prop:"name",label:"姓名"},{default:t(()=>[o(u,{modelValue:a(r).name,"onUpdate:modelValue":l[4]||(l[4]=e=>a(r).name=e),placeholder:"请输入姓名","max-length":"12"},null,8,["modelValue"])]),_:1}),o(b,{prop:"phone",label:"手机号"},{default:t(()=>[o(u,{modelValue:a(r).phone,"onUpdate:modelValue":l[5]||(l[5]=e=>a(r).phone=e),modelModifiers:{number:!0},maxlength:"11",oninput:"value=value.replace(/^\\.+|[^\\d.]/g,'')",placeholder:"请输入手机号码"},null,8,["modelValue"])]),_:1}),o(b,{prop:"cashFund",label:"提现金额"},{default:t(()=>[o(u,{modelValue:a(r).cashFund,"onUpdate:modelValue":l[6]||(l[6]=e=>a(r).cashFund=e),modelModifiers:{number:!0},maxlength:"7",oninput:"value=value.replace(/^\\.+|[^\\d.]/g,'')",placeholder:"请输入提现金额"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"]),h("div",K,[o(s,{type:"info",plain:"",onClick:v},{default:t(()=>[p("取消")]),_:1}),o(s,{type:"primary",plain:"",onClick:l[7]||(l[7]=e=>T(a(k)))},{default:t(()=>[p("确定")]),_:1})])]),_:1},8,["modelValue"])],64)}}});export{le as default};
