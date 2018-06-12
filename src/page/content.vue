<template>
  <div id="content">
    <nav-bar class="left-contaner"></nav-bar>
    <div class="right-contaner">
      <search></search>
      <div class="main-box">
        <router-view :iH="iH"></router-view>
      </div>
    </div>
    <!--<messageTips></messageTips>-->
  </div>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import WebStorageCache from 'web-storage-cache'
  import Bus from '../store/bus.js'
  import navBar from '../components/navbar.vue';
  import search from '../components/search.vue';
  import messageTips from '../components/message/tips.vue';
  export default {
    data(){
      return {
        wsCache: new WebStorageCache(),
        iH     : {
          viewHeight : '', // 当前routerview高度
          common     : 72 + 79 + 20,  //top + 页面标题 + 底部留空
          searchTitle: 74,  //场景
          pagination : 65    //分页
        },
        pollingTimes: 40  //轮询时间间隔
      }
    },
    components: {
      navBar, search, messageTips
    },
    computed  : {},
    created(){
      this.isLogin();
      this.iH.viewHeight = window.innerHeight;
      window.onresize = () => { // 屏幕伸缩
        this.iH.viewHeight = window.innerHeight;
      }
    },
    methods   : {
      ...mapMutations(['setUserData']),
      polling(){  //轮询
        setTimeout(()=>{
          Bus.$emit('messageRefresh');
          Bus.$emit('noticeRefresh');
          this.polling();
        }, this.pollingTimes);
      },
      isLogin(){
        if (this.wsCache.get('userId')) {
          this.setUserData();
        } else {
          this.$router.push('/login');
        }
      }
    },
    watch     : {
      $route(val) {
        this.isLogin();
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #content {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .left-contaner {
    width: 210px;
    flex-shrink: 0;
  }
  .right-contaner {
    padding-top: 72px;
    width: 100%;
    height: 100%;
    display: block;
    background-color: #F1F6F9;
    overflow-x: hidden;
    .main-box{
      height: calc(100% - 72px);
      overflow-y: auto;
    }
  }
</style>
