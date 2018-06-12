<!--已提交线索-->
<template>
  <div class='submit'>
    <header>
      <bread></bread>
    </header>
    <uTable
      :loading="loading"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal">
    </uTable>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {toClueWin, getListData} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data() {
      return {
        loading       : true,
        currentPage   : 1, // 翻页器当前页
        pageTotal     : 0, // 表格总数据数
        tableTitle    : {},
        tableData    : []
      }
    },
    props     : [],
    computed  : {
      ...mapState(['userData']),
      screenSize(){
        if (window.screen.height > 720)
        /*大屏*/
          return 0
        else
          return 1
      }
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
      getList() {
        getListData({status: 'submit', uid: this.userData.userInfo.id, page  : this.currentPage})
          .then(res => {
            this.loading = false;
            this.tableTitle = res.data.data.title;
            this.tableData = res.data.data.list.listData;
            this.pageTotal = res.data.data.list.count;
          })
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .submit{
    padding: 0 24px;
  }
</style>
