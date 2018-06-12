<template>
  <div class="step-item">
    <div class="title">
      <span class="step-fold-btn" :class="{'is-fold': foldStep}" @click="foldStep = !foldStep"></span>
      <h4>{{itemData.title}}</h4>
      <span class="status" :class="itemData.status">{{itemData.showStatus}}</span>
      <!--<span class="status yes"></span>-->
      <div class="edit-box">
        <!--编辑-->
        <span class="edit-btn disable" v-if="itemData.boxnum != 7"></span>
        <!--开关-->
        <p class="switch-box disable" v-if="itemData.flag == 7">
          <!--不可用-->
          <span class="el-switch__core disable"
                :class="{'on':itemData.value == 2}">
            <span class="el-switch__button">
            </span>
          </span>
        </p>
      </div>
    </div>
    <collapse-transition>
      <div class="content"
           :class="{
             'col-1' : itemData.flag == 1,
             'col-2' : itemData.flag == 2,
             'col-3' : itemData.flag == 3}"
           v-show="!foldStep && itemData.listData.length>0">
        <dl v-for="item in itemData.listData" v-if="itemData.boxnum!=777 && itemData.boxnum!=888">
          <dt>{{item.name}}</dt>
          <dd>{{item.value}}</dd>
        </dl>
        <!--合同-->
        <dl v-for="item in itemData.listData"
            v-if="(itemData.boxnum==777 || itemData.boxnum==888) && item.name">
          <dt v-if="!item.value">{{item.name}}</dt>
          <a class="el-upload-list__item-name"
             :href="item.value"
             target="_blank"
             v-if="item.value">
            <i class="el-icon-document"></i>{{item.name}}
          </a>
        </dl>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import Bus from '../../../store/bus.js'
  export default{
    data(){
      return {
        foldStep: false
      }
    },
    props     : [
      'itemData',
      'currentNode'
    ],
    computed  : {},
    components: {
      CollapseTransition
    },
    methods   : {}
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #view {
    .step-item {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 0;
        .step-fold-btn {
          transition: All 0.4s ease-in-out;
          flex-shrink: 0;
          display: block;
          width: 20px;
          height: 20px;
          background: url("../../../images/fold_btn.png") no-repeat;
          background-size: contain;
          cursor: pointer;
          &.is-fold {
            transform: rotate(180deg);
          }
        }
        h4 {
          flex-shrink: 0;
          margin-left: 10px;
          font-size: 16px;
          color: #313131;
        }
        .status {
          flex-shrink: 0;
          margin-left: 10px;
          padding: 4px 14px;
          border-radius: 4px;
          font-size: 12px;
          &.yes {
            background: #f2f9ee;
            color: #48B111;
          }
          &.no {
            background: #fcf2f3;
            color: #D0011B;
          }
        }
        .edit-box {
          flex-grow: 1;
          margin-right: 24px;
          height: 30px;
          text-align: right;
          .edit-btn {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url("../../../images/edit_btn.png") no-repeat;
            background-size: contain;
            cursor: pointer;
            &.disable {
              background: url("../../../images/edit_btn_no.png") no-repeat;
              background-size: contain;
              cursor: not-allowed;
            }
          }
          .switch-box {
            .el-switch__core {
              border-color: #f1f6f9;
              background: #f1f6f9;
              &.disable {
                border-color: #e4e8f1 !important;
                background: #e4e8f1 !important;
                cursor: not-allowed;
              }
              &.on {
                border-color: #50ad31;
                background-color: #50ad31;
                .el-switch__button {
                  transform: translate(28px, 2px);
                }
              }
              .el-switch__button {
                top: -4px;
                left: -4px;
                width: 24px;
                height: 24px;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
                transform: translate(2px, 2px);
              }
            }
          }
        }
      }
      .content {
        display: block;
        margin-left: 30px;
        &.col-1 {
          dl {
            display: flex;
            width: 100%;
            margin: 0 70px 8px 0;
            line-height: 28px;
            &:last-child {
              padding-bottom: 15px;
            }
            dt {
              flex-shrink: 0;
              margin-right: 30px;
              font-size: 14px;
              color: #919191;
            }
            dd {
              margin-right: 24px;
              font-size: 14px;
              color: #313131;
            }
            a.el-upload-list__item-name {
              font-size: 14px;
              color: #4990E2;
              text-decoration: underline;
            }
          }
        }
        &.col-2 {
          width: 720px;
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 15px;
          dl {
            display: flex;
            margin: 0 20px 8px 0;
            line-height: 28px;
            dt {
              width: 70px;
              margin-right: 30px;
              font-size: 14px;
              color: #919191;
            }
            dd {
              width: 240px;
              font-size: 14px;
              color: #313131;
            }
          }
        }
        &.col-3 {
          dl {
            display: block;
            width: 100%;
            margin: 0 70px 8px 0;
            line-height: 20px;
            &:last-child {
              padding-bottom: 15px;
            }
            dt {
              margin-bottom: 4px;
              margin-right: 30px;
              font-size: 14px;
              color: #919191;
            }
            dd {
              width: 672px;
              margin-bottom: 24px;
              margin-right: 24px;
              font-size: 14px;
              color: #313131;
            }
            a.el-upload-list__item-name {
              font-size: 14px;
              color: #4990E2;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>
