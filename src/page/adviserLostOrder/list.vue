<!--已丢单婚礼-->
<template>
  <div class="lost-order">
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
  import {mapState, mapActions} from 'vuex'
  import {getAdviserTaskList} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        loading      : false,
        tableTitle   : {},
        tableData    : [], // 表格数据
        currentStatus: 'all', // 当前列表状态
        currentPage  : 1, // 翻页器当前页
        pageTotal    : 0, // 表格总数据数
      }
    },
    props  : [],
    computed: {
      ...mapState(['userId'])
    },
    components:{
      bread,
      uTable
    },
    created(){
      this.getList();
    },
    methods: {
      /*获取表格数据*/
      getList() {
        const params = {
          uid: this.userId,
          status: 'lostOrder',
          page: this.currentPage
        }
        getAdviserTaskList(params).then(res => {
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
        this.$router.push(`/${pathArr[1]}/${pathArr[2]}/view/${row.id}`);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .lost-order {
    padding: 0 24px;
  }
</style>

