<template>
  <div class="wrap">
    <div class="default">
      敬请期待
    </div>
    <!--<bread></bread>
    <performance class="box"></performance>
    <div class="main-box">
      <handleBox class="box" title="待我处理的"></handleBox>
      <handleBox class="box" title="最近处理的"></handleBox>
    </div>-->
  </div>
</template>
<script>
  import bread from '../../components/bread'
  import performance from './performance'
  import handleBox from './handleBox'
  export default{
    data(){
      return {}
    },
    props     : [],
    computed  : {},
    components: {
      bread,
      performance,
      handleBox
    },
    created(){
    },
    mounted(){
    },
    methods   : {},
    watch     : {}
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap {
    padding: 0 24px;
    height: 100%;
    .default{
      display: flex;
      margin: 0 auto;
      width: 50%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 30px;
    }
    .box {
      background: #FFFFFF;
      border-radius: 6px;
    }
    .main-box{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      height: calc(100% - 213px);
      margin-top: 20px;
      padding-bottom: 20px;
      .box{
        flex-grow: 1;
        width: 50%;
        height: 100%;
        &:last-child{
          margin-left: 20px;
        }
      }
    }
  }
</style>
