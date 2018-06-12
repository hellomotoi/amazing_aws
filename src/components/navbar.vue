<!--左侧导航-->
<template>
  <nav id='amNavBar'>
    <el-col>
      <div class="logo">
        <!-- <img src="../../images/logo.png"> -->
      </div>
      <div class="nav-box" :style="{'height':screenH}">
        <el-menu :default-active="activePage">
          <div v-for="item in authData">
            <!--纯一级菜单-->
            <el-menu-item :index="item.page ? item.page : item.authName"
                          :class="{'disable':!item.page}"
                          @click="selectChild(item)"
                          v-if="!item.children || !item.children.length">
              <div class="menu-item">
                <i :class="item.icon"></i>
                {{item.authName}}
                <span class="totalNum" v-if="item.param && totalData && item.totalNum!=0">{{item.totalNum}}</span>
              </div>
            </el-menu-item>
            <!--含二级菜单-->
            <el-submenu :index="item.authName"
                        ref="mybox"
                        v-if="item.children&&item.children.length">
              <template slot="title">
                <i :class="item.icon"></i>
                {{item.authName}}
              </template>
              <el-menu-item-group v-for="cItem in item.children">
                <el-menu-item :index="cItem.page ? cItem.page : cItem.authName"
                              :class="{'disable':!cItem.page}"
                              @click="selectChild(cItem)">
                  <div class="c-item">
                    {{cItem.authName}}
                    <span class="totalNum" v-if="totalData && cItem.totalNum!=0">{{cItem.totalNum}}</span>
                  </div>
                  <el-badge class="mark" :value="cItem.value"/>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-col>
  </nav>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {leftParams} from '../service/getData.js'
  import Bus from '../store/bus';
  export default {
    data(){
      return {
        active     : '',
        roleName   : '',
        menuList   : [],
        params     : [],
        totalParams: '',
        totalData  : {},
        currentMenu: {}
      }
    },
    created(){
      this.totalHandle();
      Bus.$off('menuTotal');
      Bus.$on('menuTotal', () => {
        this.totalParams = '';
        this.totalHandle();
      });
    },
    mounted () {
      setTimeout(function () {
        var activeBox = document.querySelectorAll(".el-submenu.is-active")[0];
        var activeList = document.querySelectorAll(".el-submenu.is-active .el-menu")[0];
        activeBox ? activeBox.classList.add('is-opened') : '';
        activeList ? activeList.style.display = "block" : '';
      }, 300)
    },
    props   : [],
    computed: {
      ...mapState(['userData', 'authData']),
      screenH(){
        return document.documentElement.clientHeight - 88 + 'px';
      },
      activePage(){
        const url = this.$route.fullPath;
        const pathArr = url.match(/\/\w+/g);
        return pathArr[0] + pathArr[1];
      }
    },
    methods : {
      ...mapMutations(['clearState']),
      eachMenuStatus(menu, total){ //遍历获取所有菜单的param
        menu.forEach(item => {
          if (item.param) {
            //拼接请求参数
            this.totalParams += `${item.param},`;
            //请求成功后增加统计字段
            if (total && total.name == item.param) {
              item.totalNum = total.key;
            }
          }
          if (item.children) {
            this.eachMenuStatus(item.children, total);
          }
        });
      },
      eachTotalData(){ //遍历添加菜单统计数
        this.totalData.forEach(total => {
          this.eachMenuStatus(this.authData, total);
        });
      },
      totalHandle(){  //请求统计数
        this.eachMenuStatus(this.authData);
        this.totalParams = this.totalParams.substring(0, this.totalParams.length - 1);
        let params = {
          uid       : this.userData.userInfo.id,
          leftParams: this.totalParams
        }
        leftParams(params).then(res => {
          this.totalData = res.data.data;
          this.eachTotalData();
        })
      },
      selectChild(item){
        this.clearState('status');
        this.clearState('type');
        if (item.page != this.$route.fullPath) {
          this.$router.push(item.page);
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  $focusBg: #4990E2;
  $iconBg: #165DAF;
  #amNavBar {
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
      height: 70px;
      line-height: 70px;
      text-align: center;
      &:before {
        content: "\e900";
        color: rgb(0, 0, 0);
      }
    }
    .nav-box {
      overflow-y: auto;
    }
    width: 219px;
    height: 100%;
    background-color: #fff;
    float: left;
    border: none;
    .totalNum {
      flex-shrink: 0;
      display: inline-block;
      margin-left: 10px;
      min-width: 13px;
      height: 21px;
      line-height: 21px;
      text-align: center;
      border-radius: 4px;
      font-size: 12px;
      font-weight: lighter;
      background: #99BBE3;
      color: #fff;
      padding: 0px 4px;
    }
    .el-menu-item-group {
      .el-menu-item-group__title {
        padding-top: 0;
      }
      .el-menu-item {
        padding-left: 24px;
        font-size: 14px;
        &.is-active {
          font-size: 14px;
          .c-item {
            padding-left: 12px;
            color: #fff;
          }
          .totalNum {
            background-color: $iconBg;
          }
        }
        &.disable {
          .c-item {
            background: #fff;
            color: #616873;
            cursor: not-allowed;
          }
          background: #fff;
          color: #616873;
          cursor: not-allowed;
        }
        .c-item {
          display: flex;
          align-items: center;
          padding-left: 12px;
          color: #6F6F6F;
        }
      }
    }
    .el-submenu {
      font-size: 16px;
      &.is-opened {
        .el-submenu__title {
          /* color: $focusBg; */
          color: #000;
          letter-spacing: 0;
          .el-submenu__icon-arrow.el-icon-arrow-down {
            &:before {
              content: '';
              height: 0;
              width: 0;
              display: block;
              border: 5px transparent solid;
              border-bottom-width: 0;
              border-top-color: #4A90E2;
            }
          }
        }
      }
      .el-submenu__title {
        display: flex !important;
        align-items: center;
        font-size: 16px;
        .el-submenu__icon-arrow.el-icon-arrow-down {
          margin-top: 4px;
          margin-right: 15px;
          background: none;
          &:before {
            content: '';
            height: 0;
            width: 0;
            display: block;
            border: 5px transparent solid;
            border-top-width: 0;
            border-bottom-color: #6F6F6F;
          }
        }
      }
      .el-menu {
        background-color: #fff;
      }
    }
    .el-menu {
      background-color: #fff;
      & > div > .el-menu-item {
        height: 56px;
        line-height: 56px;
        .menu-item {
          display: flex !important;
          align-items: center;
        }
      }
    }
    .el-badge.mark {
      line-height: 1;
    }
    .el-badge__content {
      border-radius: 50%;
      width: 25px;
      height: 25px;
      line-height: 26px;
      text-align: center;
      padding: 0;
      background: $iconBg;
      border: none;
      margin-left: 10px;
    }
    .el-menu-item {
      font-size: 16px;
      color: #616873;
      height: 40px;
      line-height: 40px;
      &.is-active {
        background: $focusBg;
        font-size: 16px;
        color: #fff;
        .totalNum {
          background-color: $iconBg;
        }
      }
      &.disable {
        background: #fff;
        color: #616873;
        cursor: not-allowed;
      }
    }
  }
</style>
