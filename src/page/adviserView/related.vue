<template>
  <div id="related">
    <div class="tab-title">
      <span class="item">相关</span>
    </div>
    <div class="content">
      <ul>
        <li>
          <p class="title icon_0">系统信息</p>
          <div class="no-list" v-if="!sysInfo.length">
            暂无信息...
          </div>
          <div class="list" v-if="sysInfo.length" v-for="item in sysInfo">
            <p class="name">{{item.name}}</p>
            <p class="time">{{item.desc}}</p>
            <p class="desc">{{item.description}}</p>
          </div>
        </li>
        <li>
          <p class="title icon_1">婚礼方案附件</p>
          <div class="no-list" v-if="!attachmentsList.length">
            暂无信息...
          </div>
          <div class="list" v-if="attachmentsList.length" v-for="item in attachmentsList">
            <a class="name link" :href="item.value" :download="item.value">
              <i class="el-icon-document"></i>{{item.name}}
            </a>
            <p class="time">{{item.time}}</p>
          </div>
        </li>
        <li>
          <p class="title icon_2">合同</p>
          <div class="no-list" v-if="!contractList.length">
            暂无信息...
          </div>
          <div class="list" v-if="contractList.length" v-for="item in contractList">
            <a class="name link" :href="item.value" target="_blank">
              <i class="el-icon-document"></i>{{item.name}}
            </a>
            <p class="time">{{item.time}}</p>
          </div>
        </li>
        <li>
          <p class="title icon_4">
            合同付款
            <span class="payBtn" @click="newPayMent" v-if="contractList.length">新建</span>
          </p>
          <div class="no-list" v-if="!sysInfo.length">
            暂无信息...
          </div>
          <div class="list" v-if="sysInfo.length" v-for="item in sysInfo">
            <p class="name">{{item.name}}</p>
            <p class="time">{{item.desc}}</p>
            <p class="desc">{{item.description}}<span class="status status-n" :class="{ 'status-y':item.description}">已确认</span></p>
          </div>
          <div class="all">
            <span class="fl">应付 1600</span>
            <span class="fr">实付 16000</span>
          </div>
        </li>
      </ul>
    </div>
    <payment></payment>
  </div>
</template>

<script>
  import Bus from '../../store/bus.js'
  import payment from './payment.vue'
  export default{
    data(){
      return {
        sysInfo        : [],  //系统信息
        attachmentsList: [],  //婚礼方案附件
        contractList   : [],   //合同
        contractPaymentList: []  //合同付款
      }
    },
    components: {payment},
    created(){
      Bus.$off('createRelated');
      Bus.$on('createRelated', data => {
        console.log(data)
        this.sysInfo = data.sysInfo ? data.sysInfo : [];
        this.attachmentsList = data.attachmentsList ? data.attachmentsList : [];
        this.contractList = data.contractList ? data.contractList : [];
        this.contractPaymentList = data.contractPaymentList ? data.contractPaymentList : [];
      })
    },
    methods : {
      newPayMent() {
        Bus.$emit('openPayMent');
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #related {
    .content {
      padding: 20px 24px 0;
      line-height: 1.2;
      ul {
        width: 100%;
        margin-bottom: 39px;
        li {
          padding: 18px 22px;
          margin-bottom: 10px;
          background: #F9FBFF;
          border: 1px solid #CCDBEC;
          border-radius: 8px;
          &:last-child {
            margin-bottom: 0;
          }
          .title {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #565656;
            cursor: pointer;
            &:before {
              content: "";
              display: block;
              margin-right: 17px;
              width: 24px;
              height: 24px;
              border-radius: 2px;
            }
            &.icon_0 {
              &:before {
                background: url("../../images/followUp/related/icon_0.png") no-repeat;
                background-size: cover;
              }
            }
            &.icon_1 {
              &:before {
                background: url("../../images/followUp/related/icon_1.png") no-repeat;
                background-size: cover;
              }
            }
            &.icon_2 {
              &:before {
                background: url("../../images/followUp/related/icon_2.png") no-repeat;
                background-size: cover;
              }
            }
            &.icon_4 {
              position: relative;
              &:before {
                background: url("../../images/followUp/related/icon_4.png") no-repeat;
                background-size: cover;
              }
              .payBtn {
                position: absolute;
                background: #FFFFFF;
                border: 1px solid #4A90E2;
                border-radius: 4px;
                padding: 5px 18px;
                color: #4A90E2;
                top: -2px;
                right: 0px;
                cursor: pointer;
              }
            }
          }
          .no-list {
            margin-top: 10px;
            font-size: 13px;
            color: #919191;
          }
          .list {
            margin-top: 20px;
            font-size: 14px;
            &:last-child {
              margin-bottom: 15px;
            }
            .name {
              display: inline-block;
              margin-bottom: 5px;
              color: #4A90E2;
              &.link {
                text-decoration: underline;
                cursor: pointer;
              }
              i.el-icon-document {
                margin-right: 8px;
              }
            }
            .time {
              margin-bottom: 5px;
              color: #919191;
            }
            .desc {
              line-height: 1.5;
              color: #262626;
              .status {
                padding: 2px 9px;
                border-radius: 4px;
                font-size: 12px;
                letter-spacing: 0;
                margin-left: 10px;
              }
              .status-n {
                background: rgba(173,211,255,.4);
                color: #315988;
              }
              .status-y {
                background: rgba(35,163,30,.4);
                color: #1A7128;
              }
            }
          }
          .all {
            border-top: 1px solid #D9D9D9;
            font-size: 14px;
            color: #313131;
            letter-spacing: 0;
            padding-top: 20px;
            font-weight: 600;
            margin-top: 20px;
            .fr {
              float: right;
            }
          }
        }
      }
    }
  }
</style>
