<template>
  <div id="assignmentView">
    <div class="title" v-if="viewId">
      <div class="left-box">
        <h4>No.{{viewId}}</h4>
        <span>待分配</span>
      </div>
      <div class="right-box">
        <el-button class="el-button--primary assigns-btn"
                   @click='assignsHandle'>分配
        </el-button>
      </div>
    </div>
    <div class="content" :style="{ 'height': maxHeight + 'px' }" v-if="viewId">
      <h5>客户信息</h5>
      <dl v-for="item in userInfo">
        <dt>{{item.name}}</dt>
        <dd>{{item.value}}</dd>
      </dl>
      <div class="line"></div>
      <h5>系统信息</h5>
      <dl v-for="item in sysInfo">
        <dt>{{item.name}}</dt>
        <dd>{{item.value}}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {getAssignmentView} from '../../service/getData.js'
  import Bus from '../../store/bus';
  export default {
    data() {
      return {
        userInfo    : {},
        sysInfo     : {},
        viewId      : '',
        noListHeight: window.innerHeight - this.iH.common - 27,
        maxHeight   : window.innerHeight - this.iH.common - 129
      }
    },
    props   : [
      'iH'
    ],
    computed: {
      clueIds(){
        return [this.viewId];
      }
    },
    created() {
      Bus.$off('changeView');
      Bus.$on('changeView', viewId => {
        this.viewId = viewId;
        if (!viewId) return;
        // 获取详情
        getAssignmentView({type: 'assignment', id: viewId})
          .then(res => {
            var res = res.data;
            this.userInfo = res.data.userinfo;
            this.sysInfo = res.data.sysinfo;
          })
      });
    },
    methods : {
      // 分配
      assignsHandle(){
        console.log(this.clueIds);
        Bus.$emit('openDialog', this.clueIds);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #assignmentView {
    padding: 13px 0 0;
    .no-list {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 14px;
      color: #5e7382;
    }
    .title {
      display: flex;
      justify-content: space-between;
      border-bottom: solid 2px #F2F7FA;
      padding: 0 25px 12px 30px;
      box-sizing: border-box;
      box-align: center;
      align-items: center;
      align-content: center;
      .left-box {
        h4 {
          margin-bottom: 6px;
          font-weight: inherit;
          font-size: 16px;
          color: #313131;
        }
        span {
          display: inline-block;
          margin-top: 6px;
          padding: 0 14px;
          background: #E9F1FC;
          border-radius: 4px;
          font-size: 12px;
          color: #4990E2;
          line-height: 20px;
        }
      }
      .right-box {
        .assigns-btn {
          width: 80px;
          height: 30px;
          line-height: 30px;
          padding: 0;
        }
      }
    }
    .content {
      display: block;
      padding: 20px 0 20px 30px;
      line-height: 30px;
      overflow-x: hidden;
      overflow-y: auto;
      h5 {
        font-weight: inherit;
        font-size: 16px;
        color: #313131;
      }
      dl {
        line-height: 30px!important;
        display: flex;
        padding: 2px 23px 2px 0;
        dt {
          display: block;
          width: 64px;
          font-size: 14px;
          color: #919191;
          flex-shrink: 0;
        }
        dd {
          display: block;
          margin-left: 30px;
          font-size: 14px;
          color: #313131;
          letter-spacing: 0;
        }
      }
      .line {
        margin: 15px 0;
        height: 0px;
        opacity: 0.2;
        border-bottom: 1px solid #979797;
      }
    }
  }
</style>
