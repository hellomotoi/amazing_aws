<template>
  <div class="manage">
    <header>
      <bread></bread>
    </header>
    <uTable
      :loading="loading"
      :typeList="typeList"
      :datePicker="true"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :pageTotal="pageTotal"
      :tableDataActive="tableDataActive"
      :handleRowClick="handleCurrentChange">
    </uTable>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {getTaskDayType, getMemberList} from '../../service/getData.js'
  import moment from 'moment';
  import bread from '../../components/bread.vue'
  import uTable from '../../components/uTable.vue'
  import Bus from '../../store/bus';
  export default {
    data(){
      return {
        beginDate      : '',
        endDate        : '',
        datePickerValue: '',
        currentStatus: 'plannerLeader', // collectCount-线索分析；customerLeader-客服leader下属成员管理；plannerLeader-顾问leader下属成员管理
        currentType  : '', // 当前选中场景
        typeList : [],
        tableTitle     : {},
        tableData      : [], // 表格数据
        currentPage  : 1, // 翻页器当前页
        pageTotal    : 0, // 表格总数据数
        loading        : false,
        tableDataActive     : [  //高亮字段
          "totalClue",      //分配商机总数
          "order",          //待预约
          "inStore",        //待进店
          "contract",       //待签约
          "inPreparation",  //筹备中
          "toBefiled",      //待归档
          "archived",       //已归档
          "lostOrder",      //已丢单
          "orderLost",      //待预约丢单
          "inStoreLost",    //待进店丢单
          "contractLost",   //待签约丢单
          "inPreparationLost",  //筹备中丢单
          "losing"              //丢单申请中
        ]
      }
    },
    props   : [],
    components:{
      bread,
      uTable
    },
    created(){ // 初次进入,加载数据
      this.getType();
      /*场景切换handle*/
      Bus.$off('handleTypeChange');
      Bus.$on('handleTypeChange', (type) => {
        this.currentType = type;
        this.currentPage = 1;
        this.dayToTimes(this.currentType);
      });
      /*选择时间范围handle*/
      Bus.$off('handleDatePick');
      Bus.$on('handleDatePick', (date) => {
        this.beginDate = date.beginDate;
        this.endDate = date.endDate;
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
    computed: {
      ...mapState(['userId'])
    },
    methods : {
      /*把天数转为时间戳*/
      dayToTimes(day){
        if (day === -1) { //全部
          this.beginDate = '';
          this.endDate = '';
        }else{
          const dayNum = day - 1;  //因起始点为00:00, 结束点为23:59, 所以应去掉1天, 今天为0, 一周为6
          this.beginDate = parseInt(moment().subtract(dayNum, 'days').hours(0).minutes(0).seconds(0).format('x') / 1000);
          this.endDate = parseInt(moment(new Date()).hours(23).minutes(59).seconds(59).format('x') / 1000);
        }
        console.log('beginDate: ' + moment(+this.beginDate * 1000).format('YYYY-MM-DD HH:mm:ss'));
        console.log('endDate:   ' + moment(+this.endDate * 1000).format('YYYY-MM-DD HH:mm:ss'));
        this.getList();
      },
      /*获取场景数据*/
      getType(){
        let params = {
          'uid'   : this.userId,
          'type': this.currentStatus
        };
        getTaskDayType(params).then(res => {
          this.typeList = res.data.data;
        })
      },
      /*获取表格数据*/
      getList() {
        this.loading = true;
        const params = {
          uid       : this.userId,
          roleId    : 1,
          begin_date: this.beginDate,
          end_date  : this.endDate,
          page: this.currentPage
        };
        getMemberList(params).then(res => {
          this.loading = false;
          this.tableTitle = res.data.data.title;
          this.tableData = res.data.data.list.listData;
          this.pageTotal = res.data.data.list.count;
        })
      },
      /*表格列点击处理事件*/
      handleCurrentChange(row, event, column) {
        console.log(`${column.label}: ${column.property}`)
        if (this.tableDataActive.indexOf(column.property) != -1 && row[column.property] != 0) {
          const pathArr = this.$route.path.split('/');
          this.$router.push(`/${pathArr[1]}/${pathArr[2]}/member?plannerId=${row.id}&status=${column.property}&begin_date=${this.beginDate}&end_date=${this.endDate}`);
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .manage {
    padding: 0 24px;
  }
</style>
