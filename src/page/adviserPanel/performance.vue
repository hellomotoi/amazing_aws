<template>
  <div class="performance">
    <div class="title">
      <span>当前业绩</span>
      <ul>
        <li v-for="item in typeList" @click="currentTypeList(item.dayNum)"
            :class="{currentClass: item.dayNum == currentType}">
          {{item.text}}
        </li>
      </ul>
      <el-date-picker
        v-model="datePickerValue"
        type="daterange"
        range-separator=" 至 "
        placeholder="选择日期范围"
        @change="datePickHandle">
      </el-date-picker>
    </div>
    <div class="content">
      <ul>
        <li>分配商机数<span>30</span></li>
        <li>待预约<span>30</span></li>
        <li>待进店<span>30</span></li>
        <li>筹备中<span>30</span></li>
        <li>申请丢单<span>30</span></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        typeList   : [
          {
            text  : '全部',
            dayNum: -1
          }, {
            text  : '一周',
            dayNum: 7
          }, {
            text  : '两周',
            dayNum: 14
          }, {
            text  : '四周',
            dayNum: 28
          }
        ], // 场景列表
        currentType: this.$store.state.type ? this.$store.state.type : -1, // 当前选中场景
      }
    },
    props     : [],
    computed  : {},
    components: {},
    created(){
    },
    mounted(){
    },
    methods   : {},
    watch     : {}
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .performance {
    padding: 19px 25px;
    .title {
      display: flex;
      align-items: center;
      span {
        font-size: 18px;
        color: #222222;
      }
      ul {
        display: flex;
        align-items: center;
        margin-left: 23px;
        li {
          height: 30px;
          font-size: 13px;
          line-height: 30px;
          color: #6F6F6F;
          letter-spacing: 0;
          text-align: center;
          border-radius: 4px;
          margin-left: 10px;
          cursor: pointer;
          padding: 0 10px;
        }
        .currentClass {
          background-color: rgba(74, 144, 226, 1);
          color: #fff;
        }
      }
      .el-date-editor {
        margin-left: 37px;
        width: 220px !important;
        height: 30px;
        input {
          height: 30px;
          line-height: 28px;
          font-size: 14px;
          color: #6F6F6F;
        }
      }
    }
    .content{
      padding-top: 18px;
      ul{
        display: flex;
        align-items: center;
        li{
          margin-left: 65px;
          font-size: 16px;
          color: #4A4A4A;
          &:first-child{
            margin-left: 0;
          }
          span{
            margin-left: 12px;
          }
        }
      }
    }
  }
</style>
