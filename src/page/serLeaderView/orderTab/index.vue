<template>
  <div id="orderTab">
    <div class="tab-title">
      <span class="item">订单跟进</span>
      <span class="tab-fold-btn" :class="{'is-fold': foldTab}" @click="foldTab = !foldTab"></span>
    </div>
    <collapse-transition>
      <div class="tab-content" v-show="!foldTab">
        <!--订单跟进节点-->
        <div class="step-title-box">
          <ul class="step-title">
            <li class="step-item"
                v-for="item in nodeList"
                :class="{
                'handing': item.completion=='present',
                'finished': item.completion=='past'
              }">
              <span v-if="item.completion!='past'" @click="getStepList(item)">{{item.name}}</span>
              <el-tooltip
                v-else-if="item.completion=='past'"
                effect="light"
                placement="bottom"
                :enterable="true">
                <span @click="getStepList(item)">{{item.name}}</span>
                <div slot="content">
                  <div class="tips-title">{{item.name}}</div>
                  <div class="tips-desc" v-if="item.used_time">总用时:{{item.used_time}}</div>
                </div>
              </el-tooltip>
            </li>
          </ul>
          <div class="complete-btn disable">
            将阶段标记为完成
          </div>
        </div>
        <!--单个节点下的子节点信息-->
        <div class="step-content-box">
          <div class="step-item-box" v-for="(item, index) in stepList">
            <step-item :item-data="item" :currentNode="currentNode"></step-item>
          </div>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import stepItem from './stepItem.vue'
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import {adviserStepList, adviserNodeSubmit} from '../../../service/getData.js'
  import Bus from '../../../store/bus.js'
  export default{
    data(){
      return {
        foldTab    : true, //this.$route.params.target === 'callback' ? true : false,
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
        this.nodeList.forEach(item => {
          if (item.completion == 'present') {
            this.getStepList(item);
          }
        });
        let lastNode = this.nodeList[this.nodeList.length - 1];
        if (lastNode.completion == 'past') {
          this.getStepList(lastNode);
        }
      });
      /*TODO 监听编辑弹窗保存事件*/
      Bus.$off('stepSubmit');
      Bus.$on('stepSubmit', () => {
        console.log('重复调用');
        this.getStepList(this.currentNode);
      });
    },
    methods   : {
      /*获取子节点信息*/
      getStepList(item){
        this.currentNode = item;
        let data = {
          id      : this.$route.params.id,
          nodetype: item.type,
          name    : item.name
        };
        adviserStepList(data).then(res => {
          var data = res.data.data
          this.stepList = data;
        })
      },
      /*标记主节点为完成*/
      submit(){
        if (this.currentNode.completion == 'future') return;
        let status = '';
        switch (this.currentNode.type) {
          case 'order':
            status = 13;
            break;
          case 'inStore':
            status = 2;
            break;
          case 'contract':
            status = 6;
            break;
          case 'inPreparation':
            status = 8;
            break;
          case 'toBefiled':
            status = 9;
            break;
        }
        let data = {
          uid     : this.userData.userInfo.id,
          id      : this.$route.params.id,
          nodetype: this.currentNode.type,
          status  : status
        };
        adviserNodeSubmit(data).then(res => {
          if (res.data.code != 200) {
            this.$message({
              message    : res.data.message,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
          } else {
            Bus.$emit('menuTotal');
            Bus.$emit('refreshOrderInfo');
          }
        });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .el-tooltip__popper {
    position: absolute;
    border-radius: 6px;
    padding: 13px 45px;
    z-index: 2000;
    font-size: 12px;
    line-height: 1.2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    .tips-title {
      font-weight: bold;
      font-size: 14px;
      color: #313131;
    }
    .tips-desc {
      margin-top: 7px;
      font-size: 12px;
      color: #B0B0B0;
    }
  }
  .el-tooltip__popper.is-light {
    background: #fff;
    border: 1px solid #dfdfdf
  }
  .el-tooltip__popper .popper__arrow, .el-tooltip__popper .popper__arrow::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid
  }
  .el-tooltip__popper .popper__arrow {
    border-width: 12px
  }
  .el-tooltip__popper .popper__arrow::after {
    content: " ";
    border-width: 11px
  }
  .el-tooltip__popper.is-light {
    background: #fff;
    border: 1px solid #dfdfdf;
  }
  .el-tooltip__popper[x-placement^=top] {
    margin-bottom: 19px
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow {
    bottom: -12px;
    border-top-color: #1f2d3d;
    border-bottom-width: 0
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow::after {
    bottom: 1px;
    margin-left: -11px;
    border-top-color: #1f2d3d;
    border-bottom-width: 0
  }
  .el-tooltip__popper[x-placement^=bottom] {
    margin-top: 19px
  }
  .el-tooltip__popper[x-placement^=bottom] .popper__arrow {
    top: -12px;
    border-top-width: 0;
    border-bottom-color: #dfdfdf
  }
  .el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {
    top: 1px;
    margin-left: -11px;
    border-top-width: 0;
    border-bottom-color: #dfdfdf
  }
  .el-tooltip__popper[x-placement^=right] {
    margin-left: 12px
  }
  .el-tooltip__popper[x-placement^=right] .popper__arrow {
    left: -12px;
    border-right-color: #dfdfdf;
    border-left-width: 0
  }
  .el-tooltip__popper[x-placement^=right] .popper__arrow::after {
    bottom: -11px;
    left: 1px;
    border-right-color: #dfdfdf;
    border-left-width: 0
  }
  .el-tooltip__popper[x-placement^=left] {
    margin-right: 12px
  }
  .el-tooltip__popper[x-placement^=left] .popper__arrow {
    right: -12px;
    border-right-width: 0;
    border-left-color: #dfdfdf
  }
  .el-tooltip__popper[x-placement^=left] .popper__arrow::after {
    right: 1px;
    bottom: -11px;
    margin-left: -11px;
    border-right-width: 0;
    border-left-color: #dfdfdf
  }
  .el-tooltip__popper.is-light[x-placement^=top] .popper__arrow {
    border-top-color: #dfdfdf
  }
  .el-tooltip__popper.is-light[x-placement^=top] .popper__arrow::after {
    border-top-color: #fff
  }
  .el-tooltip__popper.is-light[x-placement^=bottom] .popper__arrow {
    border-bottom-color: #dfdfdf
  }
  .el-tooltip__popper.is-light[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #fff
  }
  .el-tooltip__popper.is-light[x-placement^=left] .popper__arrow {
    border-left-color: #dfdfdf
  }
  .el-tooltip__popper.is-light[x-placement^=left] .popper__arrow::after {
    border-left-color: #fff
  }
  .el-tooltip__popper.is-light[x-placement^=right] .popper__arrow {
    border-right-color: #dfdfdf
  }
  .el-tooltip__popper.is-light[x-placement^=right] .popper__arrow::after {
    border-right-color: #fff
  }
  #orderTab {
    border-bottom: solid 2px #F2F7FA;
    .tab-content {
      padding: 31px 0 0 24px;
      .step-title-box {
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
        .step-title {
          display: flex;
          .step-item {
            position: relative;
            margin-left: -28px;
            width: 190px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: url("../../../images/followUp/step2_default.png") no-repeat;
            background-size: contain;
            span {
              position: relative;
              left: -5px;
              display: inline-block;
              height: 40px;
              line-height: 40px;
              padding: 0 30px 0 30px;
              cursor: pointer;
            }
            &.handing {
              color: #fff;
              background: url("../../../images/followUp/step2_working.png") no-repeat;
              background-size: contain;
            }
            &.finished {
              background: url("../../../images/followUp/step2_end.png") no-repeat;
              background-size: contain;
              span {
                opacity: 0;
              }
            }
            &:first-child {
              margin-left: 0;
              background: url("../../../images/followUp/step1_default.png") no-repeat;
              background-size: contain;
              &.handing {
                color: #fff;
                background: url("../../../images/followUp/step1_working.png") no-repeat;
                background-size: contain;
              }
              &.finished {
                background: url("../../../images/followUp/step1_end.png") no-repeat;
                background-size: contain;
              }
            }
            &:last-child {
              background: url("../../../images/followUp/step3_default.png") no-repeat;
              background-size: contain;
              &.handing {
                color: #fff;
                background: url("../../../images/followUp/step3_working.png") no-repeat;
                background-size: contain;
              }
              &.finished {
                background: url("../../../images/followUp/step3_end.png") no-repeat;
                background-size: contain;
              }
            }
          }
        }
        .complete-btn {
          height: 40px;
          line-height: 40px;
          padding: 0 22px 0 22px;
          margin-right: 24px;
          border-radius: 20px;
          background: #48b111;
          font-size: 14px;
          color: #FFFFFF;
          cursor: pointer;
          &:hover {
            background: #96cf7a;
          }
          &.disable {
            background: #d8d8d8;
            cursor: not-allowed;
            &:hover {
              background: #d8d8d8;
            }
          }
        }
      }
      .step-content-box {
        .step-item-box {
          border-bottom: solid 1px #eaeaea;
          &:last-child {
            border-bottom: none 0;
          }
        }
      }
    }
  }
</style>
