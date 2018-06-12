<template>
  <div id="activity">
    <div class="tab-title">
      <span class="item">活动</span>
    </div>
    <div class="content">
      <!--过去记录列表-->
      <div class="history-box">
        <p class="title">
          <span>过去记录</span>
        </p>
        <div class="no-list" v-if="!history.length">
          暂无记录...
        </div>
        <div class="list" v-if="history.length" :class="{'is-callback':visitInfo&&visitInfo.name}">
          <dl v-for="item in history">
            <dt>
              <i class="icon"></i>
            </dt>
            <dd>
              <p class="name">{{item.name}}</p>
              <p class="time">{{item.time}}</p>
              <p class="desc">{{item.description}}</p>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {callbackSubmit} from '../../service/getData.js'
  import Bus from '../../store/bus.js'
  export default{
    data(){
      return {
        visitInfo: [],
        history  : []
      }
    },
    created(){
      /*创建活动历史*/
      Bus.$off('createActivity');
      Bus.$on('createActivity', data => {
        this.visitInfo = data.visitInfo && data.visitInfo[0]; //活动-回访记录---visitInfo待回访详情页才有该数据
        console.log(data)
        this.history = data.history;        //过去记录
      });
    },
    methods: {
      ...mapState(['userData']),
      /*提交信息*/
      toSave(flagStatus){
        if (!this.visitInfo.value) {
          this.$message({
            message    : '回访内容不能为空!',
            showClose  : true,
            customClass: "err",
            iconClass  : 'icon-wrong'
          });
          return;
        }
        let params = {
          uid       : this.userData().userInfo.id,
          id        : this.$route.params.id,      //订单ID
          vid       : this.$route.params.vId,    //回访信息记录ID
          record    : this.visitInfo.value,   //回访信息
          flagStatus: flagStatus          //4-暂存；2-提交；3-回捞
        };
        callbackSubmit(params).then(res => {
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
          } else {
            Bus.$emit('menuTotal');
            let message = flagStatus == 4 ? '暂存成功！' : '提交成功！';
            this.$message({
              message    : message,
              showClose  : true,
              customClass: "succ",
              iconClass  : 'icon-success'
            });
            this.$router.push('/check/callback');
          }
        });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #activity {
    border-right: solid 2px #F2F7FA;
    .content {
      display: block;
      padding: 20px 30px 20px;
    }
    .form-box {
      margin-bottom: 25px;
      .title {
        margin-bottom: 20px;
        font-size: 14px;
        color: #313131;
      }
      .text-box {
        display: flex;
        flex-direction: column;
        padding: 18px 20px 0 18px;
        height: 140px;
        border: 1px solid #4990E2;
        border-radius: 4px;
        .el-textarea {
          flex-grow: 1;
          width: 100%;
          .el-textarea__inner {
            overflow-y: auto !important;
            padding: 0 !important;
            width: 100%;
            background: #fff !important;
            border: none 0 !important;
          }
        }
        .button-box {
          flex-grow: 0;
          display: flex;
          justify-content: flex-end;
          .el-button {
            margin: 10px 0;
            padding: 0;
            width: 80px;
            height: 30px;
            line-height: 30px;
            margin-right: 20px;
            &:last-child {
              margin-right: 0;
            }
            &.el-button--default {
              border-color: #acacac;
            }
            &.el-button--primary {
              background: #5194dc;
            }
          }
        }
      }
    }
    .history-box {
      width: 100%;
      line-height: 1.2;
      font-size: 14px;
      .title {
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        color: #2A2A2A;
        span {
          flex-shrink: 0;
          padding-right: 10px;
        }
        &:after {
          content: "";
          display: block;
          width: 100%;
          height: 0px;
          border-bottom: dashed 1px #d5d5d5;
        }
      }
      .no-list {
        margin-bottom: 20px;
        color: #c8c8c8;
      }
      .list {
        /*max-height: 489px;
        overflow-y: auto;
        &.is-callback{
          max-height: 264px;
        }*/
        dl {
          display: flex;
          &:first-child {
            dt {
              .icon {
                background: #6F6F6F;
              }
              &:before {
                opacity: 0;
              }
            }
          }
          &:last-child {
            dt {
              &:after {
                opacity: 0;
              }
            }
          }
          dt {
            display: flex;
            align-items: center;
            flex-direction: column;
            padding-left: 9px;
            padding-right: 24px;
            .icon {
              flex-shrink: 0;
              display: block;
              width: 9px;
              height: 9px;
              background: #DFDFDF;
              border-radius: 50%;
            }
            &:before {
              content: "";
              display: block;
              width: 0;
              height: 8px;
              border-right: solid 1px #DFDFDF;
            }
            &:after {
              content: "";
              flex-grow: 1;
              display: block;
              width: 0;
              height: 100%;
              border-right: solid 1px #DFDFDF;
            }
          }
          dd {
            padding-bottom: 50px;
            .name {
              font-weight: bold;
              color: #313131;
            }
            .time {
              margin: 5px 0;
              font-size: 12px;
              color: #C8C8C8;
            }
            .desc {
              color: #3D3D3D;
            }
          }
        }
      }
    }
  }
</style>
