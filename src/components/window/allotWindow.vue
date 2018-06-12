<!--分配-->
<template>
  <el-dialog title="分配" top="10%" v-model="dialogVisible" id='leaderList' :show-close='false'
             :close-on-click-modal="false">
    <ul class="leaderList">
      <li class="adviserCell" v-for="item in listData"
          :class="{currentFocus: item.uid == currentAdviserId}"
          @click="getCurrentId(item)">
        <div class="cellImg">
          <img v-if="item.img" src="item.img">
        </div>
        <div class="cellInfo">
          <p>
            <span class="infoName">{{item.name}}</span>
            <span class="infoNo">No. {{item.uid}}</span>
          </p>
          <p class="cellSign">顾问</p>
        </div>
      </li>
    </ul>
    <div class="pagination-box">
      <span class="pagination-pageSize">{{currentPage}}/{{maxNum}}</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePaginationChange"
        :current-page="currentPage"
        :page-size="18"
        layout="prev, next"
        :total="pageTotal"
        class="pagination-styles">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="disabled">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
  import {mapState, mapActions} from 'vuex';
  import {getAssignmentAdviserList, AssignmentSubmit} from '../../service/getData.js';
  import Bus from '../../store/bus.js';
  export default {
    data() {
      return {
        disabled          : true,
        currentUserId     : '',
        currentPage       : 1,
        pageTotal         : 0,
        maxNum            : 0,
        dialogVisible     : false,
        idArr             : [],
        currentAdviserId  : '',
        currentAdviserName: '',
        listData          : []
      }
    },
    created() {
      Bus.$on('openDialog', ids => {
        console.log(ids);
        this.idArr = ids.toString();
        this.dialogVisible = true;
        this.currentAdviserId = '';
      })
      this.currentUserId = this.userData().userInfo.id;
      this.renderAdviserList();
    },
    props  : [],
    methods: {
      ...mapState(['userData']),
      getCurrentId(data) {
        this.currentAdviserId = data.uid;
        this.currentAdviserName = data.name;
        this.disabled = false;
      },
      handleSizeChange(val) {
      },
      handlePaginationChange(val) {
        this.currentPage = val;
        this.renderAdviserList();
      },
      submit() {
        AssignmentSubmit({'uid': this.currentUserId, 'ids': this.idArr, 'plannerId': this.currentAdviserId})
          .then(res => {
            console.log('分配返回数据', res);
            if (res.data.code == 200) {
              Bus.$emit('menuTotal');
              this.$message({
                message    : `恭喜您，该订单已成功分配给${this.currentAdviserName}`,
                showClose  : true,
                customClass: "succ",
                iconClass  : 'icon-success'
              });
              this.restShowAdviser();
              Bus.$emit('hasAssigned');
            } else if (res.data.code == 203) {
              this.$message({
                message    : '请选择分配顾问',
                showClose  : true,
                customClass: "err",
                iconClass  : 'icon-wrong'
              });
            } else {
              this.$message({
                message    : '对不起，该顾问不能分配，请重新分配！',
                showClose  : true,
                customClass: "err",
                iconClass  : 'icon-wrong'
              });
            }
          })
        console.log('提交');
      },
      close() {
        console.log('关闭');
        this.restShowAdviser();
      },
      restShowAdviser() {
        this.dialogVisible = false;
        this.disabled = true;
      },
      renderAdviserList() {
        getAssignmentAdviserList({'page': this.currentPage})
          .then(res => {
            console.log('顾问列表数据', res);
            let readyData = res.data.data;
            this.listData = readyData.listData;
            this.pageTotal = readyData.count;
            this.maxNum = readyData.max_Num;
          })
      }
    }
  }
</script>
<style lang="scss">
  #leaderList {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
    .el-dialog {
      width: 1040px;
    }
  }
  #leaderList .el-dialog__header {
    padding: 30px 20px;
    span {
      font-size: 18px;
      color: #343434;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
  #leaderList .el-dialog__body {
    min-height: 532px;
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
    background-color: #F1F6F9;
    .leaderList {
      overflow: hidden;
      margin-left: -20px;
      margin-top: -20px;
      li {
        float: left;
        width: 320px;
        height: 72px;
        padding: 10px 20px;
        margin-left: 20px;
        margin-top: 20px;
        border: 1px solid #DFDFDF;
        background: #FFFFFF;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.07);
        border-radius: 6px;
        box-sizing: border-box;
        .cellImg {
          width: 50px;
          height: 50px;
          background: url(../../images/amazing.png) center center no-repeat;
          background-size: contain;
          border-radius: 50%;
          overflow: hidden;
          float: left;
        }
        .cellInfo {
          overflow: hidden;
          height: 100%;
          padding-left: 20px;
          padding-top: 3px;
          .cellSign {
            font-size: 12px;
            color: #313131;
            letter-spacing: 0;
            margin-top: 3px;
          }
        }
        .cellInfo .infoName {
          font-size: 16px;
          color: #313131;
          letter-spacing: 0;
        }
        .cellInfo .infoNo {
          float: right;
          font-size: 12px;
          color: #313131;
          letter-spacing: 0;
        }
      }
      .currentFocus {
        background: #E9F1FC;
        border: 2px solid #4990E2;
      }
    }
  }
  #leaderList .dialog-footer button {
    width: 109px;
    line-height: 12px;
  }
  #leaderList .el-button + .el-button {
    margin-left: 18px;
  }
  /* pagination 分页 */
  #leaderList .pagination-box {
    position: absolute;
    top: 24px;
    right: 70px;
    .pagination-pageSize {
      float: left;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      color: #919191;
      letter-spacing: 0;
      margin-right: 20px;
    }
    .pagination-styles {
      margin: 0 auto;
      .btn-prev {
        background: #FFFFFF;
        border: 1px solid #979797;
        border-radius: 4px;
        margin-right: 20px;
      }
      .btn-next {
        background: #FFFFFF;
        border: 1px solid #979797;
        border-radius: 4px;
      }
    }
  }
</style>
