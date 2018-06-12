<template>
  <div class="wrap">
    <!--场景-->
    <div class="search-title" v-if="typeList && typeList.length">
      <span>场景</span>
      <ul>
        <li v-for="item in typeList">
          <div  class="type-item"
                v-if="item.key != 'datePicker'"
                @click="changeCurrentType(item.key)"
                :class="{currentClass: item.key == uCurrentType}">
            {{item.value}}<em v-if="item.total">({{item.total}})</em>
          </div>
          <div v-if="item.key == 'datePicker'">
            <el-date-picker
              v-if="datePicker"
              v-model="datePickerValue"
              type="daterange"
              range-separator=" 至 "
              placeholder="选择日期范围"
              @change="datePickHandle">
            </el-date-picker>
          </div>
        </li>
      </ul>
    </div>
    <!--批量操作区域-->
    <div class="table-header"
         v-if="optList&&optList.length"
         v-show="tableData.length">
      <el-button
        v-for="item in optList"
        @click="item.handleClick"
        :disabled="item.disabled"
        :class="{
          'hide' : typeof item.showBtn == 'undefined' ? false : !item.showBtn
        }">{{item.text}}
      </el-button>
    </div>
    <!--表格-->
    <el-table class="main-table"
              style="width: 100%"
              highlight-current-row
              tooltip-effect="dark"
              v-loading.body="loading"
              :data="tableData"
              :border="false"
              :height="tableHeight"
              @cell-mouse-enter="handleCellMouseEnterFn"
              @row-click="handleRowClickFn"
              @selection-change="handleSelectionChangeFn">
      <el-table-column
        width="50"
        data-demo="opt"
        type="selection"
        v-if="hasSelection"
        :selectable="rowSelectable">
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableTitle"
        :width="index == ''? 120 : 'auto'"
        :prop="index"
        :label="item">
        <template scope="scope">
          <div>
            <!--客户姓名-->
            <div v-if="index == 'name'">
              <div class="name-icon-box">
                <!-- <div class="name-icon" v-if="Object.prototype.toString.call(scope.row.name)=='[object String]'">
                  {{scope.row.name.substring(0, 1)}}
                </div> -->
                <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="bottom">
                  <div class="name-show">
                    {{scope.row.name ? scope.row.name : '--'}}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <!--订单状态-->
            <div v-else-if="index == 'orderStatus'">
              <div class="taskStatus" :class="scope.row.statusType">
                <span>{{scope.row.orderStatus ? scope.row.orderStatus : '--'}}</span>
              </div>
            </div>
            <!--删除-->
            <div v-else-if="index == 'optDel'">
              <i class=" operate"
                 style="cursor: pointer;width:28px;height:28px; display: block;margin: 0 auto;"
                 @click.stop="handleRowDeleteFn(scope.$index, scope.row, tableData)">
                <img src="../images/remove.png">
              </i>
            </div>
            <!--备注-->
            <div v-else-if="index == 'remark'" class="mark-img-box">
              <el-popover v-if='scope.row.remark != ""'
                          placement="bottom-end"
                          width="280"
                          :title="tableTitle['remark']"
                          trigger="hover">
                {{scope.row.remark}}
                <i class="mark-img" slot="reference">
                  <img src="../images/mark.png">
                </i>
              </el-popover>
              <div v-if="scope.row.remark == ''">--</div>
            </div>
            <!--废弃&丢单原因-->
            <div v-else-if="index == 'lost_reason'" class="mark-img-box">
              <el-popover v-if='scope.row.lost_reason != ""'
                          placement="bottom-end"
                          width="280"
                          :title="tableTitle['lost_reason']"
                          trigger="hover">
                {{scope.row.lost_reason}}
                <i class="mark-img" slot="reference">
                  <img src="../images/mark.png">
                </i>
              </el-popover>
              <div v-if="scope.row.lost_reason == ''">--</div>
            </div>
            <!--跟进记录-->
            <div v-else-if="index == 'follow_time'" class="mark-img-box">
              {{scope.row.follow_time}}
              <el-popover placement="bottom-end"
                          width="280"
                          trigger="hover"
                          v-if="scope.row.follow_time != '未跟进'"
                          :title='scope.row.name+" 跟进记录"'>
                <ul class='log-list'>
                  <li v-for="item in scope.row.optlogList">
                    <div class="clearfix user-info">
                      <p>{{item.create_time}}</p>
                      <p>
                        <span class="name">{{item.name}}</span>
                        <span>&nbsp;{{item.done}}</span>
                      </p>
                    </div>
                  </li>
                </ul>
                <i class="mark-img" slot="reference">
                  <img src="../images/mark.png">
                </i>
              </el-popover>
            </div>
            <!--丢单记录-->
            <div v-else-if="index == 'lost_list'" class="mark-img-box">
              <el-popover placement="bottom-end"
                          width="280"
                          trigger="hover"
                          v-if="scope.row.lost_list.length"
                          :title='scope.row.name+" 丢单记录"'>
                <ul class='log-list'>
                  <li v-for="item in scope.row.lost_list">
                    <div class="clearfix user-info">
                      <p class="time">{{item.time}}</p>
                      <p class="name">{{item.name}}</p>
                      <p class="desc">{{item.description}}</p>
                    </div>
                  </li>
                </ul>
                <i class="mark-img" slot="reference">
                  <img src="../images/mark.png">
                </i>
              </el-popover>
            </div>
            <div v-else>
              <div v-if="scope.row[index] === '0%'" class="disabled">
                0%
              </div>
              <div v-else-if="scope.row[index] === 0" class="disabled">
                0
              </div>
              <div v-else-if="!scope.row[index]">
                --
              </div>
              <div v-else :class="{'active' : tableDataActive ? (tableDataActive.indexOf(index) != -1) : false}">
                {{scope.row[index]}}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handlePaginationChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="pageTotal"
      class="pagination-styles">
    </el-pagination>
  </div>
