<template>
  <div class="wrap">
    <div class="browser" v-if="browserNotAllow"></div>
    <div id="login" v-if="!browserNotAllow">
      <header>
        <span class="logo"></span>
        <!-- <img src="../images/logo.png"  alt=""> -->
        <p>美薇亭顾问工作台</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="mobile" class='form-data'>
            <el-input v-model.number="ruleForm.mobile"
                      autoComplete="on"
                      :maxlength="11"
                      placeholder="请输入手机号">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class='form-data'>
            <el-input type="password"
                      v-model="ruleForm.password"
                      auto-complete="off" placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <el-form-item class='remember'>
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="记住登录账号" name="type"></el-checkbox>
            </el-checkbox-group>
            <!--<a href=" ">忘记密码</a>-->
          </el-form-item>
          <el-form-item>
            <el-button id='submit'
                       :disabled="disabled"
                       type="primary"
                       @click="submitForm('ruleForm')">登   录
            </el-button>
          </el-form-item>
          <div v-if="debugEnv">
            <el-button @click="quickLogin('13651200755')">客服</el-button>
            <el-button @click="quickLogin('18700023456')">客服Leader</el-button>
            <el-button @click="quickLogin('18700045678')">顾问</el-button>
            <el-button @click="quickLogin('18618454388')">顾问Leader</el-button>
          </div>
        </el-form>
      </header>
    </div>
  </div>
</template>
<script>
  import {login, getRole, getNavBar} from '../service/getData.js';
  import eachAuth from '../plugins/eachAuth.js'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import WebStorageCache from 'web-storage-cache'
  import browser from '../plugins/browser'
  export default {
    data() {
      return {
        browserNotAllow: browser != 'chrome' && browser != 'safari',
        debugEnv  : false,
        userData  : {},
        wsCache   : new WebStorageCache(),
        routerPage: '',
        ruleForm  : {
          password: '',
          mobile  : '',
          type    : false //记住账号
        },
        disabled  : false,
        rules     : {
          password: [
            {validator: this.validatePass, trigger: 'blur'}
          ],
          mobile  : [
            {validator: this.checkAge, trigger: 'blur'}
          ]
        }
      };
    },
    created(){
      const host = location.hostname;
      if (host == 'localhost' || host == 'new.dev.amazingday.cn' || host == 'new.trunk.amazingday.cn' || host.match('192.168')) {
        this.debugEnv = true;
      }
      if (this.wsCache.get('remember')) { //记住账号
        let obj = this.wsCache.get('remember');
        this.ruleForm.mobile = obj.mobile;
        this.ruleForm.password = obj.password;
      }
    },
    methods: {
      ...mapMutations(['pushUserData', 'clearState']),
      /*验证手机号*/
      checkAge(rule, value, callback){
        if (!value) {
          callback();
        }
        setTimeout(() => {
          if (!Number.isInteger(parseInt(value))) {
            callback(new Error('请输入数字值'));
          } else {
            let telReg = /^[0-9]{11}$/.test(value);
            if (!telReg) {
              callback(new Error('手机格式有误'));
            } else {
              callback();
            }
          }
        }, 300);
      },
      /*验证密码*/
      validatePass(rule, value, callback){
        if (value === '') {
          callback();
        } else {
          callback();
        }
      },
      /*验证登录*/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginHandle(formName);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /*登录*/
      loginHandle(formName){
        this.disabled = true;
        login(this[formName]).then(res => {
          this.disabled = false;
          var res = res.data;
          this.getRoleHandle(res.data.userInfo.id);
        })
      },
      /*获取角色和菜单*/
      getRoleHandle(uid){
        this.disabled = true;
        getRole({"uid": uid}).then(res => {
          this.disabled = false;
          var roleData = res.data;
          if (roleData.code != 200) {
            this.$message({
              message    : roleData.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          }
          /*if (roleData.data.role.length == 0) {
            this.$message({
              message    : '无权访问，请联系管理员',
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
            return;
          }*/
          /*先清除vuex上挂载的数据，避免数据污染*/
          this.clearState();
          /*遍历整理角色菜单*/
          const authData = eachAuth(roleData.data.auth);
          console.log(authData);
          /*存用户信息*/
          this.userData = roleData.data;
          this.pushUserData({
            userData: roleData.data,
            authData: authData
          });
          /*记住账号密码*/
          let remember = {
            mobile  : this.ruleForm.mobile,
            password: this.ruleForm.password
          }
          this.wsCache.set('remember', remember, {exp: 7 * 24 * 60 * 60});  //失效时间7天
          /*跳转*/
          this.routerPage = '';
          this.routerToPage(authData);
          console.log(this.routerPage);
          this.$router.push(this.routerPage);
        })
      },
      /*登录后跳转页面*/
      routerToPage(authData){
        if (this.routerPage) return;
        for (let i = 0; i < authData.length; i++) {
          const item = authData[i];
          if (item.page) {
            this.routerPage = item.page;
            break;
          } else if (item.children && item.children.length) {
            this.routerToPage(item.children);
            if (this.routerPage) break;
          }
        }
      },
      /*重置表单*/
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*开发环境快捷登录,上线前删掉*/
      quickLogin(mobile){
        this.ruleForm.mobile = mobile;
        this.ruleForm.password = '123456';
        this.submitForm('ruleForm');
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #app {
    height: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0);
  }
  .wrap{
    width: 100%;
    height: 100%;
    .browser{
      width: 100%;
      height: 100%;
      background: url("../images/browser.jpg") no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
  #login {
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
    header {
      font-size: 18px;
      color: #343434;
      text-align: center;
      margin-top: 85px;
      .logo {
        font-family: 'logo' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 36px;
        &:before {
          content: "\e900";
          color: rgb(0, 0, 0);
        }
      }
    }
    p {
      margin-top: 10px;
      font-size: 18px;
      color: #343434;
    }
    form {
      // width: 400px;
      // padding-right: 186px;
      margin: 0 auto;
      padding-top: 80px;
      position: relative;
      .el-input {
        width: auto;
      }
      .form-data {
        padding-left: 242px;
      }
      input {
        background: rgba(41, 41, 41, 0.05);
        border-radius: 4px;
        width: 280px;
      }
      .el-form-item.is-error {
        // background: rgba(208,1,26,0.05);
        input {
          border: 2px solid #D0011B;
        }

      }
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-checkbox__label {
      padding-left: 6px;
    }
    .el-input__inner {
      height: 30px;
    }
    .el-checkbox__inner::after {
      top: 0px;
      left: 3px;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      line-height: 30px;
    }
    .remember {
      margin-bottom: 40px;
      .el-checkbox__input .el-checkbox__inner {
        width: 14px;
        height: 14px;
        border-radius: 2px;
      }
      .el-form-item__content {
        padding: 0 243px;
      }
      .el-checkbox {
        float: left;
        line-height: 20px;
        font-size: 14px;
        color: #919191;
      }
      a {
        float: right;
        line-height: 20px;
        font-size: 14px;
        color: #919191;
      }
    }
    #err-tel {
      // float: left;
    }
  }
  #submit {
    line-height: 12px;
    width: 280px;
    font-size: 14px;
    color: #FFFFFF;
    background: #4A90E2;
    span {
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 6px;
    }
  }
  #login .el-form-item__error {
    // display:none;
  }
</style>
