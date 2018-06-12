<template>
  <el-dialog id="editDialogService" top="10%"
             :title="dialogTitle"
             v-model="dialogVisible"
             :show-close='false'
             :close-on-click-modal="false">
    <el-form ref="formInfo.valueList" :model="formInfo.valueList" label-width="120px" label-position="left">
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
              :rows="2"
              placeholder="请输入内容"
              v-model="formInfo.valueList[item.key]">
            </el-input>
          </el-form-item>
          <!-- 特殊文本域组 type = 11 -->

          <!-- 只读  type = 6 -->

          <!-- 文件上传  type = 7 -->
          <el-form-item :label="item.name" :prop='item.key' v-if="item.type == 7" class="upload-box">
            <el-upload
              class="upload"
              action="/upload/submit"
              :data="{
                      'uid': currentUserId,
                      'id': currentID,
                      'taskId': currentTaskID
                    }"
              :multiple="false"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :file-list="item.value">
              <el-button size="small" type="primary" :disabled="upload_btn">
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
        dialogTitle  : '',
        dialogVisible: false,
        subloading   : false,
        upload_btn   : true,
        boxnum       : '',
        currentUserId: '',
        currentID    : '',
        currentTaskID: '',
        formInfo     : {
          valueList: {
            'banquet_designer': [],
            'flower_designer' : [],
            'executive'       : [],
            'is_recommend'    : '',
            'dateranges'      : ''
          },
          typeList : []
        },
        city_options : [{value: -1, label: '未确定'}],
        optionList   : {
          'banquet_designer': [],
          'flower_designer' : [],
          'executive'       : []
        }
      }
    },
    created(){
      if (!this.userInfo()) {
        return;
      }
      this.currentUserId = this.userInfo().userInfo.id;
      this.getClueCitys({parentId: 1}); // 获取城市级联
      Bus.$off('editStep');
      Bus.$on('editStep', data => {
        console.log('订单步骤信息', data);
        this.currentID = this.$route.params.id; //订单id
        this.boxnum = data.boxnum;
        this.currentTaskID = data.taskIds || data.taskId; //订单taskId
        this.renderFormList();
      });
    },
    methods: {
      ...mapState(['userInfo']),
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
        if (val[0] != -1)
          this.getClueCitys({parentId: val[0]});
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
          'taskId': this.currentTaskID
        })
          .then(res => {
            console.log('打开子节点弹窗数据', res);
            this.dialogTitle = res.data.data.title;
            let resData = res.data.data;
            this.formInfo.typeList = resData.childData;
            if (!resData.childData) {
              return;
            }
            /*处理特殊数据*/
            resData.childData.forEach(item => {
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
                    // 获取市级列表
                    if (this.formInfo.valueList.location != -1)
                      this.getClueCitys({parentId: this.formInfo.valueList.location[1]});
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
                default:
                  this.formInfo.valueList[item.key] = item.value.toString();
                  break;
              }
            })
            console.log('表单值list', this.formInfo.valueList);
            this.dialogVisible = true;
          })
      },
      handlePreview(file) { // 下载附件
        let oA = document.createElement('a');
        oA.href = file.url;
        oA.download = file.url;
        oA.click();
      },
      handleRemove(file, fileList) { // 删除附件
        console.log(file);
        let params = {
          'uid'         : this.currentUserId,
          'id'          : this.currentID,
          'taskId'      : this.currentTaskID,
          'attachmentId': file.id
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
          Bus.$emit('menuTotal');
          Bus.$emit('stepSubmit');
        })
      },
      handleSuccess() { // 成功之后的回调
        console.log('成功之后的回调');
        this.upload_btn = true;
      },
      formData_query(data) {
        let forms = data;
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
        // 时期范围
        if (data.dateranges) {
          let beginTime = data.dateranges[0];
          let endTime = data.dateranges[1];
          if (beginTime && endTime) {
            beginTime = beginTime.getFullYear() + '-' + (beginTime.getMonth() + 1) + '-' + beginTime.getDate();
            endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
          }
          forms.in_date = beginTime;
          forms.out_date = endTime;
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
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
    min-height: 500px;
    padding: 25px 60px;
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
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
      margin-left: 0px !important;
    }
    .el-button {
      margin-right: 30px;
      padding: 0;
      width: 108px;
      height: 30px;
      border: 1px solid #979797;
      border-radius: 4px;
      background: #fff;
      color: #313131;
      &.is-disabled {
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
      margin-right: 30px;
    }
    .upload {
      display: flex;
      align-items: center;
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
</style>
