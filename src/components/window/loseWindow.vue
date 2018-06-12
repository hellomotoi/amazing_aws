<!--申请丢单-->
<template>
  <div id="loseWindow" v-show="isShow">
    <div tabindex="-1" class="el-message-box__wrapper">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title">丢单申请</div>
          <!-- <i class="el-message-box__close el-icon-close" @click="isShow=false"></i> -->
        </div>
        <div class="el-message-box__content">
          <p class="title">{{loseObj.name}}</p>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请简单描述下丢单原因"
            v-model="loseObj.value">
          </el-input>
          <p class="desc">注：申请丢单提交后，无法撤销丢单申请，请慎重提交。</p>
        </div>
        <div class="el-message-box__btns">
          <button type="button"
                  class="el-button el-button--default"
                  @click="isShow=false">
            <span>取消</span>
          </button>
          <button type="button"
                  class="el-button el-button--default el-button--primary "
                  @click="submit">
            <span>确定</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" style="z-index: 2035;"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Bus from '../../store/bus.js'
  import {getLoseWin, submitLoseWin} from '../../service/getData.js'
  export default {
    data(){
      return {
        isShow : false,
        loseObj: {
          value: ''
        }
      }
    },
    created(){
      Bus.$off('showLoseWindow');
      Bus.$on('showLoseWindow', () => {
        this.loseObj.value = '';
        this.isShow = true;
        this.getWin();
      });
    },
    props  : ['orderId', 'historyTarget'],
    methods: {
      ...mapState(['userData']),
      getWin(){
        getLoseWin({uid: this.userData().userInfo.id, id: this.$route.params.id}).then(res => {
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
          this.loseObj = res.data.data;
        })
      },
      submit(){
        if (this.loseObj.value.length == 0) {
          this.$message({
            message    : '请填写丢单原因',
            showClose  : true,
            customClass: "err",
            iconClass  : 'icon-wrong'
          });
          return;
        }
        this.$confirm('此操作将该任务丢单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning',
          closeOnClickModal: false,
          showClose        : false
        }).then(() => {
          this.isShow = false;
          let params = {
            uid        : this.userData().userInfo.id,
            id         : this.$route.params.id,
            lost_reason: this.loseObj.value
          };
          submitLoseWin(params).then(res => {
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
              message    : '提交成功，请耐心等待处理结果',
              showClose  : true,
              customClass: "succ",
              iconClass  : 'icon-success'
            });
            /*
             根据角色信息 roleId
             1 顾问 2 录入客服 3核实客服  4顾问主管 5 财务 6库管 7宴会设计 8花艺 9执行
             跳转相应列表
             注: this.$router.go(); 可能会跳转合同页面
             */
            Bus.$emit('hasToLosed');
            /*if (this.userData().role[0].roleId == 1) {
             this.$router.push(`/adviser/${this.$route.params.target}`);
             } else if (this.userData().role[0].roleId == 4) {
             this.$router.push(`/adviserLeader/${this.$route.params.target}`);
             } else {
             // 非 顾问&顾问leader 没有丢单权限
             this.$router.push('/');
             }*/
          })
        }).catch(() => {
          // 二次确认弹框取消操作
        });
      }
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scope>
  #loseWindow {
    position: absolute;
    .el-message-box__wrapper {
      z-index: 2036 !important;
    }
    .el-message-box {
      width: 668px;
      max-height: 406px;
      .el-textarea {
        margin-top: 15px;
        width: 100%;
        float: none;
      }
      .el-message-box__header {
        height: 40px;
        .el-message-box__title {
          display: inline-block;
        }
        .el-message-box__close {
          float: right;
        }
      }
      .el-message-box__content {
        padding: 20px 40px;
        border-top: solid 1px #eaeaea;
        border-bottom: solid 1px #eaeaea;
        height: auto;
        .title {
          font-size: 16px;
        }
        .desc {
          margin-top: 10px;
          font-size: 14px;
          color: #919191;
        }
      }
      .el-message-box__btns {
        padding: 20px 34px 30px;
        text-align: right;
      }
      .el-button {
        padding: 0;
        width: 109px;
        height: 34px;
        line-height: 34px;
        #el-button--primary {
          background: #4A90E2;
          border: #4A90E2;
        }
      }
    }
    .v-modal {
      opacity: .5 !important;
    }
  }
  .el-message-box__wrapper {
    z-index: 3000 !important;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
