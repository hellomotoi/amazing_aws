<template>
  <div id="sOrderTab">
    <!--订单跟进节点-->
    <div class="step-title">
      <div class="step-item-box"
           v-for="(item, index) in nodeList">
        <div class="step-item"
             :class="{
                  'handing': item.isCurrent,
                  'finished': !item.isCurrent&&item.status=='yes'
                }"
             @click="getStepList(item)">
            <span class="step-icon">
              <template v-if="item.isCurrent || item.status=='no'">
                {{index + 1}}
              </template>
            </span>
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
    <!--单个节点下的子节点信息-->
    <div class="step-content-box">
      <div class="step-item-box" v-for="(item, index) in stepList">
        <step-item :item-data="item" :currentNode="currentNode"></step-item>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import stepItem from './stepItem.vue'
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import {serviceStepList} from '../../../service/getData.js'
  import Bus from '../../../store/bus.js'
  export default{
    data(){
      return {
        foldTab    : false,
        isDisable  : false,
        nodeList   : [], //节点列表
        stepList   : [],  //子节点列表
        currentNode: {}
      }
    },
    components: {
      stepItem,
      CollapseTransition
    },
    computed  : {
      ...mapState(['userData'])
    },
    created(){
      /*获取节点并创建*/
      Bus.$off('creatNodeList');
      Bus.$on('creatNodeList', nodeList => {
        this.nodeList = nodeList;
        var isAllFinished = true; //用于判断任务是否全部完成
        for (var i = 0; i < this.nodeList.length; i++) {
          /*获取当前未完成的节点数据*/
          var item = this.nodeList[i];
          item.isCurrent = false;
          if (item.status == 'no') {
            isAllFinished = false;
            item.isCurrent = true;
            this.currentNode = item;
            break;
          }
        }
        if (isAllFinished) { //任务全部完成,默认获取第一个节点的数据
          this.currentNode = this.nodeList[0];
        }
        this.getStepList(this.currentNode);
      });
      /*TODO 监听编辑弹窗保存事件*/
      Bus.$off('stepSubmit');
      Bus.$on('stepSubmit', () => {
        this.getStepList(this.currentNode);
      });
    },
    methods   : {
      /*获取子节点信息*/
      getStepList(item){
        this.currentNode = item;
        this.changeCurrent();
        let data = {
          uid     : this.userData.userInfo.id,
          id      : this.$route.params.id,
          nodetype: this.currentNode.type,
          name    : this.currentNode.name
        };
        serviceStepList(data).then(res => {
          var data = res.data.data
          this.stepList = data;
        })
      },
      changeCurrent(){
        this.nodeList.forEach(i => {
          i.isCurrent = false;
        });
        this.currentNode.isCurrent = true;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #sOrderTab {
    border-bottom: solid 2px #F2F7FA;
    padding: 40px 0 0 24px;
    .step-title {
      padding-right: 24px;
      display: flex;
      justify-content: center;
      .step-item-box {
        display: flex;
        &:after {
          content: "";
          display: block;
          margin-top: 19px;
          width: 100px;
          height: 2px;
          background: #F1F6F9;
        }
        &:last-child {
          &:after {
            display: none;
          }
        }
        .step-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 80px;
          align-items: center;
          font-size: 14px;
          color: #313131;
          cursor: pointer;
          &.handing {
            color: #4990E2;
            .step-icon {
              background: #4990E2;
              color: #fff;
            }
          }
          &.finished {
            color: #48B111;
            .step-icon {
              background-color: #48B111;
              background-image: url("../../../images/followUp/end_icon.png");
              background-repeat: no-repeat;
              background-size: 20px 20px;
              background-position: center center;
            }
          }
          .step-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            width: 40px;
            height: 40px;
            background: #F1F6F9;
            border-radius: 50%;
          }
        }
      }
    }
    /*单个节点下的子节点信息*/
    .step-content-box {
      margin-top: 20px;
      .step-item-box {
        border-bottom: solid 1px #eaeaea;
        &:last-child {
          border-bottom: none 0;
        }
      }
    }
  }
</style>
