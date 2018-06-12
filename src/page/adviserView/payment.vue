<template>
	<el-dialog
		title="新建线索"
		lock-scroll
		:show-close='false'
		:closeOnClickModal='false'
		v-model="payWindowVisible"
		:class="{ 'min-screen':screenSize ,'big-screen':!screenSize}"
		id="payWindow"
	>
		<h2>合同ID189891273</h2>
		<el-form :model="payForm" :rules="payrules" ref="payForm" label-width="90px">
      <el-form-item label="付款类型" prop="payType" id='payType'>
        <el-select v-model="payForm.payType" placeholder="请选择款项">
          <el-option :disabled="item.disabled"
                     v-for="(item,index) in optionsType"
                     :label="item.label"
                     :value="parseInt(index)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="款项去向" prop="payMethod" id="payMethod" placeholder="请选择款项">
        <el-cascader v-model="payForm.payMethod"
                     @change='methodChange'
                     filterable
                     :options="payMethods"
                     :show-all-levels="false"
                     :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="付款金额" prop="amount">
        <el-input v-model="payForm.amount" :maxlength='15'
                  placeholder="请输入付款金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" style="width:100%;" :maxlength='400'
                  placeholder="对哪类商家有格外偏好：宴会场地、婚纱礼服、主持、化妆、摄影、摄像、场地布置。是否有自己很喜欢的案例或风格。（400字以内）"
                  :autosize="{ minRows: 4, maxRows: 6}"
                  v-model="payForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button style="float: left;" @click="payWindowVisible = false">取 消</el-button>
      <el-button style="float: right;" type="primary"
                 @click="subForm('payForm');" :loading="subLoad">提 交
      </el-button>
    </div>
	</el-dialog>
</template>
<script type="text/javascript">
	import Bus from '../../store/bus.js'
	import { contractPayMent , adviserPayMent} from '../../service/getData.js'
	export default {
		data() {
			/*
				orderId： 订单号，商机号
				payType: 付款类型
				payMethod： 付款方式
				amount: 付款金额
				remark: 备注
			*/
			return {
				orderId: this.$route.params.id, 
				payWindowVisible : false, // 界面显示
				subLoad : false, // 提交按钮loading
				currentTaskId: '',
				optionsType: [],
				payMethods: [],
				props : {value: 'label'},
        payForm : {
          payType : '',
          payMethod   : [],
          amount  : '',
          remark : ''
        },
        payrules : {
          payType: [
            {type:'number', required: true, message: '请选择', trigger: 'change'}
          ],
          payMethod   : [
            {type: 'array', required: true, message: '请选择', trigger: 'change'}
          ],
          amount   : [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          remark  : [
            {required: true, trigger: 'blur'}
          ],
        }
			}
		},
		created(){
			this.getOptions();
		  Bus.$off('openPayMent');
      Bus.$on('openPayMent', () => {
        this.renderPayForm();
      });
    },
		computed: {
		  // ...mapState(['userData']),
      screenSize(){
        if (window.screen.height > 720)
        /*大屏*/
          return 0
        else
          return 1
      }
		},
		methods : {
			getOptions() {
				contractPayMent({}).then(res => {
					console.log(res);
					if (res.data.code != 200) return;
					this.payMethods = res.data.data.payMethod;
					this.optionsType = res.data.data.payType;
				})
			},
			renderPayForm() {
				// 清空表单 
				this.payForm = {
          payType : '',
          payMethod   : [],
          amount  : '',
          remark : ''
        }
        // this.$refs['payForm'].resetFields();
				this.payWindowVisible = true;
			},
			methodChange() {
				console.log('付款方式change');
			},
			subForm(formName) {
				let sendData = this.payForm;
				sendData.orderId = this.orderId;
				this.subLoad = true;
        this.$refs[formName].validate((valid) => {
        	if (valid) {
						console.log(sendData);
						adviserPayMent(sendData).then(res => {
							console.log(res);
							this.subLoad = false;
						})
        	}else {
        		this.subLoad = false;
        	}
        })
			}
		}
	}
</script>
<style lang="scss" rel="stylesheet/scss">
	#payWindow.min-screen .el-dialog {
    height: auto;
  }
  #payWindow.big-screen .el-dialog {
    height: 680px;
  }
	#payWindow {
		z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
    overflow: hidden;
    h2 {
	    font-size: 20px;
	    color: #313131;
	    letter-spacing: 0;
	    font-weight: 600;
	    margin-bottom: 30px;
	    padding-left: 20px;
    }
    .el-dialog {
      border: 1px solid #969696;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.38);
      border-radius: 8px !important;
      width: 666px;
      top: 0 !important;
      bottom: 0;
      margin: auto;
    }
    .min-screen .el-dialog {
      height: auto;
    }

    .el-dialog__header {
      /* height: 50px; */
      padding: 20px;
      border-bottom: 1px solid rgba(151, 151, 151, 0.2);
      .el-dialog__title {
        font-size: 16px;
        color: #313131;
      }
    }
    .el-dialog__body {
      max-height: 560px;
      overflow-y: auto;
    }

    .el-dialog__footer {
      border-top: 1px solid rgba(151, 151, 151, 0.5);
      height: 74px;
      padding: 0 36px;
      padding-top: 20px;
      background: #fff;
      position: absolute;
      width: 100%;
      bottom: 0;
      .el-button {
        width: 109px;
        height: 34px;
      }
      .el-button + .el-button {
        margin-left: 20px;
      }
    }
    .ths-title {
      padding-left: 18px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #313131;
    }
	}
</style>