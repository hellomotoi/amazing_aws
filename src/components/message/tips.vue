<template>
  <div class="message-tips">
    <!--<div class="tips">
      <i></i>
      <span>2条新留言</span>
    </div>-->
    <div class="tips tips-default" @click="showMessageBox">
      <span>留言通知</span>
      <i></i>
    </div>
    <messageLayout></messageLayout>
  </div>
</template>
<script>
  import Bus from '../../store/bus.js'
  import {getMsgWin} from '../../service/getData.js'
  import messageLayout from './layout.vue';
  export default{
    data(){
      return {}
    },
    props     : [],
    computed  : {},
    components: {
      messageLayout
    },
    created(){
      Bus.$off('messageRefresh');
      Bus.$on('messageRefresh', ()=>{ //轮询

      })
    },
    mounted(){
    },
    methods   : {
      showMessageBox(){
        Bus.$emit('showMessageBox');
      }
    },
    watch     : {}
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .message-tips {
    .tips{
      position: fixed;
      z-index: 10001;
      bottom: 0;
      right: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 70px 0 61px;
      border: 1px solid #266DC0;
      box-shadow: 0 -5px 10px 0 rgba(74,74,74,0.17);
      border-radius: 4px 4px 0 0;
      font-size: 14px;
      color: #FFFFFF;
      background: #4A90E2;
      cursor: pointer;
      i{
        margin-right: 14px;
        width: 20px;
        height: 16px;
        background: url("../../images/message/map.png") no-repeat;
        background-size: contain;
      }
    }
    .tips-default{
      position: fixed;
      z-index: 10001;
      bottom: 0;
      right: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 79px 0 85px;
      border: 1px solid #CBCBCB;
      box-shadow: 0 -5px 10px 0 rgba(74,74,74,0.17);
      border-radius: 4px 4px 0 0;
      font-size: 14px;
      color: #5B5B5B;
      background: #FFFFFF;
      cursor: pointer;
      i{
        margin-left: 9px;
        width: 11px;
        height: 6px;
        background: url("../../images/message/triangle.png") no-repeat;
        background-size: contain;
      }
    }
  }
</style>
