<template>
  <div class="step-item" :class="{'big-edit':itemData.boxnum}">
    <div class="title">
      <span class="step-fold-btn" :class="{'is-fold': foldStep}" @click="foldStep = !foldStep"></span>
      <h4>{{itemData.title}}</h4>
      <span class="status" :class="itemData.status">{{itemData.showStatus}}</span>
      <div class="edit-box">
        <span class="edit-btn"
              :class="{'disable': target!='followUp'}"
              v-if="itemData.boxnum"
              @click="editHandle(itemData)"></span>
      </div>
    </div>
    <collapse-transition>
      <div class="content"
           v-show="!foldStep && listData.length>0">
        <dl v-for="item in listData">
          <dt>{{item.name}}</dt>
          <dd v-if="itemData.boxnum">
            <span v-if="item.type!=4">{{item.value}}</span>
            <span v-if="item.type==4">
              <a class="down-link" v-for="i in item.value" :href="i.url" :download="i.url">
                <i class="el-icon-document"></i>{{i.name}}
              </a>
            </span>
          </dd>
          <dd v-if="!itemData.boxnum" class="alone">
            <!--text-->
            <p v-if="item.type==1" class="edit-box">
              <i class="edit-icon disable"></i>
              <span>{{item.value}}</span>
            </p>
            <!--开关-->
            <p v-if="item.type==2 && switchDefault(item)" class="switch-box">
              <span class="el-switch__core disable"
                    :class="{'on':item.value}">
                <span class="el-switch__button">
                </span>
              </span>
            </p>
            <!--上传-->
            <p v-if="item.type==3" class="upload-box disable">
              <!--不可用-->
              <el-button type="primary"
                         :disabled="true">
                <i class="upload-icon"></i>
                <span>上传文件</span>
              </el-button>
              <span v-if="item.value.length>0">
                <a class="down-link" v-for="i in item.value" :href="i.url" :download="i.url">
                  <i class="el-icon-document"></i>{{i.name}}
                </a>
              </span>
            </p>
          </dd>
        </dl>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import Bus from '../../../store/bus.js'
  import {serviceSwitchSubmit, serviceUploadRemove} from '../../../service/getData.js'
  export default{
    data(){
      return {
        target  : this.$route.params.target,
        foldStep: false
      }
    },
    props     : [
      'itemData',
      'currentNode'
    ],
    computed  : {
      ...mapState(['userData']),
      listData(){
        //为每一个上传的文件附带上taskId,以供删除时传值
        this.itemData.listData.forEach(item => {
          if (Object.prototype.toString.call(item.value) == '[object Array]') {
            item.value.forEach(i => {
              i.taskIds = item.id;
            })
          } else {
            item.taskIds = item.id;
          }
        });
        return this.itemData.listData;
      }
    },
    components: {
      CollapseTransition
    },
    created(){
    },
    methods   : {
      /*大编辑*/
      editHandle(item){
        if (this.target != 'followUp') return;
        console.log('大编辑');
        console.log(item)
        Bus.$emit('editStep', item);
      },
      /*小编辑*/
      editAloneHandle(item){
        if (this.target != 'followUp') return;
        console.log('小编辑');
        console.log(item)
        Bus.$emit('editStep', item);
      },
      /*初始化swich开关的value*/
      switchDefault(item){
        if (typeof item.value == 'undefined' || item.value == '') {
          item.value = false;
        }
        return true;
      },
      /*触发开关*/
      switchChangeHandle(item){
        if (item.value || this.target != 'followUp') return;
        item.value = true;
        console.log('触发开关:' + item.key);
        this.submitHandle(item, 2);
      },
      /*弹层和开关提交事件*/
      submitHandle(item, type){
        let params = {
          'uid'   : this.userData.userInfo.id,
          'id'    : this.$route.params.id,
          'taskId': item.id,
          'type'  : type //type: 1-弹框; 2-开关; 3-上传
        };
        if (type == 1) {
          params.boxnum = item.boxnum;
        }
        serviceSwitchSubmit(params).then(res => {
          Bus.$emit('menuTotal');
          Bus.$emit('stepSubmit');
        })
      },
      /*删除上传的文件*/
      uplRemoveHandle(file, fileList){
        let params = {
          'uid'         : this.userData.userInfo.id,
          'id'          : this.$route.params.id,
          'taskId'      : file.taskIds,
          'attachmentId': file.id
        };
        serviceUploadRemove(params).then(res => {
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
      /*上传成功*/
      uplSuccessHandle(res, file, fileList){
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
      },
      /*点击文件下载*/
      uplPreviewHandle(file){
        let oA = document.createElement('a');
        oA.href = file.url;
        oA.download = file.url;
        oA.click();
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #service {
    .el-switch__core {
      border-color: #f1f6f9;
      background: #f1f6f9;
      &.on {
        border-color: #50ad31;
        background-color: #50ad31;
        .el-switch__button {
          transform: translate(28px, 2px);
        }
      }
      .el-switch__button {
        top: -4px;
        left: -4px;
        width: 24px;
        height: 24px;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
        transform: translate(2px, 2px);
      }
    }
    .el-switch--wide .el-switch__label.el-switch__label--left span {
      left: 8px;
    }
    .el-switch--wide .el-switch__label.el-switch__label--right span {
      right: 6px;
    }
    .upload {
      &.disabled {
        .el-upload {
          display: none;
        }
      }
    }
    .el-upload-list__item.is-success .el-upload-list__item-name {
      font-size: 14px;
      color: #4990E2;
      text-decoration: underline;
    }
    .el-icon-circle-check:before {
      content: "";
      display: block;
      margin-top: 6px;
      width: 12px;
      height: 12px;
      background: url("../../../images/followUp/service/del_btn.png") no-repeat;
    }
    .step-item.big-edit .content dl dt {
      width: auto;
    }
    .step-item {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 0;
        .step-fold-btn {
          transition: All 0.4s ease-in-out;
          flex-shrink: 0;
          display: block;
          width: 20px;
          height: 20px;
          background: url("../../../images/fold_btn.png") no-repeat;
          background-size: contain;
          cursor: pointer;
          &.is-fold {
            transform: rotate(180deg);
          }
        }
        h4 {
          flex-shrink: 0;
          margin-left: 10px;
          font-size: 16px;
          color: #313131;
        }
        .status {
          flex-shrink: 0;
          margin-left: 10px;
          padding: 4px 14px;
          border-radius: 4px;
          font-size: 12px;
          &.yes {
            background: #f2f9ee;
            color: #48B111;
          }
          &.no {
            background: #fcf2f3;
            color: #D0011B;
          }
        }
        .edit-box {
          flex-grow: 1;
          margin-right: 24px;
          height: 30px;
          text-align: right;
          .edit-btn {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url("../../../images/edit_btn.png") no-repeat;
            background-size: contain;
            cursor: pointer;
            &.disable {
              background: url("../../../images/edit_btn_no.png") no-repeat;
              background-size: contain;
              cursor: not-allowed;
            }
          }
        }
      }
      .content {
        margin-left: 30px;
        padding-bottom: 15px;
        display: block;
        dl {
          display: flex;
          width: 100%;
          margin: 0 70px 8px 0;
          line-height: 28px;
          dt {
            width: 250px;
            flex-shrink: 0;
            margin-right: 30px;
            font-size: 14px;
            color: #919191;
          }
          dd {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #313131;
            .down-link {
              font-size: 14px;
              color: #4990E2;
              text-decoration: underline;
              .el-icon-document {
                color: #97a8be;
                margin-right: 7px;
                height: 100%;
                line-height: inherit;
              }
            }
            &.alone {
              .edit-box {
                display: flex;
                align-items: flex-start;
                .edit-icon {
                  flex-shrink: 0;
                  display: block;
                  margin-top: 4px;
                  margin-right: 30px;
                  width: 20px;
                  height: 20px;
                  background: url("../../../images/followUp/service/edit_btn.png") no-repeat;
                  background-size: contain;
                  cursor: pointer;
                  &.disable {
                    opacity: .5;
                    cursor: not-allowed;
                  }
                }
              }
              .switch-box {
                .el-switch__core {
                  &.disable {
                    border-color: #e4e8f1 !important;
                    background: #e4e8f1 !important;
                    cursor: not-allowed;
                  }
                }
              }
              .upload-box {
                display: flex;
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
                      background: url("../../../images/followUp/service/upload_icon.png") no-repeat;
                    }
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
            }
          }
        }
      }
    }
  }
</style>
