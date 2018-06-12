<template>
  <div id="top">
    <div class="left">
      <div class="go-back" @click="goBack">返回</div>
      <div class="title">
        <span class="name">No.{{orderInfo.title}}</span>
        <span class="icon" slot="reference" @mouseenter="enter" @mouseleave="leave">
          <div id="hoverInfo" v-show="hoverFlag">
            <slot name="content">
              <div class="el-popover__title">
                <span class="title">客户基本信息</span>
                <span class="edit"
                      v-if="$route.params.target == 'followUp'"
                      @click="editUser">编辑</span>
              </div>
              <div class="el-popover__content">
                <dl v-for="item in topUserInfo">
                  <dt>{{item.name}}</dt>
                  <dd>{{item.value}}</dd>
                </dl>
              </div>
            </slot>
          </div>
        </span>
      </div>
      <div class="desc">
        <span class="status" :class="orderInfo.statusType">{{orderInfo.orderStatus}}</span>
        <span class="text">跟进顾问：{{orderInfo.following}}</span>
        <span class="text">分配时间：{{orderInfo.createTime}}</span>
      </div>
    </div>
    <div class="right">
      <el-button class="primary" @click="goService">服务流程</el-button>
      <!--<el-button @click="toLose">申请丢单</el-button>-->
    </div>
    <loseWindow :orderId="orderId"></loseWindow>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {callbackView} from '../../service/getData.js'
  import Bus from '../../store/bus.js'
  import loseWindow from '../../components/window/loseWindow'
  export default{
    data(){
      return {
        hoverFlag  : false,
        orderInfo  : {},
        topUserInfo: [],
        orderId    : this.$route.params.id,
        vId        : this.$route.params.vId
      }
    },
    components: {
      loseWindow
    },
    created(){
      this.getOrderInfo();
      Bus.$off('refreshOrderInfo');
      Bus.$on('refreshOrderInfo', () => {
        this.getOrderInfo();
      });
      Bus.$off('hasToLosed');
      Bus.$on('hasToLosed', () => {
        this.$router.go(-1);
      });
    },
    methods   : {
      ...mapState(['userData']),
      enter() {
        this.hoverFlag = true;
      },
      leave() {
        this.hoverFlag = false;
      },
      goBack(){
        this.$router.go(-1);
      },
      getOrderInfo(){
        let params = {
          uid: this.userData().userInfo.id,
          id : this.$route.params.id,
          vid: this.$route.params.vId
        };
        callbackView(params).then(res => {
          var data = res.data.data;
          this.orderInfo = data.top;
          this.topUserInfo = data.userInfo;
          Bus.$emit('creatNodeList', data.nodeList);
          Bus.$emit('createActivity', {
            visitInfo: data.visitInfo,
            history  : data.history
          });
          Bus.$emit('createRelated', {
            sysInfo        : data.sysInfo,
            attachmentsList: data.attachmentsList,
            contractList   : data.contractList
          });
        });
      },
      //服务流程
      goService(){
        const pathArr = this.$route.path.split('/');
        this.$router.push(`/${pathArr[1]}/${pathArr[2]}/service/${this.orderId}/${this.vId}`);
      },
      //申请丢单
      toLose(){
        Bus.$emit('showLoseWindow');
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #top {
    display: flex;
    justify-content: space-between;
    padding: 21px 0 7px 24px;
    border-bottom: solid 2px #F2F7FA;
    .left {
      .go-back {
        display: inline-block;
        padding-left: 19px;
        background: url("../../images/back_btn.png") no-repeat;
        background-size: 14px 14px;
        background-position: left center;
        background-size: contain;
        font-size: 13px;
        color: #919191;
        cursor: pointer;
      }
      .title {
        display: flex;
        align-items: center;
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #313131;
        .icon {
          display: block;
          margin-left: 8px;
          width: 28px;
          height: 28px;
          background: url("../../images/followUp/contact_info.png") center center no-repeat;
          background-size: 25px;
          position: relative;
          padding-right: 15px;
        }
      }
      .desc {
        margin: 10px 0 3px;
        .text {
          margin-left: 20px;
          font-size: 13px;
          color: #6F6F6F;
        }
      }
    }
    .right {
      margin-top: 55px;
      margin-right: 35px;
      .el-button {
        margin-left: 20px;
        padding: 10px 20px;
        border-color: #979797;
        color: #313131;
        &:hover {
          border-color: #979797;
          color: #313131;
        }
        &.primary {
          border-color: #4990E2;
          color: #4990E2;
        }
      }
    }
  }
  #hoverInfo {
    position: absolute;
    top: -100%;
    left: 100%;
    width: 540px;
    border-radius: 8px;
    padding: 0;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    z-index: 2100;
    font-weight: normal;
    .el-popover__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 !important;
      padding: 20px 30px 20px 22px;
      border-bottom: solid 1px #eaeaea;
      .title {
        font-size: 16px;
        color: #343434;
        margin-top: 0px;
      }
      .edit {
        font-size: 14px;
        color: #4990E2;
        cursor: pointer;
      }
    }
    .el-popover__content {
      font-size: 14px;
      padding-top: 25px;
      dl {
        display: flex;
        align-items: center;
        padding-bottom: 22px;
        dt {
          width: 118px;
          text-align: right;
          padding-right: 40px;
          color: #919191;
        }
        dd {
          color: #3D3D3D;
        }
      }
    }
  }
</style>
