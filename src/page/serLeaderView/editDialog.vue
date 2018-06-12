<template>
  <el-dialog id="editDialog" top="10%"
             :title="dialogTitle"
             v-model="dialogVisible"
             :show-close='false'
             :close-on-click-modal="false">
    <h2 v-if="formInfo.title">{{formInfo.title}}</h2>
    <el-form ref="formInfo.valueList" :model="formInfo.valueList" label-width="120px" label-position="left">
      <ul>
        <li v-for="item in formInfo.typeList">
          <!-- 文本 type = 1 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 1">
            <el-input type="text" v-model="formInfo.valueList[item.key]" :maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 日期  type = 2 -->
          <el-form-item :label="item.name" prop="wedDate" v-else-if="item.type == 2">
            <el-cascader v-model="formInfo.valueList.wedDate"
                         change-on-select
                         :options="date_options">
            </el-cascader>
          </el-form-item>
          <!-- 隐藏表单  type = 3 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 3" style="display: none">
            <el-input type="text" v-model="formInfo.valueList[item.key]" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 普通下拉  type = 4 -->
          <el-form-item :label="item.name" :prop='item.key' v-if="item.type == 4">
            <el-select v-model="formInfo.valueList[item.key].value" placeholder="请选择">
              <el-option v-for="optionItem in formInfo.valueList[item.key].list" :key="optionItem.optionName"
                         :label="optionItem.optionName" :value="optionItem.optionValue"></el-option>
            </el-select>
          </el-form-item>
          <!-- 文本域  type = 5 -->
          <el-form-item :label="item.name" :prop='item.key' v-if="item.type == 5">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formInfo.valueList[item.key]">
            </el-input>
          </el-form-item>
          <!-- 特殊文本域组 type = 11 -->
          <el-form-item :prop='item.key' v-if="item.type == 11" id="textareaGroup" style="margin-left: -120px;">
            <p>{{item.name}}</p>
            <el-input
              type="textarea"
              :rows="2"
              :placeholder="item.default"
              v-model="formInfo.valueList[item.key]">
            </el-input>
          </el-form-item>
          <!-- 只读  type = 6 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 6">
            <el-input type="text" v-model="formInfo.valueList[item.key]" :maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 文件上传  type = 7 -->

          <!-- 单选按钮  type = 8 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 8">
            <el-radio-group v-model="formInfo.valueList[item.key]">
              <el-radio label="1">item.radioFirst</el-radio>
              <el-radio label="2">item.radioSecond</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 城市级联  type = 9 -->
          <el-form-item :label="item.name" prop="location" v-if="item.type == 9">
            <el-cascader
              @change="handleItemChange"
              :options="city_options"
              change-on-select
              v-model="formInfo.valueList.location"
            ></el-cascader>
          </el-form-item>
          <!-- 预算范围  type = 10 -->
          <el-form-item :label="item.name" id='wedCost' prop='budgetState' v-if="item.type == 10">
            <el-select v-model="formInfo.valueList.budgetState" placeholder="请选择">
              <el-option label="未确定" value="1"></el-option>
              <el-option label="已确定" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='budgetRange' id='range' v-if='item.type == 10'
                        v-show='formInfo.valueList.budgetState == 2'>
            <div class="range-wrap">
              <el-input
                class='numCost'
                v-model="formInfo.valueList.budgetRange[0]"
                size="small"></el-input>
              <span style="opacity:.5;">&nbsp;万 --  &nbsp;</span>
              <el-input class='numCost'
                        v-model="formInfo.valueList.budgetRange[1]"
                        size="small"></el-input>
              <span style="opacity:.5;">&nbsp;万</span>
            </div>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit" size="large" style="float: left;">取 消</el-button>
      <!-- <el-button @click="temSubmit(formInfo.valueList)" size="large">暂 存</el-button> -->
      <el-button type="primary" @click="submitForm(formInfo.valueList)" size="large" :loading="subloading">提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
  import {mapState, mapActions} from 'vuex';
  import Bus from '../../store/bus.js';
  import {getRegion, getCurrentStepForm, adviserOrderSubmit} from '../../service/getData.js';
  import dateData from '../../plugins/dateData.js';
  export default{
    data(){
      return {
        dialogTitle    : '',
        dialogVisible  : false,
        subloading     : false,
        boxnum         : '',
        currentUserId  : '',
        currentTaskID  : '',
        currentStep    : '',
        currentNodeType: '',
        formInfo       : {
          title    : '',
          valueList: {
            budgetState: '', // 预算下拉
            budgetRange: [] // 预算范围
          },
          typeList : []
        },
        city_options   : [{value: '-1', label: '未确定'}],
        date_options   : dateData
      }
    },
    created(){
      this.currentUserId = this.userData().userInfo.id;
      this.getClueCitys({parentId: 1}); // 获取城市级联
      Bus.$off('editStep');
      Bus.$on('editStep', data => {
        console.log('订单步骤信息', data);
        this.currentStep = data.title; //子节点title
        this.boxnum = data.boxnum;
        this.currentTaskID = this.$route.params.id; //订单id
        this.currentNodeType = data.nodeType;
        this.renderFormList();
      });
    },
    methods: {
      ...mapState(['userData']),
      /*获取城市*/
      getClueCitys(data){
        getRegion(data).then(res => {
          var res = res.data;
          if (res.code != 200) {
            this.$message.error('接口出错');
            return;
          }
          if (this.city_options.length == 1) {
            res.data.forEach(item => {
              this.city_options.push({value: item.id, label: item.name, children: []})
            })
          } else {
            this.city_options.forEach(privent => {
              if (privent.value == data.parentId && privent.children.length == 0) {
                res.data.forEach(item => {
                  privent.children.push({value: item.id, label: item.name})
                })
              }
            })
          }
        })
      },
      /*城市选中某一级的回调*/
      handleItemChange(val) {
        console.log(val);
        if (val[0] != -1)
          this.getClueCitys({parentId: val[0]});
      },
      // 重置表单数据
      restForm() {
        this.dialogVisible = false;
        // this.$refs[].resetFields();
      },
      // 渲染表单数据
      renderFormList() {
        getCurrentStepForm({
          'uid'     : this.currentUserId,
          'id'      : this.currentTaskID,
          'boxnum'  : this.boxnum,
          'title'   : this.currentStep,
          'nodetype': this.currentNodeType
        })
          .then(res => {
            console.log('打开子节点弹窗数据', res);
            this.dialogTitle = res.data.data.title;
            let resData = res.data.data.childData;
            this.formInfo.title = resData.title;
            this.formInfo.typeList = resData.listData;
            // 处理合同类型
            if (res.data.data.boxnum == 777) {
              let oA = document.createElement('a');
              oA.href = resData.url;
              oA.click();
              return;
            }
            // this.formInfo.valueList = {
            //     budgetState: null
            // };
            /*处理特殊数据
             婚礼日期
             婚礼场地
             婚礼预算
             */
            if (!resData.listData)
              return;
            resData.listData.forEach(item => {
              if (item.key instanceof Array) {
                if (item.type == "2") {
                  var flag = item.value.every(key => {
                    return key == ''; // 婚礼日期值为空
                  })
                  if (flag) {
                    this.formInfo.valueList.wedDate = [];
                  } else {
                    // 转换日期格式
                    this.formInfo.valueList.wedDate = item.value.map(wd => {
                      return wd - 0; //数据类型转换
                    });
                  }
                }
                else if (item.type == "9") {
                  var flag = item.value.every(key => {
                    return key == '';
                  })
                  if (flag) {
                    this.formInfo.valueList.location = [];
                  } else {
                    this.formInfo.valueList.location = item.value.map(lc => {
                      return lc - 0;
                    });
                    // 获取市级列表
                    this.getClueCitys({parentId: this.formInfo.valueList.location[1]});
                  }
                }
                else if (item.type == "10") {
                  var flag = item.value.every(key => {
                    return key == '';
                  })
                  if (flag) {
                    // 婚礼预算未确定
                    this.formInfo.valueList.budgetState = '1';
                    this.formInfo.valueList.budgetRange = [];
                  } else {
                    // 婚礼预算已确定
                    this.formInfo.valueList.budgetState = '2';
                    this.formInfo.valueList.budgetRange = item.value.map(br => {
                      return br - 0;
                    });
                  }
                }
              } else {
                this.formInfo.valueList[item.key] = item.value.toString();
              }
            })
            console.log('表单值list', this.formInfo.valueList);
            this.dialogVisible = true; // 更新数据后,再打开弹窗
          })
      },
      formData_query(data) {
        // let query_flag = true;
        // for (let key in data) {
        //     if (typeof data[key] != 'string') {
        //         query_flag = false;
        //     }
        // }
        // if (query_flag) {
        //     return data;
        // }
        let forms = data;
        forms.areaType = [];
        forms.des = [];
        for (let key in forms) {
          if (forms.hasOwnProperty(key)) {
            if (key.indexOf('description') == 0 && forms[key] != '') {
              forms.des.push(forms[key]);
              let descriptionType = key.substring(11);
              forms.areaType.push(descriptionType);
            }
          }
        }
        // 婚礼日期
        if (data.wedDate) {
          forms.wed_date_year = data.wedDate[0];
          forms.wed_date_month = data.wedDate[1];
          forms.wed_date_day = data.wedDate[2];
        }
        // 婚礼城市
        if (data.location) {
          if (data.location[0] == '-1') {
            forms.wed_nation = data.location[0]; // 中国
          } else {
            forms.wed_nation = 1; // 中国
          }
          forms.wed_province = data.location[0] || '';
          forms.wed_city = data.location[1] || '';
        }
        // 婚礼预算
        if (data.budgetRange) {
          if (data.budgetState == 2) {
            forms.budget_begin = data.budgetRange[0] || '';
            forms.budget_end = data.budgetRange[1] || '';
          } else {
            forms.budget_begin = '-1';
            forms.budget_end = data.budgetRange[1] || '';
          }
        }
        return forms;
      },
      cancelSubmit() {
        this.restForm();
        this.$message({
          message    : '您已经取消操作',
          showClose  : true,
          customClass: "err",
          iconClass  : 'icon-wrong'
        });
      },
      // temSubmit(val) { // 暂存
      //   this.restForm();
      // },
      submitForm(val) {
        console.log('原始表单数据', val);
        let allFormData = this.formData_query(val);
        allFormData.uid = this.currentUserId;
        allFormData.id = this.currentTaskID;
        allFormData.boxnum = this.boxnum;
        console.log('提交数据', allFormData);
        adviserOrderSubmit(allFormData).then(res => {
          console.log('提交返回数据', res);
          if (res.data.code == 200) {
            // 成功回调
            this.$message({
              message    : '保存成功',
              showClose  : true,
              customClass: "succ",
              iconClass  : 'icon-success'
            });
            Bus.$emit('menuTotal');
            Bus.$emit('stepSubmit');
            this.restForm();
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scope>
  #editDialog {
    z-index: 9998 !important;
    background: rgba(0, 0, 0, 0.33);
    .el-dialog {
      width: 666px;
    }
  }
  #editDialog .el-dialog__header {
    padding: 20px 30px;
    span {
      font-size: 18px;
      color: #343434;
      letter-spacing: 0;
      font-weight: 600;
    }
    .el-dialog__title {
      line-height: 1.5;
    }
  }
  #editDialog .el-dialog__body {
    min-height: 500px;
    padding: 25px 60px;
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
    /*background-color: #F1F6F9;*/
    .el-form-item__label {
      color: #919191;
    }
  }
  #editDialog .dialog-footer button {
    width: 109px;
    line-height: 12px;
  }
  #editDialog .el-button + .el-button {
    margin-left: 18px;
  }
  #editDialog h2 {
    font-size: 16px;
    color: #313131;
    font-weight: normal;
    padding-bottom: 25px;
  }
  #editDialog li {
    min-height: 50px;
    margin-bottom: 25px;
    .el-input {
      max-width: 300px;
    }
  }
  #editDialog #range {
    position: absolute;
    left: 350px;
    transform: translateY(-72px);
    -webkit-transform: translateY(-72px);
    .el-form-item__content {
      margin-left: 0px !important;
    }
    .range-wrap {
      float: left;
    }
    .numCost {
      float: left;
      width: 50px;
      height: 36px;
      input {
        height: 36px;
      }
    }
    span {
      float: left;
      height: 36px;
      line-height: 36px;
    }
  }
  #textareaGroup .el-textarea {
    width: 100% !important;
  }
</style>
