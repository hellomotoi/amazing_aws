<template>
  <div id="changePassword">
    <div class="top">
      <el-button @click="goHistory">返回</el-button>
    </div>
    <div class="content">
      <div class="title">修改密码</div>
      <el-form ref="form" label-width="200px" label-position="right">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="oldPw"></el-input>
          <inputTips :msg="oldPwMsg" :isShow="isShowOldPwMsg"></inputTips>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newPw"></el-input>
          <inputTips :msg="newPwMsg" :isShow="isShowNewPwMsg"></inputTips>
        </el-form-item>
        <ul class="strong">
          <li v-for="n in 3" :class="{'active':n<=strengthLv}"></li>
        </ul>
        <el-form-item label="重复新密码">
          <el-input type="password" v-model="newPwR"></el-input>
          <inputTips :msg="newPwRMsg" :isShow="isShowNewPwRMsg"></inputTips>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="submit" @click="submit">确认修改</el-button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import WebStorageCache from 'web-storage-cache'
  import {changePassword} from '../../service/getData.js'
  import inputTips from '../../components/inputTips'
  export default{
    data(){
      return {
        wsCache        : new WebStorageCache(),
        isShowOldPwMsg : false,  //初始不显示(旧密码提示信息)
        isShowNewPwMsg : false,  //初始不显示(新密码提示信息)
        isShowNewPwRMsg: false, //初始不显示(重复新密码提示信息)
        oldPwMsg       : '',    //旧密码提示信息
        newPwMsg       : '',    //新密码提示信息
        newPwRMsg      : '',   //重复新密码提示信息
        oldPw          : '',    //旧密码
        newPw          : '',    //新密码
        newPwR         : '',   //重复新密码
        strengthLv     : 0 //密码强度
      }
    },
    components: {
      inputTips
    },
    watch     : {
      oldPw(newVal){
        if (newVal.length > 0) {
          this.isShowOldPwMsg = false;
        }
      },
      newPw(newVal){
        this.checkStrength(newVal);
        this.isShowNewPwMsg = false;
        if (newVal.length > 0 && newVal.length < 6) {
          this.newPwMsg = '新密码长度不能少于6位';
          this.isShowNewPwMsg = true;
        }
      },
      newPwR(newVal){
        this.isShowNewPwRMsg = false;
        if (newVal.length > 0 && newVal != this.newPw) {
          this.newPwRMsg = '密码前后不一致';
          this.isShowNewPwRMsg = true;
        }
      }
    },
    methods   : {
      ...mapState(['userData', 'userId']),
      goHistory(){
        if (this.wsCache.get('userId')) {
          this.$router.go(-1);
        } else {
          this.$router.push('/login');
        }
      },
      checkStrength(val){  //检验密码强度
        let lv = 0;
        if (val.match(/[a-z]/g)) {
          lv++;
        }
        if (val.match(/[0-9]/g)) {
          lv++;
        }
        if (val.match(/(.[^a-z0-9])/g)) {
          lv++;
        }
        if (val.length < 6) {
          lv = 0;
        }
        if (lv > 3) {
          lv = 3;
        }
        this.strengthLv = lv;
      },
      submit(){ //修改密码
        this.isShowOldPwMsg = false;
        this.isShowNewPwMsg = false;
        this.isShowNewPwRMsg = false;
        if (!this.oldPw) {
          this.oldPwMsg = '请输入旧密码';
          this.isShowOldPwMsg = true;
          return;
        }
        if (!this.newPw) {
          this.newPwMsg = '请输入新密码';
          this.isShowNewPwMsg = true;
          return;
        }
        if (!this.newPwR) {
          this.newPwRMsg = '请重复输入新密码';
          this.isShowNewPwRMsg = true;
          return;
        }
        if (this.newPw != this.newPwR) {
          return;
        }
        let params = {
          mobile     : this.userData().userInfo.mobile, //手机号
          oldPassword: this.oldPw, //原密码
          newPassword: this.newPw  //新密码
        };
        changePassword(params).then(res => {
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          }
          this.$message({
            message    : '修改密码成功！',
            showClose  : true,
            customClass: "succ",
            iconClass  : 'icon-success'
          });
        });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #changePassword {
    width: 760px;
    height: 496px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #FFFFFF;
    border: 1px solid rgba(149, 149, 149, 0.33);
    box-shadow: 0 5px 14px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    .top {
      .el-button {
        padding: 0;
        margin: 27px 0 0 32px;
        width: 80px;
        height: 30px;
        line-height: 30px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        margin-top: 30px;
        font-size: 24px;
        color: #343434;
      }
      .el-form {
        padding-top: 31px;
        .strong {
          position: relative;
          top: -7px;
          display: flex;
          justify-content: space-around;
          margin: 0 auto 21px;
          width: 280px;
          height: 7px;
          li {
            width: 100%;
            background: #D5D5D5;
            &:nth-child(1) {
              &.active {
                background: #FF5959;
              }
            }
            &:nth-child(2) {
              margin: 0 5px;
              &.active {
                background: #F8E81C;
              }
            }
            &:nth-child(3) {
              &.active {
                background: #7ED321;
              }
            }
          }
        }
        .el-form-item {
          .el-form-item__label {
            padding-right: 0;
            width: 56px;
            font-size: 14px;
            color: #343434;
          }
          .el-form-item__content {
            display: flex;
            .el-input {
              margin: 0 15px;
              width: 280px;
            }
            .change-btn {
              flex-shrink: 0;
            }
          }
        }
      }
      .submit {
        margin-top: 40px;
        padding: 0;
        width: 280px;
        height: 34px;
        line-height: 34px;
      }
    }
  }
</style>
