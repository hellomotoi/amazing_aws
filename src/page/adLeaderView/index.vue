<template>
  <div id="view">
    <top></top>
    <orderTab></orderTab>
    <div class="bottom">
      <activity class="activity"></activity>
      <related class="related"></related>
    </div>
    <edit-dialog></edit-dialog>
  </div>
</template>

<script>
  import top from './top';
  import orderTab from './orderTab/index';
  import editDialog from './editDialog';
  import activity from './activity';
  import related from './related';
  export default{
    components: {
      top,
      orderTab,
      editDialog,
      activity,
      related
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #view {
    border-left: solid 2px #F2F7FA;
    background: #fff;
    .bottom {
      display: flex;
      border-bottom: solid 2px #F2F7FA;
    }
    .tab-title {
      display: flex;
      justify-content: space-between;
      padding-left: 24px;
      border-bottom: solid 1px #eaeaea;
      font-size: 16px;
      color: #313131;
      .item {
        position: relative;
        bottom: -3px;
        display: inline-block;
        width: 80px;
        height: 70px;
        line-height: 70px;
        border-bottom: solid 4px #4a90e2;
        text-align: center;
      }
      .tab-fold-btn {
        transition: All 0.4s ease-in-out;
        display: block;
        width: 30px;
        height: 30px;
        margin: 21px 24px 0 0;
        background: url("../../images/fold_btn.png") no-repeat;
        background-size: contain;
        cursor: pointer;
        &.is-fold {
          transform: rotate(180deg);
        }
      }
    }
    .activity {
      width: 61.18%;
    }
    .related {
      width: 38.82%;
    }
  }
</style>
