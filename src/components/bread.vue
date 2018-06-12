<!--右侧页面标题-->
<template>
  <div class="bread">
    <h4 class="current-page">
      <span class="go-back" @click="goBack" v-if="hasGoBack">
        <i class="el-icon-arrow-left"></i>
      </span>
      {{title ? title : ($store.state.currentMenu && $store.state.currentMenu.authName)}}
    </h4>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default{
    data(){
      return {
        currentMenu: {}
      }
    },
    props     : [
      'title',
      'hasGoBack'
    ],
    computed  : {
      ...mapState(['authData'])
    },
    components: {},
    created(){
      this.getCurrentMenu();
    },
    mounted(){
    },
    methods   : {
      goBack(){
        this.$router.push('/adviserLeader/manage');
      },
      getCurrentMenu(data){
        let arr = data ? data : this.authData;
        arr.forEach(item => {
          if(item.page == this.$route.fullPath){
            this.currentMenu = item;
            this.$store.state.currentMenu = this.currentMenu;
            console.log(this.currentMenu.authName)
          }
          if(item.children && item.children.length){
            this.getCurrentMenu(item.children);
          }
        })
      },
    },
    watch     : {
      $route(val) {
        this.getCurrentMenu();
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  /*右侧页面标题*/
  .bread {
    .current-page {
      position: relative;
      z-index: 2;
      font-size: 18px;
      color: #222222;
      letter-spacing: 0;
      padding: 29px 0 24px 0;
      background-color: #F2F7FA;
      .go-back {
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          color: #ACACAC;
        }
      }
    }
  }
</style>
