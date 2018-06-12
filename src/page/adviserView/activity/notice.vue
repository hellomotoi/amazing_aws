<template>
  <div class="notice">
    <ul class="tab">
      <li :class="{'active': currentFlag === item.key}"
          v-for="item in flagList"
          @click="changeTab(item.key)">{{item.text}}</li>
    </ul>
    <div class="notice-content" v-loading="loading">
      <ul class="content-list">
        <!--"type" 1-下拉框，2-输入框，3-大输入框（文本域），4-时间选择器，5-复选框，6-接入地图api筛选框，7-页面不显示-->
        <li v-for="(item, index) in tabContent" v-if="item.type!==7">
          <p class="title">{{item.name}}</p>
          <!--1-下拉框-->
          <div class="content-box" v-if="item.type===1">
            <el-select v-model="fromData[item.key]" placeholder="请选择">
              <el-option
                v-for="i in item.value"
                :key="i.key"
                :label="i.value"
                :value="i.key">
              </el-option>
            </el-select>
          </div>
          <!--2-输入框-->
          <div class="content-box" v-if="item.type===2">
            <el-input v-model="fromData[item.key]" placeholder="请输入内容"></el-input>
          </div>
          <!--3-大输入框（文本域）-->
          <div class="content-box" v-if="item.type===3">
            <el-input
              v-model="fromData[item.key]"
              type="textarea"
              :rows="2"
              placeholder="请输入内容">
            </el-input>
          </div>
          <!--4-时间选择器-->
          <div class="content-box" v-if="item.type===4">
            <el-date-picker
              v-model="fromData[item.key]"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <!--5-复选框-->
          <div class="content-box" v-if="item.type===5">
            <el-checkbox-group v-model="fromData[item.key]">
              <el-checkbox
                v-for="i in item.value"
                :label="`${i.card}|${i.name}|${i.value}`">
                {{i.card}}：{{i.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!--6-接入地图api筛选框-->
          <div class="content-box" v-if="item.type===6">
            <el-input
              class="map-input el-autocomplete"
              v-model="fromData[item.key]"
              type="text"
              placeholder="请输入地点">
            </el-input>
            <div class="clear"></div>
            <ul class="result-box" v-if="isShowMapResult && queryResult && queryResult.length">
              <li class="my-item-zh" v-for="item in queryResult" @click="resultClickHandle(item)">
                <div class="name-box">
                  <span class="name">{{item.name}}</span>
                  <span class="num" v-if="item.num">({{item.num}})</span>
                </div>
                <span class="address" v-if="item.address">{{item.address}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="button-box">
        <button @click="submit" type="button" class="el-button el-button--primary"><span>提交</span></button>
      </div>
    </div>
  </div>
</template>
<script>
  import Bus from '../../../store/bus.js'
  import {mapState} from 'vuex'
  import {getMsgWin, submitMsg, mapApi} from '../../../service/getData.js'
  export default{
    data(){
      return {
        loading: false,
        fromData: { //初始表单数据
          record: '',
          tags: '',
          reserve_time: '',
          remind_ids: [],
          remind_time: '',
          reserve_location: '',
          lat: '',
          lng: ''
        },
        submitFormData: {}, //用于提交的表单数据
        queryResult: [],
        flagList: [{
          key: 'dailyLog',
          text: '日常记录'
        }/*, {
          key: 'booking',
          text: '新建预约'
        }, {
          key: 'invitation',
          text: '邀请'
        }*/],
        currentFlag: '', //当前tab
        tabContent: [],   //当前tab的内容
        isShowMapResult: false,
        checkPass: false
      }
    },
    props     : [],
    computed  : {
      ...mapState(['userId'])
    },
    components: {
    },
    created(){
      this.changeTab(this.flagList[0].key);
      this.getMsgWinHandle();
    },
    mounted() {
      document.onkeyup = (e) => {
        const isMapInput = (Array.from(e.target.parentNode.classList)).indexOf('map-input') === -1 ? false : true;
        if(isMapInput){
          console.log(e.target.value)
          this.fromData.lat = '';
          this.fromData.lng = '';
          this.queryMap(e.target.value);
        }
      }
    },
    methods   : {
      /*切换tab*/
      changeTab(key){
        if(this.currentFlag === key) return;
        console.log('currentFlag: ' + key)
        this.currentFlag = key;
        this.clearValue(this.fromData);
        this.getMsgWinHandle();
      },
      /*获取当前tab内容*/
      getMsgWinHandle(){
        this.loading = true;
        const params = {
          uid: this.userId,
          id: this.$route.params.id,
          flag: this.currentFlag
        };
        getMsgWin(params).then(res => {
          this.loading = false;
          this.tabContent = res.data.data;
        })
      },
      /*清除表单数据*/
      clearValue(json){
        this.submitFormData = {};
        for(let i in json){
          const type = Object.prototype.toString.call(json[i]);
          if(type === '[object String]' || type === '[object Date]'){
              json[i] = ''
          }else if(type === '[object Number]'){
              json[i] = 0
          }else if(type === '[object Boolean]'){
              json[i] = false
          }else if(type === '[object Array]'){
              json[i] = []
          }else if(type === '[object Object]'){
              json[i] = {}
          }
        }
      },
      /*查询地图API搜索结果*/
      queryMap(queryString) {
        const params = {
          q     : queryString,
          region: '全国',
          output: 'json',
          ak    : 'BC308353571b484281ea5957aa67109c',
          scope : 1,
          method: 'get'
        }
        mapApi(params).then(res => {
          this.queryResult = res.data.data.listData;
          this.isShowMapResult = true;
        })
      },
      /*地图搜索结果点击handle*/
      resultClickHandle(data){
        console.log(data)
        if(data.num){ //返回为城市列表
          this.isShowMapResult = false;
          this.fromData.reserve_location = `${data.name} ${this.fromData.reserve_location}`;
          console.log(this.fromData.reserve_location)
          this.queryMap(this.fromData.reserve_location);
        }else{
          this.fromData.reserve_location = data.name;
          this.fromData.lat = data.lat;
          this.fromData.lng = data.lng;
          this.isShowMapResult = false;
        }
      },
      check(){
        this.checkPass = true;
        /*整理数据格式*/
        this.tabContent.forEach(item => {
          switch(item.type){
            case 4:
              /*时间：传10位时间戳*/
              this.submitFormData[item.key] = JSON.stringify(parseInt(new Date(this.fromData[item.key]).getTime() / 1000));
              console.log(this.submitFormData[item.key])
              break;
            case 5:
              /*复选框*/
              this.submitFormData[item.key] = this.fromData[item.key].toString();
              break;
            default:
              this.submitFormData[item.key] = this.fromData[item.key];
          }
        })
        console.log('submitFormData: '+JSON.stringify(this.submitFormData));
        /*校验*/
        for(let i in this.submitFormData){
          let item = this.submitFormData[i];
          if(!item || item=='null'){
            this.checkPass = false;
            let errMsg = '';
            for (var j=0; j<this.tabContent.length; j++){
              const jVal = this.tabContent[j];
              if(jVal.key === i){
                this.$message({
                  message: `${jVal.name}不能为空！`,
                  showClose: true,
                  customClass:"err",
                  iconClass:'icon-wrong'
                });
              }
            }
            return false;
          }
        }
      },
      submit(){
        this.check();
        if(this.checkPass){
          const params = {
            uid: this.userId,
            id: this.$route.params.id,
            flag: this.currentFlag
          }
          Object.assign(params, this.submitFormData);
          submitMsg(params).then(item => {
            this.clearValue(this.fromData);
            Bus.$emit('refreshOrderInfo');
          })
        }
      }
    },
    watch     : {
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .notice {
    margin-bottom: 20px;
    border: 1px solid #DFDFDF;
    border-radius: 6px;
    ul.tab{
      display: flex;
      height: 45px;
      border-bottom: 1px solid #DFDFDF;
      li{
        width: 96px;
        height: 45px;
        line-height: 45px;
        border-right: 1px solid #DFDFDF;
        border-bottom: 1px solid #DFDFDF;
        text-align: center;
        font-size: 14px;
        color: #585858;
        border-radius: 6px 0 0 0;
        background: #fff;
        cursor: pointer;
        &.active{
          height: 46px;
          border-bottom: none;
          color: #4A90E2;
        }
      }
    }
    .notice-content{
      padding: 17px 27px 20px;
      font-size: 14px;
      color: #3F3F3F;
      .button-box{
        padding-top: 20px;
        text-align: right;
        button{
          padding:0;
          width: 109px;
          height: 32px;
          span{
            line-height: 32px;
            font-size: 12px;
          }
        }
      }
      ul.content-list{
        li{
          .input-tips{
            padding-top: 7px;
          }
          p.title{
            margin: 12px 0;
          }
          .content-box {
            position: relative;
            zoom: 1;
            &:after {
              content: "";
              clear: both;
              display: block;
              height: 0;
              visibility: hidden;
              overflow: hidden;
            }
            /*百度地图API搜索结果*/
            ul.result-box{
              position: absolute;
              left: 0;
              top: 36px;
              width: 100%;
              max-height: 280px;
              overflow: auto;
              background-color: #fff;
              border: 1px solid #d1dbe5;
              border-radius:0 0 4px 4px;
              box-sizing: border-box;
              box-shadow: 0 0 6px 0 rgba(0,0,0,.04), 0 2px 4px 0 rgba(0,0,0,.12);
              li{
                padding: 10px;
                cursor: pointer;
                &:hover{
                  background: #e4e8f1;
                }
                &:last-child{
                  border-bottom: none;
                }
                .name-box{
                  line-height: 1;
                  .name{

                  }
                  .num{
                    font-size: 12px;
                    color: #b4b4b4;
                  }
                }
                .address{
                  display: block;
                  margin-top: 7px;
                  line-height: 1;
                  font-size: 12px;
                  color: #b4b4b4;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .notice {
    .el-select, .el-input{
      width: 192px !important;
    }
    .el-autocomplete{
      width: 546px !important;
      .el-input{
        width: 546px !important;
      }
    }
    .el-textarea{
      width: 546px !important;
    }
    .el-checkbox__inner{
      border-radius: 50% !important;
    }
    .el-checkbox-group{
      .el-checkbox{
        padding-right: 8px;
        .el-checkbox__input{
          padding-right: 8px;
        }
      }
    }
  }
</style>