</template>
<script>
  /**
   *
   * 传入参数：
   * 'loading',
   * 'optList',              //批量操作按钮 [Array]
   *    optList: [{
   *      'text':'删除线索',               //按钮文字 [String]
   *      'handleClick': batchDelHandle,  //按钮点击事件 [Function]
   *      'disabled': false               //禁用按钮 [Boolean]
   *      'showBtn': ''                   //按钮显示控制 [Boolean] 默认显示
   *    }]
   * 'typeList',             //场景 [Array]
   * 'currentType'           //主动设置当前场景key [String]
   * 'tableTitle',           //表头 [Object]
   * 'tableData',            //表数据 [Array]
   * 'tableDataActive'       //高亮字段 [Array] 非(0、0%、--)时高亮
   * 'pageTotal',            //表数据总条数 [Number]
   * 'hasSelection',         //是否需要多选框 [Boolean]
   * 'rowSelectable',        //行是否允许选择 [Boolean]
   * 'handleRowDelete',      //行删除  [Function]
   * 'handleCellMouseEnter', //单元格hover事件 [Function]
   * 'handleRowClick',       //行click事件 [Function]
   * 'handleSelectionChange' //多选change事件 [Function]
   *
   *
   * Bus触发事件：
   * 'handleTypeChange'        //切换当前场景（参数：当前场景type）
   * 'handlePaginationChange'  //切换分页（参数：当前page）
   *
   */
  import Bus from '../store/bus'
  import moment from 'moment';
  export default{
    data(){
      return {
        iH               : {
          common     : 74 + 71 + 20,  //top + 页面标题 + 底部留空
          opt: 68,  //头部操作按钮
          tab: 62,  //场景
          pagination : 52    //分页
        },
        uCurrentType      : '',
        currentPage      : 1,
        multipleSelection: [],
        datePickerValue: ''
      }
    },
    props     : [
      /**
       * 批量操作按钮 [Array]
       * optList: [{
       *   'text':'删除线索',               //按钮文字 [String]
       *   'handleClick': batchDelHandle,  //按钮点击事件 [Function]
       *   'disabled': false               //禁用按钮 [Boolean]
       *   'showBtn': false                //按钮显示控制 [Boolean]
       * }]
       */
      'loading',
      'optList',
      'typeList',
      'currentType',
      'datePicker',
      'tableTitle',
      'tableData',
      'tableDataActive',
      'pageTotal',
      'hasSelection',
      'rowSelectable',
      'handleRowDelete',
      'handleCellMouseEnter',
      'handleRowClick',
      'handleSelectionChange'
    ],
    computed  : {
      tableHeight(){
        let iHeight = window.innerHeight - this.iH.common;
        if(this.optList&&this.optList.length){
          iHeight -= this.iH.opt;
        }
        if(this.typeList&&this.typeList.length){
          iHeight -= this.iH.tab;
        }
        if(this.pageTotal){
          iHeight -= this.iH.pagination;
        }
        return iHeight;
      }
    },
    components: {},
    created(){
    },
    mounted(){
      console.log(this.typeList)
    },
    methods   : {
      /*作为props内handle方法未传递时的默认执行方法*/
      defaultFn(){
      },
      handleRowDeleteFn(){
        this.handleRowDelete?this.handleRowDelete(...arguments):this.defaultFn();
      },
      handleCellMouseEnterFn(){
        this.handleCellMouseEnter?this.handleCellMouseEnter(...arguments):this.defaultFn();
      },
      handleRowClickFn(){
        /*checkbox不允许点击*/
        if ('el-checkbox__inner'.indexOf(event.target.classList) != -1) return;
        if ('el-checkbox__original'.indexOf(event.target.classList) != -1) return;
        this.handleRowClick?this.handleRowClick(...arguments):this.defaultFn();
      },
      /*多选事件handle*/
      handleSelectionChangeFn(val){
        if (val.length) {
          this.optList.map(item => {
            item.disabled = false;
          })
        } else {
          this.optList.map(item => {
            item.disabled = true;
          })
        }
        this.handleSelectionChange?this.handleSelectionChange(...arguments):this.defaultFn();
      },
      /*切换场景*/
      changeCurrentType(val){
        const state = this.$store.state;
        this.currentPage = 1;
        if(val){
          this.uCurrentType = val;
        }else if (this.currentType) {
          this.uCurrentType = this.currentType;
        }else if (state.type && (state.type.path == this.$route.path)) {
          this.uCurrentType = state.type.value;
        }else{
          this.uCurrentType = this.typeList[0].key;
        }
        state.type = {
          path  : this.$route.path,
          value : this.uCurrentType
        };
        Bus.$emit('handleTypeChange', this.uCurrentType);
      },
      /*分页器触发handle*/
      handleSizeChange(val) {
        //this.currentPage = 1;
        console.log(`每页 ${val} 条`);
      },
      handlePaginationChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        Bus.$emit('handlePaginationChange', val);
      },
      /*时间选择时*/
      datePickHandle(text){
        const dateArr = text.split(' 至 ');
        const beginDate = parseInt(moment(dateArr[0]).hours(0).minutes(0).seconds(0).format('x') / 1000);
        const endDate = parseInt(moment(dateArr[1]).hours(23).minutes(59).seconds(59).format('x') / 1000);
        console.log('datePick-beginDate: ' + moment(+beginDate * 1000).format('YYYY-MM-DD HH:mm:ss'));
        console.log('datePick-endDate:   ' + moment(+endDate * 1000).format('YYYY-MM-DD HH:mm:ss'));
        Bus.$emit('handleDatePick', {
          beginDate : beginDate,
          endDate : endDate
        });
      }
    },
    watch     : {
      typeList(newVal, oldVal){
        this.changeCurrentType();
        /*if(!this.uCurrentType){
          this.changeCurrentType();
        }*/
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .wrap {
    .search-title {
      margin-bottom: 2px;
      height: 40px;
      background-color: #fff;
      padding: 10px 0;
      border: none;
      display: flex;
      align-items: center;
      span {
        font-size: 13px;
        margin-left: 22px;
        margin-right: 24px;
        color: #919191;
        letter-spacing: 0;
        line-height: 30px;
      }
      ul {
        display: flex;
        align-items: center;
        li {
          .type-item{
            padding: 0 20px;
            height: 30px;
            font-size: 13px;
            line-height: 30px;
            color: #6F6F6F;
            letter-spacing: 0;
            text-align: center;
            border-radius: 4px;
            margin-left: 5px;
            cursor: pointer;
            &.currentClass {
              background-color: rgba(74, 144, 226, 1);
              color: #fff;
            }
          }
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
    .table-header {
      padding: 18px 14px;
      background-color: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin-bottom: 2px;
      .hide{
        display: none;
      }
      button {
        width: 80px;
        height: 30px;
        padding: 0;
        font-size: 13px;
        color: #919191;
        &.is-disabled{
          border-color: #d1dbe5 !important;
          span {
            color: #919191 !important;
            &:hover {
              color: #919191 !important;
            }
          }
        }
        span {
          height: 30px;
          display: block;
          line-height: 30px;
          font-size: 13px;
          color: #313131;
          &:hover {
            color: #20a0ff;
            border-color: #20a0ff;
          }
        }
      }
    }
    .main-table {
      border: none;
      .el-table__header-wrapper{
        table{
          thead th {
            background-color: #fff;
            border: 1px solid #F2F7FA;
            border-top: none;
            border-bottom: 2px solid #F2F7FA;
            .cell {
              background-color: #fff;
              font-size: 13px;
              color: #919191;
              font-weight: normal;
            }
          }
        }
      }
      .el-table__body-wrapper {
        overflow-x: hidden;
        table{
          tbody {
            tr{
              height: 64px;
              td {
                border-top: 2px solid #fff;
                border-bottom: 2px solid #F2F7FA;
              }
              &:hover{
                td {
                  border-color: #e9f1fc;
                  background-color: #e9f1fc;
                }
              }
              &.current-row {
                td {
                  border-color: #4990E2;
                  background-color: #E9F1FC;
                  &:nth-of-type(1) {
                    border-left: 2px solid #4990E2;
                  }
                  &:nth-last-child(1) {
                    border-right: 2px solid #4990E2;
                  }
                }
              }
            }
          }
          .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 50px;
          }
        }
      }
      /*暂无数据*/
      .el-table__empty-block{
        position: initial;
        .el-table__empty-text{
        }
      }
      .el-checkbox{
        .el-checkbox__inner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          &::after {
            height: 9px;
            left: 6px;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #4A90E2;
        }
      }
      .el-checkbox__input{
        &.is-disabled{
          &>span{
            font-family: 'icomoon' !important;
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            &:before {
              content: "\e902";
              color: #EB253D;
              font-size: 21px;
              position: absolute;
              left: -2px;
              top: -2px;
            }
          }
        }
      }
      .el-table-column--selection{
        .is-disabled {
          cursor: default;
          .el-checkbox__inner {
            cursor: default;
          }
        }
      }
      /*客户姓名*/
      .name-icon-box{
        /* width: 120px; */
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /* padding-left: 20px; */
        .name-icon {
          flex-grow: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-image: linear-gradient(-180deg, #A5AAB6 0%, #858A92 100%);
          line-height: 36px;
          font-size: 18px;
          color: #FFFFFF;
          display: block;
        }
        .name-show {
          text-align: left;
          line-height: 38px;
          /* max-width: 77px; */
          max-width: 120px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          /* margin-left: 10px; */
          display: inline-block;
          vertical-align: bottom;
        }
      }
      /*可点击颜色*/
      .active {
        color: #4b8ddf;
      }
      /*订单状态*/
      .taskStatus {
        display: flex;
        justify-content: center;
        align-items: center;
        &:before {
          content: '';
          margin-right: 5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }
      /*删除按钮*/
      .operate img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    /* pagination 分页 */
    .pagination-styles {
      margin: 0 auto;
      margin: 20px auto;
      text-align: center;
      font-size: 18px !important;
    }
  }
  /*popover默认icon*/
  .mark-img-box{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .mark-img{
      img{
        flex-grow: 0;
        margin: 0 5px;
        width: 28px;
        height: 28px;
      }
    }
  }
  /*popover组件*/
  .el-popover {
    width: 340px !important;
    .el-popover__title {
      font-size: 15px;
    }
    .el-popover__content {
      font-size: 13px;
    }
    /*popover跟进记录*/
    .log-list{
      .user-info {
        padding-left: 18px;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          background: #D8D8D8;
          border-radius: 50%;
          left: 0;
          top: 4px;
        }
        p{
          .el-popover__title {
            font-size: 14px;
          }
        }
        .time {
          color: #666;
        }
        .name {
          color: #3B79C1;
        }
        .desc {
          padding-bottom: 10px;
        }
      }
      .prop-content {
        padding-left: 18px;
        padding-right: 38px;
        padding-bottom: 15px;
        padding-top: 10px;
      }
      li {
        position: relative;
      }
    }
  }
  .disabled {
    color: #9B9B9B;
  }
</style>
