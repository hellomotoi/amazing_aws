<!--输入框右侧错误提示-->
<template>
  <div class="input-tips"
       :class="{'is-show':isShow,
                'hidOpacity': !hidType || hidType=='opacity',
                'hidDisplay': hidType=='display'}">
    <div class="tips-box">
      <div class="el-alert-box">
        <i class="el-alert__icon el-icon-warning"></i>
        <span>{{msg}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props: [
      'msg',
      'isShow',
      'hidType'  //隐藏方式: opacity-透明度置零(默认), display-不显示
    ]
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .input-tips {
    &.hidOpacity {
      opacity: 0;
      &.is-show {
        opacity: 1;
      }
    }
    &.hidDisplay {
      display: none;
      &.is-show {
        display: inline-block;
      }
    }
    .tips-box {
      display: flex;
      align-items: center;
      width: 200px;
      .el-alert-box {
        display: flex;
        align-items: center;
        height: 30px;
        background: #fcf2f3;
        border-radius: 4px;
        font-size: 12px;
        color: #D0011B;
        .el-alert__icon {
          margin: 0 5px 0 10px;
          color: #eba6af;
        }
        span {
          margin-right: 13px;
        }
      }
    }
  }
</style>
