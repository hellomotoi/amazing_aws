<template>
  <div id='assigns'>
    <bread></bread>
    <div class="content">
      <div class="left-side">
        <assignment-list :iH="iH"></assignment-list>
      </div>
      <div class="right-side">
        <assignment-view :iH="iH"></assignment-view>
      </div>
    </div>
    <allotWindow></allotWindow>
  </div>
</template>
<script>
  import bread from '../../components/bread.vue'
  import assignmentList from './list'
  import assignmentView from './view'
  import allotWindow from '../../components/window/allotWindow.vue'
  var timer = null;
  export default {
    props     : [
      'iH'
    ],
    components: {
      bread,
      assignmentList,
      assignmentView,
      allotWindow
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scope>
  #assigns {
    position: relative;
  }
  #assigns {
    padding: 0 20px;
    header {
      p {
        font-size: 18px;
        color: #313131;
        font-weight: 600;
        float: left;
      }
      button {
        float: right;
        background: #4A90E2;
        border-radius: 4px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        span {
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
  }
  .content {
    display: flex;
    .left-side {
      width: 64.6%;
    }
    .right-side {
      width: 34.4%;
      margin: 0 0 10px 10px;
      padding: 0 0 15px 0;
      border-radius: 6px;
      background: #fff;

    }
  }
</style>
