<!--右侧顶部搜索条-->
<template>
  <div class="search-box">
    <div class="search">
      <div data-v-7cb97226="" class="el-input" v-show="showSearch">
        <i class="el-icon-zoom"></i>
        <input type="text"
               v-model="searchText"
               @keyup="doSearch"
               placeholder="请输入ID、客户姓名、联系方式、酒店名称、线索来源，点击回车进行搜索"
               autocomplete="off"
               class="el-input__inner">
      </div>
    </div>
    <!--<div class="notice" @click="isShowNotice = !isShowNotice">
      <span class="icon">
        <i></i>
      </span>
      <ul class="list" v-if="isShowNotice">
        <li>
          <span class="highlight">4</span>
          <span>条待分配的婚礼</span>
          <router-link class="highlight" to="">立即处理</router-link>
        </li>
        <li>
          <span class="highlight">5</span>
          <span> 条待处理丢单的婚礼条待处理丢单的婚礼条待处理丢单的婚礼</span>
          <router-link class="highlight" to="">立即处理</router-link>
        </li>
      </ul>
    </div>-->
    <router-link class="user-icon" to="/user/userCenter"></router-link>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {getTaskListStatus, getAdviserTaskList} from '../service/getData.js'
  import Bus from '../store/bus.js'
  export default {
    data(){
      return {
        isShowNotice : false,
        searchText   : '',
        hasSearchPath: [
          'view',
          'service',
          'checkingDetail',
          'checkedDetail'
        ],
        showSearch   : true
      }
    },
    props  : [],
    created(){
      this.isShowSearch();
    },
    methods: {
      ...mapState(['userData']),
      isShowSearch(){
        this.showSearch = true;
        this.hasSearchPath.forEach(item => {
          if (this.$route.path.indexOf(item) != -1) {
            this.showSearch = false;
          }
        })
      },
      doSearch(event){
        if (event.keyCode == 13) { //回车
          event.target.blur();
          this.$store.state.searchText = this.searchText;
          if(!this.searchText) return;
          const pathArr = this.$route.path.split('/');
          if (pathArr[3] == 'searchResult') {
            Bus.$emit('doSearch');
          } else {
            this.$router.push(`/${pathArr[1]}/${pathArr[2]}/searchResult`);
          }
        }
      }
    },
    watch  : {
      $route(val){
        this.isShowSearch();
        this.isShowNotice = false;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-box {
    position: fixed;
    z-index: 2001;
    top: 0;
    width: calc(100% - 219px);
    display: flex;
    align-items: center;
    height: 70px;
    border-bottom: solid 2px #F1F6F9;
    border-left: solid 2px #F1F6F9;
    background: #fff;
    .search {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin-left: 24px;
      .el-input {
        width: 90% !important;
        border: none 0 !important;
      }
      .el-input__inner {
        padding-left: 35px !important;
        background-color: inherit !important;
        &:focus, &:hover {
          border: none 0 !important;
        }
      }
      i {
        position: absolute;
        width: 35px;
        height: 100%;
        text-align: center;
        color: #bfcbd9;
        transition: all .3s;
        &.el-icon-zoom {
          left: 0;
          top: 0;
          background: url("../images/search_icon.png") no-repeat center;
          background-size: 17px 17px;
        }
        &.el-icon-enter {
          right: 0;
          top: 0;
          background: url("../images/search_enter.png") no-repeat center;
          background-size: 17px auto;
        }
      }
    }
    .notice{
      position: relative;
      margin-right: 25px;
      width: 42px;
      height: 42px;
      cursor: pointer;
      .icon{
        position: relative;
        display: inline-block;
        width: 42px;
        height: 42px;
        background: url("../images/panel/Oval_1.png") no-repeat;
        background-size: contain;
        i{
          position: absolute;
          right: 0;
          top: -3px;
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #F43C3B;
          border-radius: 50%;
        }
      }
      ul.list{
        position: absolute;
        z-index: 10001;
        right: -25px;
        top:66px;
        padding: 12px 20px;
        width: 297px;
        background: #FFFFFF;
        border: 1px solid #CBCBCB;
        box-shadow: 0 5px 10px 0 rgba(74,74,74,0.17);
        border-radius: 0 0 4px 4px;
        font-size: 14px;
        color: #000;
        li{
          margin: 7px 0;
          line-height: 1.5;
          .highlight{
            color: #4A90E2;
            font-weight: bold;
          }
        }
      }
    }
    .user-icon {
      display: block;
      margin-right: 38px;
      width: 42px;
      height: 42px;
      background: url("../images/head_test.jpg") no-repeat;
      background-size: contain;
      cursor: pointer;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
