import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import {routerMode} from './config/env';
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode  : routerMode,
  strict: process.env.NODE_ENV !== 'production'//production正式环境下不启用严格模式
})
new Vue({
  router, store
}).$mount('#app')

