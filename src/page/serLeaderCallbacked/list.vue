<!--已回访商机-->
<template>
  <div class="callbacked">
    <header>
      <bread></bread>
    </header>
    <uTable
      :loading="loading"
      :typeList="typeList"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :handleRowClick="handleCurrentChange">
    </uTable>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {callbackType, callbackList} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        typeList     : [], // 场景列表
        tableTitle   : {},
        tableData    : [], // 表格数据
        loading      : true,
        currentType  : '', // 当前场景
        currentStatus: 'done', // todo-待回访；done-已回访
        currentPage  : 1, // 翻页器当前页
        pageTotal    : 0 // 表格总数据数
      }
    },
    props  : [],
    computed : {
      ...mapState(['userId']),
    },
    components:{
      bread,
      uTable
    },
    created(){
      this.getType();
      /*场景切换handle*/
      Bus.$off('handleTypeChange');
      Bus.$on('handleTypeChange', (type) => {
        this.currentType = type;
        this.currentPage = 1;
        this.getList();
      });
      /*分页触发handle*/
      Bus.$off('handlePaginationChange');
      Bus.$on('handlePaginationChange', (page) => {
        this.currentPage = page;
        this.getList();
      });
    },
    methods: {
      /*获取场景数据*/
      getType(){
        let params = {
          'uid'   : this.userId,
          'status': this.currentStatus  //todo-待回访；done-已回访
        };
        callbackType(params).then(res => {
          let data = res.data.data;
          this.typeList = data;
        })
      },
      /*获取表格数据*/
      getList(page) {
        let params = {
          uid   : this.userId,
          status: this.currentStatus,
          type  : this.currentType,
          page  : this.currentPage
        };
        callbackList(params).then(res => {
          this.loading = false;
          this.tableTitle = res.data.data.title;
          this.tableData = res.data.data.list.listData;
          this.pageTotal = res.data.data.list.count;
        })
      },
      /*表格行点击处理事件*/
      handleCurrentChange(row, event, column) {
        event.stopPropagation();
        const pathArr = this.$route.path.split('/');
        this.$router.push(`/${pathArr[1]}/${pathArr[2]}/view/${row.id}/${row.v_id}`);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .callbacked {
    padding: 0 24px;
  }
</style>
