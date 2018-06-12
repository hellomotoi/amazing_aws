<template>
  <el-dialog id="editDialogService" top="10%"
             :title="dialogTitle"
             v-model="dialogVisible"
             :show-close='false'
             :close-on-click-modal="false">
    <h2 v-if="formInfo.title">{{formInfo.title}}</h2>
    <el-form ref="formInfo.valueList" :model="formInfo.valueList" :label-position="labelPosition">
      <ul>
        <li v-for="item in formInfo.typeList">
          <!-- 文本 type = 1 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 1">
            <el-input type="text" v-model="formInfo.valueList[item.key]" :maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 日期  type = 2 -->

          <!-- 隐藏表单  type = 3 -->

          <!-- 普通下拉  type = 4 -->

          <!-- 文本域  type = 5 -->
          <el-form-item :label="item.name" :prop='item.key' v-if="item.type == 5">
            <el-input
              type="textarea"
              :maxlength="400"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="formInfo.valueList[item.key]">
            </el-input>
          </el-form-item>
          <!-- 特殊文本域组 type = 11 -->

          <!-- 只读  type = 6 -->

          <!-- 文件上传  type = 7 -->
          <el-form-item :label="item.name" :prop='item.key' v-if="item.type == 7" class="upload-box">
            <!--不可用-->
            <!-- <el-button v-if="item.value.length>0 || isLoading"
                       type="primary"
                       :disabled="true">
              <i class="upload-icon"></i>
              <span>上传文件</span>
            </el-button> -->
            <!--可用-->
            <el-upload
              class="upload"
              action="/aws/upload/submit"
              :data="{
                      'uid': currentUserId,
                      'id': currentID,
                      'taskId': currentTaskID
                    }"
              :multiple="false"
              :before-upload="uplBeforeHandle"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="uplErrorHandle"
              :on-preview="handlePreview"
              :disabled="upload_btn"
              :file-list="item.value">
              <el-button size="small"
                         type="primary"
                         :disabled="upload_btn"
              >
                <i class="upload-icon"></i>
                <span>上传文件</span>
              </el-button>
            </el-upload>
          </el-form-item>
          <!-- 单选按钮  type = 8 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 8">
            <el-radio-group v-model="formInfo.valueList[item.key]">
              <el-radio label="1">我们推荐</el-radio>
              <el-radio label="2">新人自选</el-radio>
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

          <!-- 日期范围 type = 12 -->
          <el-form-item :label="item.name" prop="dateranges" v-if="item.type == 12">
            <el-date-picker v-model="formInfo.valueList.dateranges" type="daterange" placeholder="选择日期范围">
            </el-date-picker>
          </el-form-item>
          <!-- 下拉模糊匹配 type = 13 -->
          <el-form-item :label="item.name" :prop="item.key" v-if="item.type == 13" id="selectLoad">
            <el-select v-model="formInfo.valueList[item.key]" filterable :placeholder="item.placeholder">
              <el-option v-for="options in optionList[item.key]" :key="options.uid" :label="options.name"
                         :value="options.uid">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 单选按钮,签订合同  type = 14 -->
          <el-form-item :prop="item.key" v-if="item.type == 14">
            <p>{{item.name}}</p>
            <el-radio-group v-model="formInfo.valueList[item.key]">
              <el-radio label="1">{{item.radioFirst}}</el-radio>
              <el-radio label="2">{{item.radioSecond}}</el-radio>
            </el-radio-group>
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
  import {
    getPersonList,
    getRegion,
    serviceUploadRemove,
    getCurrentServiceForm,
    serviceOrderSubmit
  } from '../../service/getData.js';
  export default{
    data(){
      return {
        isLoading    : false, //用于判断是否正在上传文件
        dialogTitle  : '',
        dialogVisible: false,
        subloading   : false,
        upload_btn   : true,
        labelPosition: 'left',
        boxnum       : '',
        currentUserId: '',
        currentID    : '',
        currentTaskID: '',
        currentStep    : '',
        formInfo     : {
          title    : '',
          valueList: {
            'banquet_designer': '',
            'flower_designer' : '',
            'executive'       : '',
            'is_recommend'    : '',
            'dateranges'      : '',
            't_compere'       : '', //主持人协议
            't_cameraShooting': '', //摄影协议
            't_makeup'        : '', //摄像协议
            't_photography'   : ''  //化妆协议
          },
          typeList : []
        },
        city_options : [{value: -1, label: '未确定'}],
        optionList   : {
          'banquet_designer': '',
          'flower_designer' : '',
          'executive'       : ''
        }
      }
    },
    created(){
      this.currentUserId = this.userData().userInfo.id;
      this.getClueCitys([]); // 获取城市级联
      Bus.$off('editStep');
      Bus.$on('editStep', data => {
        console.log('订单步骤信息', data);
        this.currentID = this.$route.params.id; //订单id
        this.currentStep = data.title || ''; //子节点title
        this.dialogTitle = data.name || '';
        this.boxnum = data.boxnum;
        this.currentTaskID = data.taskIds || data.taskId; //订单taskId
        this.renderFormList();
      });
    },
    methods: {
      ...mapState(['userData']),
      /*获取城市*/
      getClueCitys(data, fn){
        let deeplens = data.length;
        let getCity = {
          parentId: data[deeplens - 1] || 0
        }
        getRegion(getCity).then(res => {
          var res = res.data;
          if (res.code != 200) {
            this.$message.error('接口出错');
            return;
          }
          console.log('城市数据start', this.city_options);
          switch (deeplens) {
            case 1:
              this.city_options.forEach(country => {
                if (country.value == data[0]) {
                  if (res.data.length == 0) {
                    country.children = null;
                    return;
                  }
                  country.children = [];
                  res.data.forEach(province => {
                    country.children.push({value: province.id, label: province.name, children: province.child})
                  })
                }
              })
              break;
            case 2:
              this.city_options.forEach(country => {
                if (country.value == data[0]) {
                  country.children.forEach(province => {
                    if (province.value == data[1]) {
                      if (res.data.length == 0) {
                        province.children = null;
                        return;
                      }
                      province.children = [];
                      res.data.forEach(city => {
                        province.children.push({value: city.id, label: city.name})
                      })
                    }
                  })
                }
              })
              break;
            case 3:
              console.log('暂无');
              break;
            default:
              this.city_options = [{value: -1, label: '未确定'}];
              res.data.forEach(country => {
                this.city_options.push({value: country.id, label: country.name, children: country.child})
              });
              break;
          }
          if (fn) {
            fn();
          }
          console.log('城市数据end', this.city_options);
        })
      },
      /*城市选中某一级的回调*/
      handleItemChange(val) {
        if (val[0] != -1)
          this.getClueCitys(val);
      },
      getOptionList(data, listType) {
        getPersonList({'roleId': data}).then(res => {
          console.log('获取角色列表', res);
          this.optionList[listType] = res.data.data;
        })
      },
      // 重置表单数据
      restForm() {
        this.dialogVisible = false;
        // this.$refs[].resetFields();
      },
      // 渲染表单数据
      renderFormList() {
        getCurrentServiceForm({
          'uid'   : this.currentUserId,
          'id'    : this.currentID,
          'boxnum': this.boxnum,
          //'title'       : this.currentStep,
          'taskId': this.currentTaskID
        }).then(res => {
            console.log('打开子节点弹窗数据', res);
            this.labelPosition = res.data.data.labelPosition || 'left';
            let resData = res.data.data;
            if (!resData.childData) {
              return;
            }
            let data = resData.childData;
            if (data.listData) {
              data = data.listData;
            }
            this.formInfo.typeList = data;
            /*处理特殊数据*/
            data.forEach(item => {
              switch (item.type) {
                case 7:
                  this.upload_btn = item.value.length > 0 ? true : false;
                  break;
                case 9:
                  var flag = item.value.every(key => {
                    return key == '';
                  })
                  if (!flag) {
                    this.formInfo.valueList.location = item.value.map(lc => {
                      return lc - 0;
                    });
                    if (this.formInfo.valueList.location != -1) {
                      // this.getClueCitys({parentId: this.formInfo.valueList.location[1]}); // 获取市级列表
                      this.getClueCitys([this.formInfo.valueList.location[0]], () => {
                        this.getClueCitys([this.formInfo.valueList.location[0], this.formInfo.valueList.location[1]]);
                      });
                    }
                  } else {
                    this.formInfo.valueList.location = [];
                  }
                  break;
                case 12:
                  var flag = item.value.every(key => {
                    return key == '';
                  })
                  if (!flag) {
                    this.formInfo.valueList.dateranges = item.value
                  } else {
                    this.formInfo.valueList.dateranges = [];
                  }
                  break;
                case 13:
                  this.getOptionList('7', 'banquet_designer');
                  this.getOptionList('8', 'flower_designer');
                  this.getOptionList('9', 'executive');
                  if (item.value) {
                    this.formInfo.valueList[item.key] = item.value - 0;
                  } else {
                    this.formInfo.valueList[item.key] = item.value || '';
                  }
                  break;
                case 14:
                  console.log(item.name)
                  break;
                default:
                  this.formInfo.valueList[item.key] = item.value.toString();
                  break;
              }
            })
            console.log('表单值list', this.formInfo.valueList);
            this.dialogVisible = true;
          })
      },
      /*上传文件前*/
      uplBeforeHandle(file){
        this.upload_btn = true;
        this.isLoading = true;
      },
      /*点击文件下载*/
      handlePreview(file) {
        let oA = document.createElement('a');
        oA.href = file.url;
        oA.download = file.url;
        oA.click();
      },
      /*删除上传的文件*/
      handleRemove(file, fileList) {
        console.log(file);
        let params = {
          'uid'         : this.currentUserId,
          'id'          : this.currentID,
          'taskId'      : this.currentTaskID,
          'attachmentId': file.id || file.response.data.id
        };
        serviceUploadRemove(params).then(res => {
          console.log('删除附件返回值: ', res);
          this.upload_btn = false;
          if (res.error) {
            this.$message({
              message    : res.msg,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
          }
          ;
          this.isLoading = false;
          // this.renderFormList();
          Bus.$emit('menuTotal');
          Bus.$emit('stepSubmit');
        })
      },
      /*上传成功*/
      handleSuccess() {
        console.log('成功之后的回调');
        this.upload_btn = true;
        // this.renderFormList();
        Bus.$emit('stepSubmit');
      },
      /*上传失败*/
      uplErrorHandle(err, file, fileList){
        this.upload_btn = false;
        this.isLoading = false;
      },
      formData_query(data) {
        let forms = data;
        // 婚礼城市
        if (data.location) {
          if (data.location[0] == '-1') { // 未确定
            forms.wed_nation = data.location[0]; // 中国
          }
          else { // 用户未修改直接提交
            forms.wed_nation = data.location[0] || '';
            forms.wed_province = data.location[1] || '';
            forms.wed_city = data.location[2] || '';
          }
        }
        // 时期范围
        if (data.dateranges) {
          let beginTime = data.dateranges[0];
          let endTime = data.dateranges[1];
          if (beginTime && endTime) {
            beginTime = beginTime.getFullYear() + '-' + (beginTime.getMonth() + 1) + '-' + beginTime.getDate();
            endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
          }
          forms.out_date = beginTime;
          forms.in_date = endTime;
        }

        let formInfo_valueLits = {};
        let formInfo_typeLits = this.formInfo.typeList;
        formInfo_typeLits.forEach(item => {
          switch (item.type) {
            case 2:
              formInfo_valueLits.wedDate = data.wedDate;
              break;
            case 9:  // 婚礼城市
              if (data.location[0] == '-1') { // 未确定
                formInfo_valueLits.wed_nation = data.location[0]; // 中国
              }
              else { // 用户未修改直接提交
                formInfo_valueLits.wed_nation = data.location[0] || '';
                formInfo_valueLits.wed_province = data.location[1] || '';
                formInfo_valueLits.wed_city = data.location[2] || '';
              }
              break;
            case 10:
              formInfo_valueLits.budgetState = data.budgetState;
              formInfo_valueLits.budgetRange = data.budgetRange;
              break;
            case 11:
              // formInfo_valueLits.textarea = {};
              formInfo_valueLits.areaType = [];
              formInfo_valueLits.des = [];
              for (let key in data) {
                if (data.hasOwnProperty(key)) {
                  if (key.indexOf('description') > -1 && data[key] != '') {
                    formInfo_valueLits.des.push(data[key]);
                    let descriptionType = key.substring(11);
                    formInfo_valueLits.areaType.push(descriptionType);
                  }
                }
              }
              break;
            case 12:  // 时期范围
              let beginTime = data.dateranges[0];
              let endTime = data.dateranges[1];
              if (beginTime && endTime) {
                beginTime = beginTime.getFullYear() + '-' + (beginTime.getMonth() + 1) + '-' + beginTime.getDate();
                endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
              }
              formInfo_valueLits.out_date = beginTime;
              formInfo_valueLits.in_date = endTime;
              break;
            default:
              formInfo_valueLits[item.key] = data[item.key];
              break;
          }
        })
        return formInfo_valueLits;
        //return forms;
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
      submitForm(val) {
        console.log('原始表单数据', val);
        let allFormData = this.formData_query(val);
        allFormData.uid = this.currentUserId;
        allFormData.id = this.currentID;
        allFormData.taskId = this.currentTaskID;
        allFormData.boxnum = this.boxnum;
        allFormData.type = 1; // 弹框默认 type = 1
        console.log('提交数据', allFormData);
        serviceOrderSubmit(allFormData).then(res => {
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
            if (res.data.url) {
              let oB = document.createElement('a');
              oB.href = res.data.url;
              oB.click();
              return;
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scope>
  #editDialogService {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
    .el-dialog {
      width: 666px;
    }
  }
  #editDialogService .el-dialog__header {
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
  #editDialogService .el-dialog__body {
    position: relative;
    min-height: 300px;
    max-height: 500px;
    padding: 25px 60px;
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
    overflow-x: hidden;
    overflow-y: auto;
    /*background-color: #F1F6F9;*/
    .el-form-item__label {
      color: #919191;
    }
  }
  #editDialogService .dialog-footer button {
    width: 109px;
    line-height: 12px;
  }
  #editDialogService .el-button + .el-button {
    margin-left: 18px;
  }
  #editDialogService h2 {
    font-size: 16px;
    color: #313131;
    font-weight: normal;
    padding-bottom: 25px;
  }
  #editDialogService li {
    min-height: 50px;
    margin-bottom: 25px;
    .el-input {
      max-width: 300px !important;
    }
  }
  #editDialogService .upload {
    &.disabled {
      .el-upload {
        display: none;
      }
    }
  }
  #editDialogService .el-upload-list__item.is-success .el-upload-list__item-name {
    font-size: 14px;
    color: #4990E2;
    text-decoration: underline;
  }
  #editDialogService .upload-box {
    display: flex;
    .el-form-item__content {
      display: flex;
      align-items: center;
      margin-left: 0px !important;
      line-height: 50px;
      .upload {
        margin-top: 5px;
      }
    }
    .el-button {
      position: relative;
      top: -7px;
      margin-right: 30px;
      padding: 0;
      width: 108px;
      height: 30px;
      border: 1px solid #979797;
      border-radius: 4px;
      background: #fff;
      color: #313131;
      &.is-disabled {
        position: relative;
        top: -9px;
        background: #eef1f6;
        border-color: #979797;
        color: #979797;
        opacity: .5;
        &:hover {
          opacity: .5;
        }
      }
      & > span {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28px;
        .upload-icon {
          display: block;
          margin-right: 4px;
          width: 18px;
          height: 18px;
          background: url("../../images/followUp/service/upload_icon.png") no-repeat;
        }
      }
      &:hover {
        border-color: #979797;
        color: #313131;
        opacity: 0.5;
      }
    }
    .el-upload {
      /*margin-right: 30px;*/
    }
    .upload {
      display: flex;
      align-items: flex-start;
      ul {
        display: flex;
        align-items: center;
        li {
          margin: 0;
        }
      }
    }
  }
  .el-picker-panel {
    z-index: 9999 !important;
  }
  #editDialogService input {
    &:focus {
      border: none !important;
    }
    &.is-undefined {
      background-color: transparent !important;
      padding: 0 !important;
    }
  }
  #selectLoad .el-input {
    width: 300px !important;
  }
  #editDialogService .el-textarea {
    width: 100% !important;
  }
</style>
