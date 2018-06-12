import {Message} from 'element-ui';
import axios from 'axios';
import query from 'querystring';
let ayscType = null;
if (process.env.NODE_ENV == 'development') {
  ayscType = "post";
} else {
  ayscType = 'post';
}
const isErrorHandle = (axiosHandle) => {
  axiosHandle.then(res => {
    if (res.data.code != 200) {
      Message({
        message    : res.data.message,
        showClose  : true,
        customClass: "err",
        iconClass  : 'icon-wrong'
      });
      return true;
    }
    return false;
  }).catch(err => {
    const host = location.hostname;
    let env = host;
    if (host == 'localhost' || host.match('192.168')) {
      env = 'http://worktsys.dev.amazingday.cn';
    }
    const msg = `${err}　Request URL: ${env}${err.response.config.url}`;
    Message({
      message    : msg,
      showClose  : true,
      customClass: "err",
      iconClass  : 'icon-wrong'
    })
    return true;
  })
}
const $axios = (method, url, data) => {
  if (method == "get") {
    const axiosHandle = axios.get(url, {params: data});
    return !isErrorHandle(axiosHandle) ? axiosHandle : false;
  } else if (method == 'post') {
    let newData = {...data};
    for (let key in data) {
      if (typeof data[key] == 'object') {//is Object
        newData[key] = JSON.stringify(data[key]);
      }
    }
    const axiosHandle = axios.post(url, query.stringify(newData));
    return !isErrorHandle(axiosHandle) ? axiosHandle : false;
  }
}
/* ============= 登录 ============= */
export const login = (data) => $axios(ayscType, '/aws/auth/login', data);
export const getRole = (data) => $axios(ayscType, '/aws/auth/authsby', data);
export const getPersonList = (data) => $axios(ayscType, '/aws/auth/byRole', data);
/* ============= 修改用户信息 ============= */
export const changeNickname = (data) => $axios(ayscType, '/aws/auth/changeNickname', data);
export const changePassword = (data) => $axios(ayscType, '/aws/auth/changePassword', data);
/* ============= 全局 ============= */
/*获取订单场景*/
export const getTaskListStatus = (data) => $axios(ayscType, '/aws/planner/wedstatus', data);
/*获取时间区域场景*/
export const getTaskDayType = (data) => $axios(ayscType, '/aws/public/dayType', data);
/*获取搜索场景*/
export const getSearchType = (data) => $axios(ayscType, '/aws/public/wtsysMsgTag', data);
/* 左侧菜单统计 */
export const leftParams = (data) => $axios(ayscType, '/aws/public/leftMenuNum', data);
/*留言通知*/
export const getMsgWin = (data) => $axios('get', '/aws/tools/toWins', data);
export const submitMsg = (data) => $axios('get', '/aws/tools/create', data);
export const mapApi = (data) => $axios('get', '/aws/tools/map', data);
/*附件 -- 合同付款*/
export const contractPayMent = (data) => $axios('get', '/aws/planner/payMethod', data);
/* 顶部搜索 */
export const getSearchList = (data) => $axios(ayscType, '/aws/public/wtsysMsgInfo', data);
/*获取获取一级（暂时只取中国），二级，三级城市*/
export const getRegion = (data) => $axios(ayscType, '/aws/public/region', data);
/*获取订单流程时间线*/
export const optProgress = (data) => $axios(ayscType, '/aws/public/optProfessional', data);
/*获取婚礼总览*/
export const getWedAll = (data) => $axios(ayscType, '/aws/public/pandect', data);
/*获取商机或者订单的操作日子信息*/
export const loginfo = (data) => $axios(ayscType, '/aws/public/loginfo', data);
/* ============= 录入相关 ============= */
export const toClueWin = (data) => $axios(ayscType, '/aws/collectclue/toClueWin', data);
/*获取各个列表数据*/
export const getListData = (data) => $axios(ayscType, '/aws/public/list', data);
/*暂存*/
export const temporaryClue = (data) => $axios(ayscType, '/aws/collectclue/temporaryClue', data);
/*删除*/
export const deleteClue = (data) => $axios(ayscType, '/aws/collectclue/delete', data);
/*校验手机*/
export const chkphone = (data) => $axios(ayscType, '/aws/collectclue/chkphone', data);
export const singleSubmit = (data) => $axios(ayscType, '/aws/collectclue/singleSubmit', data);
export const chkclue = (data) => $axios(ayscType, '/aws/collectclue/chkclue', data);
export const collectSubmit = (data) => $axios(ayscType, '/aws/collectclue/submit', data);
/* ============= 核实相关 ============= */
/*已提交线索相关*/
export const publicAjax = (url, data) => $axios(ayscType, url, data);
/*获取各个列表数据*/
export const checkclueList = (data) => $axios(ayscType, '/aws/public/list', data);
/*获取单条列表详情*/
export const showClue = (data) => $axios(ayscType, '/aws/checkclue/showClue', data);
/*废弃接口*/
export const toDiscardWin = (data) => $axios(ayscType, '/aws/checkclue/toDiscardWin', data);
export const discard = (data) => $axios(ayscType, '/aws/checkclue/discard', data);
/*暂存，核实*/
export const optCheck = (data) => $axios(ayscType, '/aws/checkclue/chkSubmit', data);
/*激活*/
export const active = (data) => $axios(ayscType, '/aws/checkclue/active', data);
/*回访商机:场景*/
export const callbackType = (data) => $axios(ayscType, '/aws/checkclue/getType', data);
/*回访商机:列表*/
export const callbackList = (data) => $axios(ayscType, '/aws/checkclue/visitList', data);
/*回访商机:详情*/
export const callbackView = (data) => $axios(ayscType, '/aws/checkclue/visitDetail', data);
export const callbackSubmit = (data) => $axios(ayscType, '/aws/checkclue/visitSubmit', data);
/*线索商机统计*/
export const collectCount = (data) => $axios(ayscType, '/aws/checkclue/analysisTable', data);
/*成员管理*/
export const getServiceMemberList = (data) => $axios(ayscType, '/aws/member/customerSTeam', data);
/* ============= 顾问leader ============= */
/*待分配婚礼*/
export const getAssignment = (data) => $axios(ayscType, '/aws/public/list', data);
export const getAssignmentView = (data) => $axios(ayscType, '/aws/checkclue/showClue', data);
export const getAssignmentAdviserList = (data) => $axios(ayscType, '/aws/public/allPlanners', data);
export const AssignmentSubmit = (data) => $axios(ayscType, '/aws/pleader/submit', data);
export const AssignmentAgainSubmit = (data) => $axios(ayscType, '/aws/pleader/singleturn', data);
/*成员管理*/
export const getMemberList = (data) => $axios(ayscType, '/aws/member/list', data);
export const getAloneMemberList = (data) => $axios(ayscType, '/aws/member/pwlist', data);
/*激活*/
export const activeTask = (data) => $axios(ayscType, '/aws/planner/active', data);
/* ============= 顾问 ============= */
/*跟进中的婚礼:列表*/
export const getAdviserTaskList = (data) => $axios(ayscType, '/aws/planner/wedlist', data);
/*跟进中的婚礼:详情*/
export const adviserOrderInfo = (data) => $axios(ayscType, '/aws/planner/showdetail', data);
export const adviserStepList = (data) => $axios(ayscType, '/aws/planner/nodelist', data);
export const adviserNodeSubmit = (data) => $axios(ayscType, '/aws/planner/chksubmit', data);
export const getCurrentStepForm = (data) => $axios(ayscType, '/aws/planner/orderwins', data);
export const adviserOrderSubmit = (data) => $axios(ayscType, '/aws/planner/ordersubmit', data);
/*跟进中的婚礼:服务流程*/
export const serviceInfo = (data) => $axios(ayscType, '/aws/task/taskNodes', data);
export const serviceStepList = (data) => $axios(ayscType, '/aws/task/taskNodesList', data);
export const serviceSwitchSubmit = (data) => $axios(ayscType, '/aws/task/submit', data);
export const serviceUploadRemove = (data) => $axios(ayscType, '/aws/upload/delete', data);
export const getCurrentServiceForm = (data) => $axios(ayscType, '/aws/task/toTaskWins', data);
export const serviceOrderSubmit = (data) => $axios(ayscType, '/aws/task/submit', data);
/*合同付款提交*/
export const adviserPayMent = (data) => $axios(ayscType, '/aws/planner/payment', data);
/*丢单*/
export const getLoseWin = (data) => $axios(ayscType, '/aws/planner/toLosingWin', data);
export const submitLoseWin = (data) => $axios(ayscType, '/aws/planner/losing', data);
