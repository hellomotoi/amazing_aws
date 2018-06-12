<!--新建线索-->
<template>
  <el-dialog lock-scroll :show-close='false'
             :class="{ 'min-screen':screenSize ,'big-screen':!screenSize}"
             title="新建线索" :closeOnClickModal='false'
             v-model="collectWindowVisible"
             id='collectWindow'>
    <p class="ths-title">客户信息</p>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
      <el-form-item label="线索来源" prop="sources" id="clueSources">
        <el-cascader v-model="ruleForm.sources"
                     @change='sourcesChange'
                     filterable
                     :options="optionsSources"
                     :show-all-levels="false"
                     :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="客户姓名" prop="name">
        <el-input v-model="ruleForm.name" :maxlength='8' placeholder='请输入最多8个字符'></el-input>
      </el-form-item>
      <el-form-item label="客户身份" prop="card" id='card'>
        <el-select v-model="ruleForm.card" placeholder="请选择">
          <el-option :disabled="item.disabled"
                     v-for="(item,index) in cards"
                     :label="item.value"
                     :value="parseInt(index)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" :maxlength='11'
                  placeholder="请输入11位数字"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户微信" prop="weixin" id='wx'>
        <el-input v-model="ruleForm.weixin" :maxlength='11'
                  placeholder="请输入客人微信号"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" style="width:100%;" :maxlength='400'
                  placeholder="对哪类商家有格外偏好：宴会场地、婚纱礼服、主持、化妆、摄影、摄像、场地布置。是否有自己很喜欢的案例或风格。（400字以内）"
                  :autosize="{ minRows: 4, maxRows: 6}"
                  v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button style="float: left;" @click="collectWindowVisible = false">取 消</el-button>
      <el-button style="float: right;" type="primary"
                 @click="subForm('ruleForm');" :loading="subLoad">提 交
      </el-button>
      <el-button style="float: right;"
                 @click="tempForm('ruleForm');" :loading="tempLoad">暂 存
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import Bus from '../../store/bus.js'
  import {toClueWin, chkphone, temporaryClue, singleSubmit} from '../../service/getData.js'
  export default {
    data() {
      return {
        loading             : true,
        collectWindowVisible: false,
        tempLoad            : false,
        subLoad             : false,
        currentTaskId       : '',
        cards               : {}, /*存储客户角色*/
        optionsSources      : [], /*存储线索来源的所有*/
        filterSources       : [], /*存储格式化后全部的线索来源*/
        props               : {value: 'label'},
        ruleForm            : {
          name   : '',
          phone  : '',
          weixin : '',
          sources: [],
          card   : '',
          remark : '',
        },
        rules               : {
          sources: [
            {type: 'array', required: true, message: '请选择', trigger: 'change'}
          ],
          card   : [
            {required: true, message: '请选择',}
          ],
          name   : [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          phone  : [
            {required: true, validator: this.validatePhone, trigger: 'blur'}
          ],
        }
      }
    },
    computed: {
      ...mapState(['userData']),
      screenSize(){
        if (window.screen.height > 720)
        /*大屏*/
          return 0
        else
          return 1
      }
    },
    created(){
      Bus.$off('openNewEdit');
      Bus.$on('openNewEdit', id => {
        this.renderNewForm(id);
      });
    },
    methods : {
      ...mapState(['userData']),
      renderNewForm(id) {
        this.currentTaskId = id ? id : '';
        // 清空数据
        this.ruleForm = {
          name   : '',
          phone  : '',
          weixin : '',
          sources: [],
          card   : '',
          remark : '',
        };
        /*this.resetForm('ruleForm')*/
        toClueWin({uid: this.userData.userInfo.id, id: this.currentTaskId}).then(res => {
          var res = res.data;
          // 身份
          for (var key in res.data.cardData) {
            this.cards[parseInt(key)] = {value: res.data.cardData[key]}
          }
          // 线索来源
          this.optionsSources = res.data.sourceData;
          this.optionsSources.forEach(item => {
            if (!item.children) {
              this.filterSources.push({text: item.label, value: item.label})
            } else {
              item.children.forEach(inside => {
                this.filterSources.push({text: inside.label, value: inside.label})
              })
            }
          })
          let flag = res.data.user.every(key => {
            return key.value == '';
          })
          if (!flag) {
            res.data.user.forEach(item => {
              this.ruleForm[item.key] = item.value;
              if(item.key == 'sources'){
                this.ruleForm.sources = item.value.split(',')
              }
            })
          }
          console.log('optionsSources', this.optionsSources)
          console.log('filterSources', this.filterSources)
          console.log('cards', this.cards)
          console.log('ruleForm', this.ruleForm)
          this.collectWindowVisible = true;
        })
      },
      sourcesChange(val){ // 弹窗 --- 线下活动&直接进店 => 身份选项禁止"未确定"
        if (val[0] == '直接进店' || val[0] == '线下活动') {
          this.cards[4].disabled = true;
        } else {
          this.cards[4].disabled = false;
        }
      },
      validatePhone(rule, value, callback) { // 校验手机号码
        let telReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(value);
        if (value === '') {
          callback(new Error('请输入'));
        } else if (!telReg) {
          callback(new Error('格式不正确'));
        } else {
          chkphone({phone: value}).then(res => {
              var res = res.data;
              if (res.code != 200)
                callback(new Error(res.message));
              else
                callback();
            }
          )
        }
      },
      formdataQuery(formName, status){ // 处理线索来源(推荐 => ...)
        var sendData = {
          ...this[formName],
          uid   : this.userData.userInfo.id,
          status: status // 1: 暂存  2: 提交
        }
        if (sendData.sources.length == 1) {
          sendData.sources = sendData.sources[0]
        } else if (sendData.sources.length == 2) {
          sendData.sources = sendData.sources.join(',');
        } else {
          sendData.sources = "";
        }
        return sendData;
      },
      tempForm(formName) { // 暂存
        this.tempLoad = true;
        var sendData = this.formdataQuery(formName, 1);
        temporaryClue(sendData).then(res => {
          Bus.$emit('menuTotal');
          var res = res.data;
          this.$message({
            message    : '恭喜您，暂存成功',
            showClose  : true,
            customClass: "succ",
            iconClass  : 'icon-success',
            type       : 'success'
          });
          this.collectWindowVisible = false;
          this.tempLoad = false;
          Bus.$emit('renderSubmit')
          // Bus.$emit('')
        })
      },
      subForm(formName) { // 提交
        this.subLoad = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var sendData = this.formdataQuery(formName, 2);
            singleSubmit(sendData).then(res => {
              var res = res.data;
              console.log(res.code);
              if (res.code != 200) {
                this.subLoad = false;
                return;
              };
              Bus.$emit('menuTotal');
              this.$message({
                message    : '恭喜您，提交成功',
                showClose  : true,
                customClass: "succ",
                iconClass  : 'icon-success',
                type       : 'success'
              });
              this.collectWindowVisible = false;
              this.subLoad = false;
              Bus.$emit('renderSubmit')
            })
          } else {
            this.subLoad = false;
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #collectWindow.min-screen .el-dialog {
    height: auto;
  }
  #collectWindow.big-screen .el-dialog {
    height: 680px;
  }
  #collectWindow {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
    overflow: hidden;
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
      height: 50px;
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
    .el-select input {
      border: none !important;;
      background: transparent !important;
      padding: 0 !important;
      color: #313131 !important;
    }
    .el-select {
      float: left;
      .el-input {
        width: 78px;
      }
    }
    .el-input__icon {
      left: 44px;
    }
    .el-input {
      width: 300px;
    }
    #card {
      .el-input {
        width: 150px;
        padding: 0 25px 0 10px;
        .el-input__icon {
          left: 150px;
          top: 12px;
        }
      }
    }
    #clueSources {
      .el-input {
        width: 150px;
        padding: 0 25px 0 10px;
        .el-input__icon {
          left: 150px;
          top: 12px;
        }
        .el-input__inner {
          padding: 0px !important;
        }
      }
    }
    .el-cascader {
      float: left;
      .el-input {
        width: 122px;
        .el-input__icon {
          left: 85px;
          top: 12px;
        }
        input {
          border: none !important;
          background-color: transparent !important;
        }
      }
    }
  }
  /* again */
  #submitpage {
    position: relative;
  }
  #submitpage {
    padding: 28px 24px 0;
    .el-pagination {
      margin: 21px 0;
    }
    header {
      margin-bottom: 21px;
      p {
        font-size: 18px;
        color: #313131;
        font-weight: 600;
        float: left;
      }
      button:hover {
        opacity: .6;
      }
      button {
        float: right;
        background: #4A90E2;
        border-radius: 4px;
        width: 120px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        span {
          font-size: 14px;
          color: #FFFFFF;
        }
      }
      // .el-table__body-wrapper{
      //   overflow: initial;
      // }
    }
  }
  #collectWindow.min-screen .el-dialog {
    height: auto;
  }
  #collectWindow.big-screen .el-dialog {
    height: 680px;
  }
  #collectWindow {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
    overflow: hidden;
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
      height: 50px;
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
  }
  #collectWindow {
    .ths-title {
      padding-left: 18px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #313131;
    }
    .el-select input {
      border: none !important;;
      background: transparent !important;
      padding: 0 !important;
      color: #313131 !important;
    }
    .el-select {
      float: left;
      .el-input {
        width: 78px;
      }
    }
    .el-input__icon {
      left: 44px;
    }
    .el-input {
      width: 300px;
    }
    #card .el-input__icon {
      left: 51px;
      top: 13px;
    }
    .el-cascader {
      float: left;
      .el-input {
        width: 122px;
        .el-input__icon {
          left: 85px;
          top: 12px;
        }
        input {
          border: none !important;
          background-color: transparent !important;
        }
      }
    }
  }
  #main_table {
    border: none;
    .el-checkbox__inner {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    .el-checkbox__inner::after {
      height: 9px;
      left: 6px;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #4A90E2;
    }
    .name-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-image: linear-gradient(-180deg, #A5AAB6 0%, #858A92 100%);
      line-height: 36px;
      font-size: 18px;
      color: #FFFFFF;
      display: inline-block;
    }
    .name-show {
      line-height: 38px;
      max-width: 77px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      margin-left: 10px;
      display: inline-block;
      vertical-align: bottom;
    }
    .el-table__body tr:hover .visibility {
      visibility: visible;
    }

    .el-checkbox__input.is-disabled > span {
      font-family: 'icomoon' !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .el-checkbox__input.is-disabled > span:before {
      content: "\e902";
      color: #EB253D;
      font-size: 21px;
      position: absolute;
      left: -2px;
      top: -2px;
    }
    .el-table-column--selection .is-disabled {
      cursor: default;
      .el-checkbox__inner {
        cursor: default;
      }
    }
    .operate img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .visibility {
    visibility: hidden;
  }
  .table-header button.is-disabled span {
    color: #919191 !important;
  }
  .el-table {
    border: none;
    border-top: 2px solid #F2F7FA;
    tbody tr {
      height: 64px;
      td {
        border-top: 2px solid #fff;
        border-bottom: 2px solid #F2F7FA;
      }
      &:hover td {
        border-color: #e9f1fc;
        background-color: #e9f1fc;
      }
      &.current-row {
        td {
          border-color: #4990E2;
          background-color: #E9F1FC;
          &:nth-of-type(1) {
            border-left: 2px solid #4990E2;
          }
          &:nth-last-child(1) {
            border-right: 2px solid #4990E2;
          }
        }
      }
    }
    th {
      line-height: 48px;
      background-color: #fff;
      border-bottom: 2px solid #F2F7FA;
      > .cell {
        background-color: #fff;
        font-size: 13px;
        color: #919191;
        letter-spacing: 0;
        font-weight: 500;
      }
      + th {
        border-left: 2px solid #F2F7FA;
      }
      td {
        line-height: 64px;
        border-top: 2px solid #FFF;
        border-bottom: 2px solid #F2F7FA;
        > .cell {
          padding: 6px 0;
        }
      }
    }
    .taskStatus {
      position: relative;
      &:before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        left: 25%;
        top: 7px;
        border-radius: 50%;
      }
    }
    .el-popover {
      width: 340px !important;
      .el-popover__title {
      }
      .el-popover__content {
        font-size: 13px;
      }
    }
  }
</style>
