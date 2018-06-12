<template>
  <div class="assignment-list">
    <uTable
      :loading="loading"
      :optList="optList"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :hasSelection="true"
      :handleRowClick="handleCurrentChange"
      :handleSelectionChange="handleSelectionChange">
    </uTable>
  </div>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {getAssignment} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data() {
      return {
        loading          : false,
        optList          : [
          {
            'text'       : '分配',
            'handleClick': this.batchAssignsHandle,
            'disabled'   : true,
            'style'      : ''
          }
        ],
        tableTitle       : {},
        tableData        : [],
        multipleSelection: [],
        viewId           : '',
        currentPage  : 1, // 翻页器当前页
        pageTotal    : 0 // 表格总数据数
      }
    },
    props   : [],
    computed: {
      ...mapState(['userId']),
      clueIds(){
        return this.multipleSelection.map(item => {
          return item.id;
        })
      }
    },
    components:{
      bread,
      uTable
    },
    created(){
      this.getList();
      Bus.$off('hasAssigned');
      Bus.$on('hasAssigned', clueIds => {
        this.getList();
      });
      /*分页触发handle*/
      Bus.$off('handlePaginationChange');
      Bus.$on('handlePaginationChange', (page) => {
        this.currentPage = page;
        this.getList();
      });
    },
    methods : {
      // 列表默认选中第一行
      main_table(row, index) {
        if (index === 0) {
          return 'current-row';
        }
      },
      // 列表select勾选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 列表单行点击
      handleCurrentChange(val){
        this.currentRow = val;
        this.viewId = val.id;
        Bus.$emit('changeView', this.viewId);
      },
      // 分配
      batchAssignsHandle(){
        console.log(this.clueIds);
        Bus.$emit('openDialog', this.clueIds);
      },
      // 获取列表
      getList(){
        this.loading = true;
        const params = {
          status: 'assignment',
          uid: this.userId,
          page: this.currentPage
        }
        getAssignment(params).then(res => {
            this.loading = false;
            this.tableTitle = res.data.data.title;
            this.tableData = res.data.data.list.listData;
            this.pageTotal = res.data.data.list.count;
            this.viewId = this.tableData.length ? this.tableData[0].id : '';
            Bus.$emit('changeView', this.viewId);
          });
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scope>
  .assignment-list {
  }
</style>
