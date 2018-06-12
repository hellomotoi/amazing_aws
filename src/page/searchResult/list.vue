<template>
  <div class="search-result">
    <header>
      <bread title="全部结果"></bread>
    </header>
    <uTable
      :loading="loading"
      :typeList="typeList"
      :datePicker="true"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :handleRowClick="handleCurrentChange">
    </uTable>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {getSearchType, getSearchList} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        typeList    : [], // 场景列表
        allTableData: [],
        tableData   : [], // 表格数据
        tableTitle  : {}, // 表头
        loading     : false,
        currentType : '', // 当前场景
        currentPage : 1, // 翻页器当前页
        pageTotal   : 0  // 表格总数据数
      }
    },
    props     : [],
    components: {
      bread,
      uTable
    },
    computed  : {
      ...mapState(['userId']),
    },
    created(){
      if (this.$store.state.searchText) {
        this.getType();
      }
      Bus.$off('doSearch');
      Bus.$on('doSearch', () => {
        if (this.$store.state.searchText) {
          this.getType();
        }
      });
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
    methods   : {
      /*获取场景数据*/
      getType(){
        let params = {
          'uid'   : this.userId,
          'search': this.$store.state.searchText,
        };
        getSearchType(params).then(res => {
          this.typeList = res.data.data;
        })
      },
      /*获取表格数据*/
      getList() {
        const params = {
          uid       : this.userId,
          search    : this.$store.state.searchText,
          searchType: this.currentType,
          page      : this.currentPage
        };
        getSearchList(params).then(res => {
          this.loading = false;
          console.log(res.data.data)
          this.tableTitle = res.data.data.title;
          this.tableData = res.data.data.list.listData;
          this.pageTotal = res.data.data.list.count;
        })
      },
      /*表格行点击处理事件*/
      handleCurrentChange(row, event, column) {
        event.stopPropagation();
        let path = '';
        /**
         * toUrl:
         * toverify-待核实详情页；
         * submit-已核实详情页；
         * discard-已废弃详情页；
         * visit-待回访详情页（核实）；
         * readOrder-订单详情只读（顾问leader）；
         * order-订单详情可编辑（顾问）；
         */
        switch (row.toUrl) {
          case 'toverify':
            path = `/check/toverify/checkingDetail/${row.id}`;
            break;
          case 'submit':
            path = `/check/checkedClue/checkedDetail/${row.id}`;
            break;
          case 'discard':
            path = `/check/abandonedClue/checkedDetail/${row.id}`;
            break;
          case 'visit':
            path = `/check/searchResult/view/${row.id}/${row.v_id}`;
            break;
          case 'readOrder':
            path = `/adviserLeader/searchResult/view/${row.id}`;
            break;
          case 'order':
            path = `/adviser/followUp/view/${row.id}`;
            break;
        }
        console.log(path)
        this.$router.push(path);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-result {
    padding: 0 24px;
  }
</style>
