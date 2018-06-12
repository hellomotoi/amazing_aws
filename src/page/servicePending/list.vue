<!--待录入线索-->
<template>
  <div class='pending'>
    <!--<div class="bg" v-if='!tableData.length'></div>-->
    <div class="page-title">
      <bread></bread>
      <el-button type="primary" id="newClue" @click="newClue">新 建</el-button>
    </div>
    <uTable
      :loading="loading"
      :optList="optList"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :hasSelection="true"
      :rowSelectable="selectable"
      :handleRowDelete="deleteRow"
      :handleRowClick="reEdit"
      :handleCellMouseEnter='showMsg'
      :handleSelectionChange="handleSelectionChange">
    </uTable>
    <!-- 弹窗 -->
    <newWindow></newWindow>
    <confirmWindow
      :commitVisible="moreDelete"
      :title="commitWinData.title"
      :content="commitWinData.content"
      :type="commitWinData.type"
      @doSubmit="deleteClue">
    </confirmWindow>
    <confirmWindow
      :commitVisible="moreSubmit"
      :title="commitWinData2.title"
      :content="commitWinData2.content"
      :type="commitWinData2.type"
      @doSubmit="submitClue">
    </confirmWindow>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {getListData, deleteClue, chkclue, collectSubmit} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import newWindow from '../../components/window/newWindow.vue'
  import confirmWindow from '../../components/window/confirmWindow.vue'
  import Bus from '../../store/bus';
  export default {
    data() {
      return {
        loading : false,
        optList          : [
          {
            'text'       : '删除线索',
            'handleClick': this.batchDelHandle,
            'disabled'   : true,
            'style'      : ''
          },
          {
            'text'       : '提交',
            'handleClick': this.batchSubHandle,
            'disabled'   : true,
            'style'      : ''
          }
        ],
        currentPage      : 1, // 翻页器当前页
        pageTotal        : 0, // 表格总数据数
        moreDelete       : 0, // 批量删除
        moreSubmit       : 0, // 批量提交
        commitWinData    : {
          title  : "删除线索",
          content: '确定删除这条线索么？',
          type   : 'other',
          state  : 0
        },
        commitWinData2   : {
          title  : "提交线索",
          content: '',
          type   : 'other',
        },
        tableData        : [],
        tableTitle       : {}, // 表头
        multipleSelection: [],
      }
    },
    props     : [],
    components: {
      bread, confirmWindow, newWindow, uTable
    },
    computed  : {
      ...mapState(['userId']),
      clueIds(){
        return this.multipleSelection.map(item => {
          return item.id;
        })
      }
    },
    created(){
      this.renderList();
      /*提交线索handle*/
      Bus.$off('renderSubmit');
      Bus.$on('renderSubmit', () => {
        this.renderList();
      });
      /*分页触发handle*/
      Bus.$off('handlePaginationChange');
      Bus.$on('handlePaginationChange', (page) => {
        this.currentPage = page;
        this.renderList();
      });
    },
    methods   : {
      /*获取列表*/
      renderList() {
        this.loading = true;
        const params = {
          status: 'pending',
          uid   : this.userId,
          page  : this.currentPage
        }
        getListData(params).then(res => {
          this.loading = false;
          this.tableTitle = res.data.data.title;
          this.tableData = res.data.data.list.listData;
          this.pageTotal = res.data.data.list.count;
        })
      },
      showMsg(row, column, cell, event){ // 禁止提交 hover
        const iCheckbox = cell.querySelector('.is-disabled');
        if(!iCheckbox) return;
        const iTips = document.createElement('span');
        iTips.className = 'incomplete';
        iTips.innerText = '必填项不全';
        iCheckbox.onmouseover = () => {
          if(row.opt == 2){
            iTips.style['top'] = iCheckbox.offsetTop + 50 + 'px';
            iTips.style['left'] = iCheckbox.offsetLeft + 14 + 'px';
            iCheckbox.parentNode.parentNode.parentNode.appendChild(iTips)
          }
        }
        iCheckbox.onmouseleave = () => {
          iCheckbox.parentNode.parentNode.parentNode.removeChild(iTips)
        }
      },
      deleteRow(index, row, tableData) {
        this.moreDelete = ++this.moreDelete;
        this.commitWinData.state = 1;
        this.simpleId = row.id;
      },
      selectable(row, index){ // 多选
        return !(row.opt - 1);
      },
      newClue(){
        Bus.$emit('openNewEdit'); // 打开表单窗口
      },
      reEdit(row, event){ // 点击table-row 修改已填写信息
        Bus.$emit('openNewEdit', row.id); // 打开表单窗口
      },
      /*批量删除*/
      batchDelHandle(){
        this.moreDelete = ++this.moreDelete;
        this.commitWinData.state = 0;
      },
      /*批量提交*/
      batchSubHandle(){
        this.moreSubmit = ++this.moreSubmit;
        this.commitWinData2.content = `确定提交${this.multipleSelection.length}条线索吗?`;
      },
      /*删除*/
      deleteClue(){
        var clueIds = this.clueIds.join(',');
        if (this.commitWinData.state == 1) clueIds = this.simpleId;
        deleteClue({uid: this.userId, clueIds: clueIds})
          .then(res => {
            var res = res.data;
            if (res.code == 200) {
              Bus.$emit('menuTotal');
              this.tableData = this.tableData.filter(item => {
                var isAllow = this.clueIds.every(clueid => {
                  return clueid != item.id;
                })
                if (this.commitWinData.state == 1) {
                  isAllow = item.id != clueIds;
                }
                return isAllow;
              });
            }
          })
      },
      /*批量提交*/
      submitClue(){
        var sendData = {
          uid    : this.userId,
          clueIds: this.clueIds.join(',')
        };
        chkclue(sendData).then(res => {
          var res = res.data;
          if (res.code == 204) {
            this.$message.error(res.message);
          } else {
            sendData.status = 2;
            collectSubmit(sendData).then(res => {
              Bus.$emit('menuTotal');
              var res = res.data;
              this.$message({
                message    : '恭喜您，提交成功',
                showClose  : true,
                customClass: "succ",
                iconClass  : 'icon-success'
              });
              this.tableData = this.tableData.filter(item => {
                return this.clueIds.every(clueid => {
                  return clueid != item.id;
                })
              });
            })
          }
        })
      },
      /*多选*/
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    watch     : {}
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pending {
    padding: 0 24px;
    /*.bg {
      width: 226px;
      height: 222px;
      margin: 0 auto;
      margin-top: 15%;
      background-image: url(../../images/bg.png);
      background-repeat: no-repeat;
      background-size: 226px 222px;
      background-position: center center;
      position: absolute;
      left: 50%;
      margin-left: -100px;
      // display:none;
    }
    .bg:before {
      position: absolute;
      content: '你真棒，任务全部提交完成了';
      bottom: -50px;
      font-size: 18px;
      color: #313131;
      width: 110%;
    }*/
    /*页面标题*/
    .page-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      button {
        background: #4A90E2;
        border-radius: 4px;
        width: 120px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        &:hover {
          opacity: .6;
        }
        span {
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .incomplete{
    position: absolute;
    z-index: 3;
    width: 100px;
    padding: 15px 0;
    text-align: center;
    border: 1px solid rgba(151, 151, 151, 0.2);
    background: #fff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  }
</style>
