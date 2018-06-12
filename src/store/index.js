/*
 * @Author: chen
 * @Date:   2017-04-12 14:19:37
 * @Last Modified by:   chen
 * @Last Modified time: 2017-05-05 16:28:56
 */
'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import WebStorageCache from 'web-storage-cache'
Vue.use(Vuex);
const wsCache = new WebStorageCache();
const state = {
  userData   : {},
  userId     : '',
  stepId     : '',
  freshNavNum: 0
};
const getters = {};
const mutations = {
  /*清空或删除state数据*/
  clearState(state, data){
    if (data) {
      delete state['' + data];
    } else {
      for (let val in state) {
        delete state['' + val];
      }
    }
  },
  /*存储state和localStorage（用于登录或重新获取用户信息后）*/
  pushUserData(state, data){
    const exp = 8 * 60 * 60;  //失效时间8小时（单位：秒）
    const userData = data.userData;
    const userId = data.userData.userInfo.id;
    const authData = data.authData;
    state.userData = userData;
    state.userId = userId;
    state.authData = authData;
    wsCache.set('userData', userData, {exp: exp});
    wsCache.set('userId', userId, {exp: exp});
    wsCache.set('authData', authData, {exp: exp});
  },
  /*在localStorage中取出用户信息，存储到state上（用于未退出，刷新页面时）*/
  setUserData(state){
    if (wsCache.get('userId')) {
      const userData = wsCache.get('userData');
      const userId = wsCache.get('userData').userInfo.id;
      const authData = wsCache.get('authData');
      state.userData = userData;
      state.userId = userId;
      state.authData = authData;
    } else {
      this.$router.push('/login');
    }
  },
  /*删除用户信息（用于退出登录）*/
  removeUserData(state, data){
    setTimeout(function () {
      localStorage.removeItem('userData');
      localStorage.removeItem('userId');
      localStorage.removeItem('authData');
    }, 300);
  },
  pushStepID(state, data){
    state.stepId = data;
  },
  pushNavNum(state){
    ++state.freshNavNum;
  }
};
const actions = {}
export default new Vuex.Store({
  state, getters, mutations, actions
})
