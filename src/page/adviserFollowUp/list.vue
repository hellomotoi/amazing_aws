<!--跟进中婚礼-->
<template>
  <div class='followUp'>
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
  import {mapState} from 'vuex'
  import {getTaskListStatus, getAdviserTaskList} from '../../service/getData.js'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        typeList     : [], // 场景列表
        tableTitle   : {},
        tableData    : [], // 表格数据
        loading      : false,
        currentType  : this.$store.state.type ? this.$store.state.type : '', // 当前场景
        currentStatus: '',
        currentPage  : 1, // 翻页器当前页
        pageTotal    : 0 // 表格总数据数
      }
    },
    props  : [],
    computed: {
      ...mapState(['userId']),
    },
    components:{
      bread,
      uTable
    },
    created(){ // 初次进入,加载数据
      this.getType(); // 获取场景列表
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
        getTaskListStatus({'uid': this.userId}).then(res => {
          if (res.status != 200) return;
          let data = res.data.data;
          this.typeList = data;
        })
      },
      /*获取表格数据*/
      getList() {
        this.loading = true;
        const params = {
          uid: this.userId,
          status: this.currentType,
          page: this.currentPage
        };
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
  .followUp {
    padding: 0 24px;
  }
</style>
