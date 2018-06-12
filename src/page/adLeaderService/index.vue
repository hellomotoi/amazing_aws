<template>
  <div id="service">
    <top></top>
    <orderTab></orderTab>
    <edit-dialog></edit-dialog>
  </div>
</template>

<script>
  import top from './top';
  import orderTab from './orderTab/index';
  import editDialog from './editDialog';
  export default{
    components: {
      top,
      orderTab,
      editDialog
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #service {
    border-left: solid 2px #F2F7FA;
    background: #fff;
    .bottom {
      display: flex;
    }
  }
</style>
