<template>
  <div class="message-layout">
    <div class="box">
      <!--联系人-->
      <ul class="contact">
        <li :class="{'active': item.id == currentOrderId}" v-for="item in listData" @click="getMsgWinHandle(item.id)">
          <span class="first">{{item.title.substring(3, 4)}}</span>
          <div class="content">
            <p class="name">{{item.title}}</p>
            <p class="talk">{{item.value}}</p>
          </div>
        </li>
      </ul>
      <!--对话框-->
      <div class="dialog">
        <div class="title">
          <div class="name">{{dialog.title}}</div>
          <div class="button-box">
            <i class="min" @click="hide"></i>
          </div>
        </div>
        <ul class="history">
          <li :class="{
              'me': item.roleId == 1,
              'he': item.roleId == 2
            }" v-for="item in dialog.history">
            <div class="time">
              {{item.time}}
            </div>
            <div class="content">
              <span class="first">{{item.roleId == 2 ? dialog.title.substring(3, 4) : ''}}</span>
              <p class="talk">{{item.value}}</p>
            </div>
          </li>
          <li class="scrollBottom"></li>
        </ul>
        <div class="input">
          <textarea @keyup="toSubmit"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import move from 'move-js'
  import Bus from '../../store/bus.js'
  import {mapState} from 'vuex'
  import {getMsgWin, submitMsg} from '../../service/getData.js'
  export default{
    data(){
      return {
        currentOrderId: localStorage.getItem('messageId') ? localStorage.getItem('messageId') : '',
        listData      : [], //左侧用户列表
        dialog        : {}    //右侧聊天信息
      }
    },
    props     : [],
    computed  : {
      ...mapState(['userId'])
    },
    components: {},
    created(){
    },
    mounted(){
      Bus.$off('showMessageBox');
      Bus.$on('showMessageBox', (orderId) => {
        if (orderId) {
          this.currentOrderId = orderId;
          localStorage.setItem('messageId', orderId);
        }
        console.log(this.currentOrderId)
        this.show();
      });
    },
    methods   : {
      getMsgWinHandle(orderId, isEnter){
        if (orderId) {
          this.currentOrderId = orderId;
          localStorage.setItem('messageId', orderId);
        }
        const params = {
          uid : this.userId,
          id  : this.currentOrderId ? this.currentOrderId : '',
          flag: 'msgboard'
        };
        isEnter ? params.opt = 'del' : ''
        getMsgWin(params).then(res => {
          console.log(res)
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          }
          const data = res.data.data;
          this.listData = data.listData;
          if (Object.prototype.toString.call(data.dialog) == '[object Array]') {  //没有orderId
            this.currentOrderId = this.listData[0].id;
            this.getMsgWinHandle();
          } else {  //有orderId
            this.dialog = data.dialog;
          }
        })
      },
      toSubmit(ev){
        console.log(ev)
        if (ev.keyCode != 13 || !this.currentOrderId) return;
        const params = {
          uid   : this.userId,
          id    : this.currentOrderId,
          flag  : 'msgboard',
          record: ev.target.value
        };
        submitMsg(params).then(res => {
          console.log(res)
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          }
          ev.target.value = '';
          this.getMsgWinHandle('', true);
        })
      },
      scrollBottom(){
        const $history = document.querySelector('.history');
        this.$nextTick(function () {
          $history.scrollTop = $history.scrollHeight;
        })

      },
      show(){
        move('.message-layout').translate(0, -522).end();
        this.getMsgWinHandle();
      },
      hide(){
        move('.message-layout').translate(0, 522).end();
      }
    },
    watch     : {
      $route(){
        this.hide()
      },
      dialog(){
        this.scrollBottom();
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .message-layout {
    position: fixed;
    z-index: 10001;
    bottom: -522px;
    right: 48px;
    width: 705px;
    height: 522px;
    background: #fff;
    border: 1px solid #D4D4D4;
    box-shadow: 0 -5px 10px 0 rgba(74, 74, 74, 0.09);
    border-radius: 4px;
    .box {
      display: flex;
      height: 100%;
      ul.contact {
        flex-shrink: 0;
        overflow-y: auto;
        width: 204px;
        border-right: 1px solid #EAEAEA;
        li {
          display: flex;
          align-items: center;
          padding: 0 10px 0 15px;
          height: 61px;
          border-bottom: 1px solid #EAEAEA;
          cursor: pointer;
          &.active {
            background: #efefef;
          }
          .first {
            width: 36px;
            height: 36px;
            line-height: 36px;
            font-size: 18px;
          }
          .content {
            .name {
              width: 121px;
              font-size: 14px;
              color: #323232;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .talk {
              width: 121px;
              margin-top: 6px;
              font-size: 12px;
              color: #777;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .dialog {
        flex-grow: 1;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 21px;
          height: 61px;
          border-bottom: 1px solid #EAEAEA;
          .name {
            font-size: 14px;
            color: #323232;
          }
          .button-box {
            display: flex;
            i {
              cursor: pointer;
            }
            .min {
              height: 14px;
              width: 14px;
              display: block;
              position: relative;
              &:before {
                content: '';
                height: 2px;
                width: 14px;
                display: block;
                background: #b2b2b2;
                position: absolute;
                top: 5px;
                left: 0px;
                border-radius: 5px;
              }
            }
          }
        }
        ul.history {
          padding: 0 18px;
          height: 323px;
          border-bottom: 1px solid #EAEAEA;
          overflow-y: auto;
          li {
            margin-bottom: 9px;
            .time {
              margin: 16px 0 16px;
              text-align: center;
              font-size: 14px;
              color: #C6C6C6;
            }
            .content {
              display: flex;
              align-items: flex-start;
              .first {
                width: 30px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
              }
              .talk {
                position: relative;
                padding: 13px 18px;
                width: 55%;
                font-size: 14px;
                line-height: 1.5;
                color: #393939;
                border-radius: 6px;
                &:before {
                  width: 0;
                  position: absolute;
                  top: 10px;
                  border-style: solid;
                  content: "";
                }
              }
            }
            &.me {
              .content {
                display: flex;
                flex-direction: row-reverse;
                .first {
                  margin-left: 12px;
                  background: url("../../images/head_test.jpg") no-repeat center;
                  background-size: contain;
                }
                .talk {
                  background: #E7F9FE;
                  &:before {
                    right: -5px;
                    border-color: transparent #E7F9FE;
                    border-width: 5px 0 5px 5px;
                  }
                }
              }
            }
            &.he {
              .content {
                display: flex;
                flex-direction: row;
                .first {
                  margin-right: 12px;
                }
                .talk {
                  background: #F4F4F4;
                  &:before {
                    left: -5px;
                    border-color: transparent #F4F4F4;
                    border-width: 5px 5px 5px 0;
                  }
                }
              }
            }
          }
        }
        .input {
          padding: 15px 0;
          width: 477px;
          height: 103px;
          textarea {
            padding: 0 20px !important;
            width: 457px;
            height: 103px;
            border: none 0 !important;
            box-shadow: none !important;
            outline: none !important;
            background: none !important;
            font-size: 14px;
            color: #393939 !important;
            line-height: 1.5;
          }
        }
      }
    }
    .first {
      flex-shrink: 0;
      display: inline-block;
      margin-right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-image: linear-gradient(-180deg, #A5AAB6 0%, #858A92 100%);
      line-height: 36px;
      font-size: 18px;
      text-align: center;
      color: #FFFFFF;
    }
  }
</style>
