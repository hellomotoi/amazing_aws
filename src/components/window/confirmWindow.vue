<!--录入确认弹窗-->
<template>
  <el-dialog id='commitWin'
             :closeOnClickModal="false"
             :title="title"
             v-model="dialogVisible"
             size="tiny">
    <span>{{content}}</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure()">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    data(){
      return {
        dialogVisible: false
      }
    },
    created(){
    },
    mounted(){
    },
    props   : ['commitVisible', 'title', 'content', 'type'],
    computed: {},
    methods : {
      sure(){
        this.dialogVisible = false;
        if (this.type == 1) {
          this.$router.push(`/check/${this.$route.params.target}`);
        }
        else {
          this.$emit('doSubmit');
        }
      }
    },
    watch   : {
      commitVisible(){
        if (!this.dialogVisible)
          this.dialogVisible = true;
      }
    }
  }

</script>

<style lang="scss">
  #commitWin {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);

    button {
      width: 109px;
      height: 34px;
    }
  }
  #commitWin .el-dialog__body {
    text-align: center;
    font-size: 18px;
    color: #343434;
    padding: 55px 20px;
  }
  #commitWin .el-dialog__header {
    padding: 16px 20px 16px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }
  #commitWin .el-dialog__footer {
    padding: 22px 20px 22px;
    border-top: 1px solid rgba(151, 151, 151, 0.2);
  }
  #commitWin .el-dialog__title {
    font-size: 16px;
    color: #343434;
    font-weight: 500;
  }
  #commitWin .el-dialog__headerbtn {
    display: none;
  }
</style>
