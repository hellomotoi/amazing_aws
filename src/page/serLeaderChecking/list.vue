<!--待核实线索-->
<template>
  <div class='checkClue'>
    <header>
      <bread></bread>
    </header>
    <uTable
      :loading="loading"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :handleRowClick="handleCurrentChange">
    </uTable>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {checkclueList, loginfo} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        tableTitle   : {},
        tableData    : [],
        pageTotal    : 0,
        currentPage:1,
        loading      : false,
      }
    },
    props     : [],
    computed: {
      ...mapState(['userId']),
    },
    components: {
      bread,
      uTable
    },
    created(){
      this.getList();
      /*分页触发handle*/
      Bus.$off('handlePaginationChange');
      Bus.$on('handlePaginationChange', (page) => {
        this.currentPage = page;
        this.getList();
      });
    },
    methods   : {
      getList(){
        this.loading = true;
        var uid = this.userId;
        checkclueList({status: 'toverify', uid: uid, page  : this.currentPage})
          .then((res) => {
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
        this.$router.push(`/check/toverify/checkingDetail/${row.id}`);
        return;
      }
    },
    watch     : {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .checkClue {
    padding: 0 24px;
  }
</style>
