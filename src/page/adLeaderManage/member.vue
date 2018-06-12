<template>
  <div class="member">
    <header>
      <bread :title="plannerName" :hasGoBack="true"></bread>
    </header>
    <uTable
      :loading="loading"
      :optList="optList"
      :typeList="typeList"
      :currentType="currentType"
      :hasSelection="allowTurn"
      :handleSelectionChange="handleSelectionChange"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :handleRowClick="handleCurrentChange">
    </uTable>
    <allotAgainWindow></allotAgainWindow>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {getTaskListStatus, getAloneMemberList} from '../../service/getData.js'
  import jsonToParams from '../../plugins/jsonToParams.js'
  import allotAgainWindow from '../../components/window/allotAgainWindow.vue'
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        optList          : [
          {
            'text'       : '转单',
            'handleClick': this.assignsHandle,
            'disabled'   : true,
            'showBtn'    : true
          }
        ],
        plannerId        : this.$route.query.plannerId,
        plannerName      : '',
        currentType      : this.$route.query.status, // 当前选中场景
        tableTitle       : {},
        typeList         : [],
        allowTurn        : false, //允许转单
        tableData        : [], // 表格数据
        currentPage      : 1, // 翻页器当前页
        pageTotal        : 0, // 表格总数据数
        loading          : true,
        multipleSelection: []
      }
    },
    props     : [],
    computed  : {
      ...mapState(['userId']),
      clueIds(){
        return this.multipleSelection.map(item => {
          return item.id;
        })
      }
    },
    components: {
      allotAgainWindow,
      bread,
      uTable
    },
    created(){ // 初次进入,加载数据
      console.log(this.$route.query)
      this.getType();
      /*场景切换handle*/
      Bus.$off('handleTypeChange');
      Bus.$on('handleTypeChange', (type) => {
        this.currentType = type;
        this.currentPage = 1;
        this.getList();
      });
      /*转单后*/
      Bus.$off('hasAssigned');
      Bus.$on('hasAssigned', () => {
        this.loading = true;
        this.getList();
      });
      /*分页触发handle*/
      Bus.$off('handlePaginationChange');
      Bus.$on('handlePaginationChange', (page) => {
        console.log('分页触发handle')
        this.currentPage = page;
        this.getList();
      });
    },
    methods   : {
      goBack(){
        this.$router.push('/adviserLeader/manage');
      },
      getType(){
        const params = {
          uid       : this.plannerId,
          flagParams: 'planner',
          begin_date: this.$route.query.begin_date,
          end_date  : this.$route.query.end_date,
        }
        getTaskListStatus(params).then(res => {
          this.typeList = res.data.data;
        })
      },
      /*获取表格数据*/
      getList() {
        const params = {
          uid       : this.userId,
          plannerId : this.plannerId,
          status    : this.currentType,
          begin_date: this.$route.query.begin_date,
          end_date  : this.$route.query.end_date,
          page: this.currentPage
        };
        getAloneMemberList(params).then(res => {
          this.loading = false;
          this.tableTitle = res.data.data.title;
          this.tableData = res.data.data.list.listData;
          this.pageTotal = res.data.data.list.count;
          this.allowTurn = res.data.data.info.allowTurn;
          this.optList[0].showBtn = this.allowTurn;
          this.plannerName = `顾问${res.data.data.info.uname} 所有婚礼`;
        })
      },
      /*表格列点击处理事件*/
      handleCurrentChange(row, event, column) {
        event.stopPropagation();
        /*if (event.target.getAttribute('class') === 'el-checkbox__inner' || event.target.getAttribute('class') === 'el-checkbox__original') return;*/
        const pathArr = this.$route.path.split('/');
        const queryArr = [];
        Object.assign(queryArr, this.$route.query);
        queryArr.status = this.currentType;
        const query = jsonToParams(queryArr);
        this.$router.push(`/${pathArr[1]}/${pathArr[2]}/view/${row.id}?${query}`);
      },
      // 列表select勾选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 转单
      assignsHandle(){
        console.log(this.clueIds);
        const params = {
          'ids'           : this.clueIds,
          'historyPlanner': this.plannerId
        };
        Bus.$emit('openAdviserAgain', params);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .member {
    padding: 0 24px;
  }
</style>
