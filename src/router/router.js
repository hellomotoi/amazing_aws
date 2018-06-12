import App from '../App'
/*-----登录-----*/
const login = (r) => require.ensure([], () => r(require('../page/login')), 'login');
const user = (r) => require.ensure([], () => r(require('../page/user/user')), 'user');
const userCenter = (r) => require.ensure([], () => r(require('../page/user/userCenter')), 'userCenter');
const changePassword = (r) => require.ensure([], () => r(require('../page/user/changePassword')), 'changePassword');
/*-----内容面板-----*/
const content = (r) => require.ensure([], () => r(require('../page/content')), 'content');
/*-----搜索页-----*/
const searchResult = (r) => require.ensure([], () => r(require('../page/searchResult/list')), 'searchResult');
/*-----客服相关-----*/
const servicePending = (r) => require.ensure([], () => r(require('../page/servicePending/list')), 'servicePending');
const serviceSubmit = (r) => require.ensure([], () => r(require('../page/serviceSubmit/list')), 'serviceSubmit');
/*-----客服Leader相关-----*/
const serLeaderCheckingClue = (r) => require.ensure([], () => r(require('../page/serLeaderChecking/list')), 'serLeaderCheckingClue');
const serLeaderCheckedClue = (r) => require.ensure([], () => r(require('../page/serLeaderChecked/list')), 'serLeaderCheckedClue');
const serLeaderAbandonedClue = (r) => require.ensure([], () => r(require('../page/serLeaderAbandoned/list')), 'serLeaderAbandonedClue');
const serLeaderCallback = (r) => require.ensure([], () => r(require('../page/serLeaderCallback/list')), 'serLeaderCallback');
const serLeaderCallbacked = (r) => require.ensure([], () => r(require('../page/serLeaderCallbacked/list')), 'serLeaderCallbacked');
const serLeaderCollectCount = (r) => require.ensure([], () => r(require('../page/serLeaderCollectCount/list')), 'serLeaderCollectCount');
const serLeaderManage = (r) => require.ensure([], () => r(require('../page/serLeaderManage/list')), 'serLeaderCollectCount');
const serLeaderCheckingDetail = (r) => require.ensure([], () => r(require('../page/serLeaderCheckingDetail/detail')), 'serLeaderCheckingDetail');
const serLeaderCheckedDetail = (r) => require.ensure([], () => r(require('../page/serLeaderCheckedDetail/detail')), 'serLeaderCheckedDetail');
const serLeaderView = (r) => require.ensure([], () => r(require('../page/serLeaderView/index')), 'serLeaderView');
const serLeaderService = (r) => require.ensure([], () => r(require('../page/serLeaderService/index')), 'serLeaderService');
/*-----顾问-----*/
const adviserPanel = (r) => require.ensure([], () => r(require('../page/adviserPanel/index')), 'adviserPanel');
const followUp = (r) => require.ensure([], () => r(require('../page/adviserFollowUp/list')), 'followUp');
const losing = (r) => require.ensure([], () => r(require('../page/adviserLosing/list')), 'losing');
const lostOrder = (r) => require.ensure([], () => r(require('../page/adviserLostOrder/list')), 'lostOrder');
const archived = (r) => require.ensure([], () => r(require('../page/adviserArchived/list')), 'archived');
const adviserView = (r) => require.ensure([], () => r(require('../page/adviserView/index')), 'adviserView');
const adviserService = (r) => require.ensure([], () => r(require('../page/adviserService/index')), 'adviserService');
/*-----顾问leader-----*/
const adLeaderAssigns = (r) => require.ensure([], () => r(require('../page/adLeaderAssigns/assigns')), 'adLeaderAssigns');
const adLeaderDispose = (r) => require.ensure([], () => r(require('../page/adLeaderDispose/list')), 'adLeaderDispose');
const adLeaderFollowUpWed = (r) => require.ensure([], () => r(require('../page/adLeaderFollowUp/list')), 'adLeaderFollowUpWed');
const adLeaderlostOrder = (r) => require.ensure([], () => r(require('../page/adLeaderLostOrder/list')), 'adLeaderlostOrder');
const adLeaderarchived = (r) => require.ensure([], () => r(require('../page/adLeaderArchived/list')), 'adLeaderarchived');
const adLeaderManage = (r) => require.ensure([], () => r(require('../page/adLeaderManage/list')), 'adLeaderManage');
const adLeaderManageMember = (r) => require.ensure([], () => r(require('../page/adLeaderManage/member')), 'adLeaderManageMember');
const adLeaderView = (r) => require.ensure([], () => r(require('../page/adLeaderView/index')), 'adLeaderView');
const adLeaderService = (r) => require.ensure([], () => r(require('../page/adLeaderService/index')), 'adLeaderService');
export default [
  {
    path     : '/',
    component: App, //顶层路由，对应index.html
    children : [ //二级路由。对应App
      //地址为空时跳转home页面
      {
        path    : '',
        redirect: '/login'
      },
      {
        path     : '/login',
        component: login
      },
      {
        path     : '/user',
        component: user,
        children : [
          {
            path     : 'userCenter',  //用户中心
            component: userCenter
          },
          {
            path     : 'changePassword',  //修改密码
            component: changePassword
          }
        ]
      },
      {
        path     : '/content',
        component: content,
        children : [
          /*搜索页*/
          {
            path     : '/:role/:target/searchResult',
            component: searchResult
          },
          /*客服*/
          {
            path     : '/collect/pending',  //待录入线索
            component: servicePending
          },
          {
            path     : '/collect/submit',  //已提交线索
            component: serviceSubmit
          },
          /*客服Leader*/
          {
            path     : '/check/toverify',  //待核实线索
            component: serLeaderCheckingClue
          },
          {
            path     : '/check/checkedClue',  //已核实线索
            component: serLeaderCheckedClue
          },
          {
            path     : '/check/abandonedClue',  //已废弃线索
            component: serLeaderAbandonedClue
          },
          {
            path     : '/check/callback',  //待回访线索
            component: serLeaderCallback
          },
          {
            path     : '/check/callbacked',  //已回访线索
            component: serLeaderCallbacked
          },
          {
            path     : '/check/collectCount',  //线索商机统计
            component: serLeaderCollectCount
          },
          {
            path     : '/serviceLeader/manage',  //客服Leader下属成员管理
            component: serLeaderManage
          },
          {
            path     : '/check/:target/checkingDetail/:id',  // 待核实详情
            component: serLeaderCheckingDetail
          },
          {
            path     : '/check/:target/checkedDetail/:id',  // 已核实详情 & 已废弃详情
            component: serLeaderCheckedDetail
          },
          {
            path     : '/check/:target/view/:id/:vId',  //订单详情页
            component: serLeaderView
          },
          {
            path     : '/check/:target/service/:id/:vId',  //服务流程
            component: serLeaderService
          },
          /*顾问*/
          {
            path     : '/adviser/panel',  //跟进中的婚礼
            component: adviserPanel
          },
          {
            path     : '/adviser/followUp',  //跟进中的婚礼
            component: followUp
          },
          {
            path     : '/adviser/losing',  //申请丢单婚礼
            component: losing
          },
          {
            path     : '/adviser/lostOrder',  //已丢单婚礼
            component: lostOrder
          },
          {
            path     : '/adviser/archived',  //已归档婚礼
            component: archived
          },
          {
            path     : '/adviser/:target/view/:id',  //订单详情
            component: adviserView
          },
          {
            path     : '/adviser/:target/service/:id',  //服务流程
            component: adviserService
          },
          /*顾问Leader*/
          {
            path     : '/assignment/assigns',  //待分配婚礼
            component: adLeaderAssigns
          },
          {
            path     : '/adviserLeader/dispose',  //待处理婚礼
            component: adLeaderDispose
          },
          {
            path     : '/adviserLeader/followUpWed',  //下属跟进中婚礼
            component: adLeaderFollowUpWed
          },
          {
            path     : '/adviserLeader/lostOrder',  //已丢单婚礼
            component: adLeaderlostOrder
          },
          {
            path     : '/adviserLeader/archived',  //已归档婚礼
            component: adLeaderarchived
          },
          {
            path     : '/adviserLeader/manage',  //下属成员管理
            component: adLeaderManage
          },
          {
            path     : '/adviserLeader/manage/member',  //下属成员婚礼
            component: adLeaderManageMember
          },
          {
            path     : '/adviserLeader/:target/view/:id',  //订单详情
            component: adLeaderView
          },
          {
            path     : '/adviserLeader/:target/service/:id',  //服务流程
            component: adLeaderService
          }
        ]
      }
    ]
  },
  {
    path    : '*', //匹配所有路由如果找不到就跳转到制定页面
    redirect: '/login'
  }
]
