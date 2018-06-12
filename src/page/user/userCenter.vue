<template>
  <div id="userCenter">
    <div class="top">
      <el-button @click="goHistory">返回</el-button>
    </div>
    <div class="content">
      <div class="head-box">
        <img :src="userData.userInfo.headimg" v-if="userData.userInfo.headimg" alt="">
      </div>
      <div class="name-box" v-if="!isChangeNickname">
        <span class="name">
          {{userData.userInfo.nickname ? userData.userInfo.nickname : 'Amaz!ng小友'}}
        </span>
        <div class="change-btn-box">
          <span class="change-btn" @click="isChangeNickname=true">修改昵称</span>
        </div>
      </div>
      <div class="name-change-box" v-if="isChangeNickname">
        <el-input v-model="userData.userInfo.nickname" placeholder="请输入昵称"></el-input>
        <div class="change-btn-box">
          <span class="change-btn" @click="saveNickname">保存</span>
        </div>
      </div>
      <div class="phone">{{userData.userInfo.mobile}}</div>
      <div class="btn-box">
        <el-button type="primary" class="change-password" @click="changePassword">修改密码</el-button>
      </div>
      <div class="btn-box">
        <el-button class="logout" @click="logout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import WebStorageCache from 'web-storage-cache'
  import eachAuth from '../../plugins/eachAuth.js'
  import {changeNickname, changePassword, getRole} from '../../service/getData.js'
  export default{
    data(){
      return {
        wsCache         : new WebStorageCache(),
        isChangeNickname: false,
      }
    },
    mounted(){
    },
    computed: {
      ...mapState(['userData', 'userId'])
    },
    methods : {
      ...mapMutations(['pushUserData']),
      ...mapMutations(['removeUserData']),
      goHistory(){
        if (this.wsCache.get('userId')) {
          this.$router.go(-1);
        } else {
          this.$router.push('/login');
        }
      },
      saveNickname(){   //保存修改昵称
        if (this.userData.userInfo.nickname.length < 2) {
          this.$message({
            message    : '昵称长度不能少于2位',
            showClose  : true,
            customClass: "err",
            iconClass  : 'icon-wrong'
          });
          return;
        }
        this.isChangeNickname = false;
        let params = {
          uid     : this.userData.userInfo.id,
          nickname: this.userData.userInfo.nickname
        };
        changeNickname(params).then(res => {
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          } else {
            this.$message({
              message    : '昵称修改成功!',
              showClose  : true,
              customClass: "succ",
              iconClass  : 'icon-success'
            });
            this.getUserInfo();
          }
        })
      },
      getUserInfo(){
        getRole({"uid": this.userData.userInfo.id}).then(res => {
          var roleData = res.data;
          if (roleData.data.role.length == 0) {
            this.$message({
              message    : '无权访问，请联系管理员',
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            this.disabled = false;
            return;
          }
          /*遍历整理角色菜单*/
          const authData = eachAuth(roleData.data.auth);
          /*存用户信息*/
          this.userData = roleData.data;
          this.pushUserData({
            userData: roleData.data,
            authData: authData
          });
        })
      },
      changePassword(){ //修改密码
        this.$router.push('/user/changePassword');
      },
      logout(){ //退出登录
        this.removeUserData();
        this.$router.push('/login');
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userCenter {
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
      .change-btn-box {
        width: 200px;
        .change-btn {
          font-size: 14px;
          color: #4990E2;
          cursor: pointer;
          text-decoration: none;
        }
      }
      .head-box {
        margin-top: 30px;
        width: 100px;
        height: 100px;
        background: url("../../images/head_test.jpg") no-repeat;
        background-size: contain;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
      .name-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
        width: 100%;
        &:before {
          content: "";
          display: block;
          width: 200px;
        }
        .name {
          display: flex;
          align-items: center;
          padding: 0 15px;
          height: 36px;
          font-size: 18px;
          color: #343434;
        }
      }
      .name-change-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        width: 100%;
        &:before {
          content: "";
          display: block;
          width: 200px;
        }
        .el-input {
          width: 150px;
          padding: 0 15px;
          font-size: 18px;
          color: #343434;
          input {
            text-align: center;
          }
        }
        .change-btn {
        }
      }
      .phone {
        margin-top: 7px;
        color: #7f7f7f;
      }
      .btn-box {
        .change-password {
          margin-top: 40px;
          padding: 0;
          width: 280px;
          height: 34px;
          line-height: 34px;
        }
        .logout {
          margin-top: 20px;
          padding: 0;
          width: 280px;
          height: 34px;
          line-height: 34px;
        }
      }
    }
  }
</style>
