<template>
  <div id="sTop">
    <div class="left">
      <div class="go-back" @click="goBack">返回</div>
      <div class="title">
        No.{{orderInfo.title}}
      </div>
      <div class="desc">
        <span class="status" :class="orderInfo.statusType">{{orderInfo.orderStatus}}</span>
        <span class="text">跟进顾问：{{orderInfo.following}}</span>
        <span class="text">分配时间：{{orderInfo.createTime}}</span>
      </div>
    </div>
    <div class="right">
      <!--<el-button @click="toLose">申请丢单</el-button>-->
    </div>
    <loseWindow :orderId="orderId"></loseWindow>
  </div>
</template>

<script>
  import {serviceInfo} from '../../service/getData.js'
  import Bus from '../../store/bus.js'
  import loseWindow from '../../components/window/loseWindow'
  export default{
    data(){
      return {
        orderInfo: {},
        orderId  : this.$route.params.id,
        vId      : this.$route.params.vId
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
        this.$router.go(-2);
      });
    },
    methods   : {
      goBack(){
        this.$router.go(-1);
      },
      getOrderInfo(){
        serviceInfo({id: this.$route.params.id}).then(res => {
          var data = res.data.data;
          this.orderInfo = data.top;
          Bus.$emit('creatNodeList', data.nodeList);
        })
      },
      //申请丢单
      toLose(){
        Bus.$emit('showLoseWindow');
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #sTop {
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
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #313131;
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
</style>
