<template>
  <div id="endDetail">
    <header id="edTop">
      <div class="left">
        <div class="go-back" @click="goBack()">返回</div>
        <div class="title">
          No.{{detail.code}}&nbsp;{{detail.group}}
        </div>
        <div class="desc">
          <span class="status">{{detail.status}}</span>
          <span class="text" v-if="currentTarget == 'checkedClue'">核实客服：{{detail.following}}</span>
          <span class="text" v-if="currentTarget == 'abandonedClue'">废弃客服：{{detail.following}}</span>
          <span class="text">提交时间：{{detail.createDate}}</span>
        </div>
      </div>
      <div class="right">
        <el-button @click="toActive" v-if="currentTarget == 'abandonedClue'">激活</el-button>
        <el-button @click="dialogRizhiVisible = true">日志</el-button>
      </div>
    </header>
    <el-dialog top="25%" size="tiny" title="日志信息" v-model="dialogRizhiVisible" @open="open" @close="close"
               id="infoWindow">
      <template>
        <h3>{{this.rizhiDatas.code}}</h3>
        <dl v-for="item in this.rizhiDatas.listData">
          <dt>
            <i class="icon"></i>
          </dt>
          <dd>
            <p>{{item.create_time}}</p>
            <p style="color: #3B79C1;">{{item.name}}</p>
            <p>{{item.done}}</p>
          </dd>
        </dl>
      </template>
    </el-dialog>
    <div id='edContent' class="edContent">
      <div class='title-t'>
        <span>核实内容</span>
      </div>
      <section class="editArea" v-if="this.currentUserInfo.length != 0">
        <p class='left-title'>客户信息</p>
        <div class="clueMsg">
          <el-row v-for="item in this.currentUserInfo">
            <el-col :span="5">
              <div class="grid-content msg-name">{{item.name}}</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content msg-val">{{item.value}}</div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="editArea" v-if="this.currentWedInfo.length != 0">
        <p class='left-title'>婚礼基本信息</p>
        <div class="clueMsg">
          <el-row v-for="item in this.currentWedInfo">
            <el-col :span="5">
              <div class="grid-content msg-name">{{item.name}}</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content msg-val">{{item.value}}</div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="editArea" v-if="this.currentSysInfo.length != 0">
        <p class='left-title'>系统信息</p>
        <div class="clueMsg">
          <el-row v-for="item in this.currentSysInfo">
            <el-col :span="5">
              <div class="grid-content msg-name">{{item.name}}</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content msg-val">{{item.value}}</div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="editArea" v-if="this.currentDisInfo.length != 0">
        <p class='left-title'>废弃信息</p>
        <div class="clueMsg">
          <el-row v-for="item in this.currentDisInfo">
            <el-col :span="5">
              <div class="grid-content msg-name">{{item.name}}</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content msg-val">{{item.value}}</div>
            </el-col>
          </el-row>
        </div>
      </section>
    </div>
  </div>
</template>
<script type="text/javascript">
  import  {mapState} from 'vuex';
  import Bus from '../../store/bus.js'
  import  {showClue, loginfo, active} from '../../service/getData.js';
  export default {
    data() {
      return {
        currentId         : '',
        currentType       : '',
        detail            : {}, // top信息
        currentUserInfo   : [], // 客户信息
        currentWedInfo    : [], // 婚礼基本信息
        currentSysInfo    : [], // 系统信息
        currentDisInfo    : [], // 系统信息
        currentTarget     : this.$route.params.target,
        dialogRizhiVisible: false,
        rizhiDatas        : ''
      }
    },
    created(){ // 页面初importan始化
      console.log('页面初始化');
      this.currentId = this.$route.params.id;
      if (this.$route.params.target == 'checkedClue') {
        this.currentType = 'check';
      } else if (this.$route.params.target == 'abandonedClue') {
        this.currentType = 'discard';
      }
      this.renderInfo();
    },
    mounted() {
      console.log('页面渲染');
    },
    methods: {
      ...mapState(['userData']),
      renderInfo() {
        showClue({id: this.currentId, type: this.currentType})
          .then(res => {
            console.log('已核实原始数据', res);
            let resData = res.data.data;
            this.detail = resData.top;
            this.currentUserInfo = resData.user;
            this.currentWedInfo = resData.wed;
            this.currentSysInfo = resData.check.concat(resData.clue); // 合并数据
            this.currentDisInfo = resData.discardInfo;
          })
      },
      toActive (){
        this.$confirm('你确定激活此线索么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning',
          // showClose: false,
          closeOnClickModal: false
        }).then(() => {
          this.isShow = false;
          let params = {
            uid: this.userData().userInfo.id,
            id : this.$route.params.id
          };
          active(params).then(res => {
            console.log('激活返回数据', res);
            if (res.data.code != 200) {
              this.$message({
                message    : res.data.message,
                showClose  : true,
                customClass: "err",
                iconClass  : 'icon-wrong'
              });
              return;
            }
            ;
            Bus.$emit('menuTotal');
            this.$message({
              message    : '订单激活成功',
              showClose  : true,
              customClass: "succ",
              iconClass  : 'icon-success'
            });
            this.$router.go(-1);
          })
        }).catch(() => {
          // 二次确认弹框取消操作
        });
      },
      open () {
        console.log('日志打开');
        loginfo({'id': this.currentId})
          .then((res) => {
            console.log('日志信息', res);
            if (res.data.code != 200) return;
            this.rizhiDatas = res.data.data;
          })
      },
      close () {
        console.log('日志关闭');
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  /* top */
  #edTop {
    display: flex;
    justify-content: space-between;
    padding: 21px 0 7px 24px;
    border-bottom: solid 2px #F2F7FA;
    background-color: #fff;
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
        .status {
          width: 64px;
          height: 20px;
          line-height: 20px;
          background: #E3F0FF;
          border-radius: 4px;
          font-size: 12px;
          color: #4990E2;
          letter-spacing: 0;
          text-align: center;
        }
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
  /* content */
  #endDetail {
    border-left: 2px solid #f2f7fa;
    .edContent {
      background-color: #fff;
      .title-t {
        border-bottom: 1px solid #eaeaea;
        font-size: 16px;
        color: #313131;
        margin-left: 41px;
        span {
          position: relative;
          bottom: -3px;
          display: inline-block;
          width: 80px;
          height: 70px;
          line-height: 70px;
          border-bottom: 4px solid #4a90e2;
          text-align: center;
        }
      }
      .editArea {
        position: relative;
        margin-left: 41px;
        border-bottom: 1px solid rgba(151, 151, 151, 0.2);
        padding: 30px 0;
        .left-title {
          font-size: 16px;
          color: #292929;
          letter-spacing: 0;
        }
        .grid-content.msg-val {
          font-size: 14px;
          color: #1F1F1F;
          word-break: break-all;
        }
        .grid-content.msg-name {
          font-size: 14px;
          color: #919191;
          padding-left: 20px;
        }
        .clueMsg {
          width: 600px;
          margin-left: 140px;
          .el-row {
            line-height: 20px;
            margin-bottom: 25px;
          }

        }
      }
    }
  }
  #infoWindow {
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog__header {
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .el-dialog__body {
      padding: 20px 25px;
      color: #48576a;
      font-size: 16px;
      max-height: 300px;
      overflow-x: hidden;
      overflow-y: auto;
      h3 {
        margin-bottom: 20px;
      }
      dl {
        display: flex;
        &:nth-of-type(1) {
          dt {
            .icon {
              background-color: #6F6F6F;
            }
            &::before {
              opacity: 0 !important;
            }
          }
        }
        &:last-child {
          dt {
            &::after {
              opacity: 0;
            }
          }
        }
      }
      dt {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-right: 10px;
        &:before {
          content: "";
          display: block;
          width: 0;
          height: 8px;
          border-right: 1px solid #dfdfdf;
        }
        &:after {
          content: "";
          flex-grow: 1;
          display: block;
          width: 0;
          height: 100%;
          border-right: solid 1px #DFDFDF;
        }
        .icon {
          flex-shrink: 0;
          display: block;
          width: 9px;
          height: 9px;
          background: #DFDFDF;
          border-radius: 50%;
        }
      }
      dd {
        margin-left: 20px;
        p {
          margin-bottom: 5px;
          padding-left: 5px;
          &:first-child {
            font-size: 18px;
            color: #999;
            margin-bottom: 5px;
            padding-left: 0px;
          }
          &:last-child {
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  .el-message-box__wrapper {
    z-index: 3001 !important;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .el-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
</style>
