<template>
  <div id='openDetail'>
    <header id="opTop">
      <div class="left">
        <div class="go-back" @click="goBack">返回</div>
        <div class="title">
          No.{{detail.code}}&nbsp;{{detail.group}}
        </div>
        <div class="desc">
          <span class="status">{{detail.status}}</span>
          <span class="text">录入客服：{{detail.following}}</span>
          <span class="text">提交时间：{{detail.createDate}}</span>
        </div>
      </div>
      <div class="right">
        <el-button @click="aband(detail.code)">废弃线索</el-button>
      </div>
    </header>
    <div id='opContent' class="opContent">
      <el-form :model="ruleForm1" :rules="rule1" class='userMes'
               ref="ruleForm1" label-position="right"
               label-width="90px">
        <div class='title-t'>
          <span>核实内容</span>
        </div>
        <section class="editArea">
          <p class='left-title'>客户信息</p>
          <el-form-item label="客户姓名" prop="name">
            <el-input type="text" v-model="ruleForm1.name" :maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input type="tel" v-model="ruleForm1.phone" :maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户微信" prop="weixin">
            <el-input v-model="ruleForm1.weixin"></el-input>
          </el-form-item>
          <el-form-item label="客户身份" prop="card" id="opCard">
            <el-select v-model="ruleForm1.card" placeholder="请选择">
              <el-option label="新郎" value="1"></el-option>
              <el-option label="新娘" value="2"></el-option>
              <el-option label="亲友" value="3"></el-option>
              <el-option label="未确定" value="4" disabled></el-option>
            </el-select>
          </el-form-item>
        </section>
        <section class="editArea">
          <p class='left-title'>婚礼基本信息</p>
          <el-form-item label="婚礼日期" prop="wedDate">
            <el-cascader v-model="ruleForm1.wedDate"
                         change-on-select
                         :options="date_options">
            </el-cascader>
          </el-form-item>
          <el-form-item label="婚礼人数" prop="guest_num">
            <el-input type="tel" v-model="ruleForm1.guest_num" auto-complete="off" placeholder="婚礼人数"></el-input>
          </el-form-item>
          <el-form-item label="举办城市" prop="location">
            <el-cascader
              @change="handleItemChange"
              :options="city_options"
              change-on-select
              v-model="ruleForm1.location"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="婚礼预算" id='wedCost' prop='budgetCostState'>
            <el-select v-model="ruleForm1.budgetCostState" placeholder="请选择">
              <el-option label="未确定" value="1"></el-option>
              <el-option label="已确定" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='budgetCostRange' id='range' v-if='ruleForm1.budgetCostState==2'>
            <div class="range-wrap">
              <el-input
                class='numCost'
                v-model="ruleForm1.budgetCostRange[0]"
                size="small"></el-input>

              <span style="opacity:.5;">&nbsp;万 —&nbsp;</span>

              <el-input class='numCost'
                        v-model="ruleForm1.budgetCostRange[1]"
                        size="small"></el-input>
              <span style="opacity:.5;">&nbsp;万</span>
            </div>
          </el-form-item>
          <el-form-item label="婚礼场地" prop="hotel">
            <el-input
              type="textarea"
              :maxlength="250"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入婚礼场地"
              v-model="ruleForm1.hotel">
            </el-input>
          </el-form-item>
          <el-form-item label="总体预算" prop="budget_remark">
            <el-input
              type="textarea"
              :maxlength="250"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请注明包括哪些项目，如婚宴，婚纱摄影、蜜月旅行等"
              v-model="ruleForm1.budget_remark">
            </el-input>
          </el-form-item>
        </section>
        <section class="editArea">
          <p class='left-title'>核实信息</p>
          <el-form-item label="核实备注" prop="check_remark">
            <el-input
              type="textarea"
              :maxlength='400'
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入核实备注"
              v-model="ruleForm1.check_remark">
            </el-input>
          </el-form-item>
        </section>
        <section class="editArea">
          <p class='left-title'>线索信息</p>
          <div class="clueMsg">
            <el-row v-for="item in cluMsg">
              <el-col class="msg-name-box">
                <div class="grid-content msg-name">{{item.name}}</div>
              </el-col>
              <el-col class="msg-val-box">
                <div class="grid-content msg-val">{{item.value}}</div>
              </el-col>
            </el-row>
          </div>
        </section>
      </el-form>
    </div>
    <footer>
      <el-button type="primary" size="large" :loading="subloading" @click="submitForm('ruleForm1')">
        核实
      </el-button>
      <el-button size="large" @click="tempSubmit('ruleForm1,ruleForm1,ruleForm1')">暂存</el-button>
    </footer>
    <aband-window
      :dialogFormVisible="abandWindowVisible"
      :id="detail.code">
    </aband-window>
    <confirmWindow
      :commitVisible="commitVisible"
      :title="commitWinData.title"
      :content="commitWinData.content"
      :type="commitWinData.type"
      @doSubmit="doSubmit('ruleForm1,ruleForm1,ruleForm1')"
    >
    </confirmWindow>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {showClue, getRegion, optCheck} from '../../service/getData.js'
  import Bus from '../../store/bus.js'
  import dateData from '../../plugins/dateData.js'
  import abandWindow from '../../components/window/abandWindow.vue'
  import confirmWindow from '../../components/window/confirmWindow.vue'
  export default {
    components: {
      abandWindow, confirmWindow
    },
    data(){
      /* 自定义校验规则 */
      var validateTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(parseInt(value))) {
            callback(new Error('请输入数字值'));
          } else {
            let telReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(value);
            if (!telReg) {
              callback(new Error('手机格式有误'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validateName = (rule, value, callback) => {
        if (value === '' || value == undefined) {
          return callback(new Error('姓名不能为空'));
        } else if (value.length > 11) {
          return callback(new Error('姓名过长'));
        }
        {
          callback();
        }
      };
      var validateGuest_num = (rule, value, callback) => {
        if (value === '' || value == undefined) {
          return callback(new Error('请填写人数,若人数未确定请填"未确定"'));
        } else {
          // let telReg = /^[0-9]*$/.test(value);
          // if (!telReg) {
          // callback(new Error('请填写数字'));
          // } else {
          callback();
          // }
        }
      };
      var validateRange = (rule, value, callback) => {
        if ((value[0] === '' || value[0] == undefined) || (value[1] === '' || value[1] == undefined)) {
          return callback(new Error('请填写婚礼预算'));
        } else {
          let val0 = value[0]*1;
          let val1 = value[1]*1;
          if (val0+''=='NaN' || val1+''=='NaN') {
            return callback(new Error('请填写数字'));
          } else if (val0 >= val1) {
            return callback(new Error('下限数字要大于上限'));
          } else {
            callback();
          }
        }
      };
      return {
        subloading        : false,
        /*废弃窗口显示与否*/
        abandWindowVisible: 0,
        commitVisible     : 0,
        /*确认窗口的title*/
        commitWinData     : {
          title  : "",
          content: '',
          type   : null
        },
        city_options      : [{value: -1, label: '未确定',}],
        date_options      : dateData,
        detail            : '',
        roleShow          : false,
        cluMsg            : [],
        ruleForm1         : {
          card           : '',
          budgetCostRange: [null, null],
          budgetCostState: '',
          wedDate        : [],
          location       : [],
          check_remark   : '',
        },
        rule1             : {
          phone          : [
            {required: true, validator: validateTel, trigger: 'blur'}
          ],
          name           : [
            {required: true, validator: validateName, trigger: 'blur'}
          ],
          card           : [
            {required: true, message: '请确认用户身份', trigger: 'blur'}
          ],
          guest_num      : [
            {required: true, validator: validateGuest_num, trigger: 'blur'}
          ],
          wedDate        : [
            {type: 'array', required: true, message: '请填写用户日期', trigger: 'change'}
          ],
          budget_remark  : [
            {required: true, message: '请填写总体预算', trigger: 'change'}
          ],
          hotel          : [
            {required: true, message: '请填写婚礼场地', trigger: 'change'}
          ],
          location       : [
            {type: 'array', required: true, message: '请选择举办城市', trigger: 'change'}
          ],
          budgetCostState: [
            {required: true, message: '请选择婚礼预算', trigger: 'change'}
          ],
          budgetCostRange: [
            {type: 'array', required: true, validator: validateRange, trigger: 'blur'}
          ],
          check_remark   : [
            {required: true, message: '请填写核实备注', trigger: 'blur'}
          ]
        }
      }
    },
    created(){
      this.getClueCitys([]);
      this.getClueDetail({'id': this.$route.params.id, "type": this.$route.params.target});
    },
    methods   : {
      ...mapState(['userData']),
      /*获取城市方法*/
      getClueCitys(data, fn){
        let deeplens = data.length;
        console.log('deeplens', deeplens);
        let getCity = {
          parentId: data[deeplens - 1] || 0
        }
        getRegion(getCity).then(res => {
          var res = res.data;
          if (res.code != 200) {
            this.$message.error('接口出错');
            return;
          }
          console.log('城市数据start', this.city_options);
          switch (deeplens) {
            case 1:
              this.city_options.forEach(country => {
                if (country.value == data[0]) {
                  if (res.data.length == 0) {
                    country.children = null;
                    return;
                  }
                  country.children = [];
                  res.data.forEach(province => {
                    country.children.push({value: province.id, label: province.name, children: province.child})
                  })
                }
              })
              break;
            case 2:
              this.city_options.forEach(country => {
                if (country.value == data[0]) {
                  country.children.forEach(province => {
                    if (province.value == data[1]) {
                      if (res.data.length == 0) {
                        province.children = null;
                        return;
                      }
                      province.children = [];
                      res.data.forEach(city => {
                        province.children.push({value: city.id, label: city.name})
                      })
                    }
                  })
                }
              })
              break;
            case 3:
              console.log('暂无');
              break;
            default:
              this.city_options = [{value: -1, label: '未确定'}];
              res.data.forEach(country => {
                this.city_options.push({value: country.id, label: country.name, children: country.child})
              });
              break;
          }
          if (fn) {
            fn();
          }
          console.log('城市数据end', this.city_options);
        })
      },
      /*城市选中某一级的回调*/
      handleItemChange(val) {
        console.log('change', val);
        if (val[0] != -1)
          this.getClueCitys(val);
      },
      /*废弃*/
      aband(id){
        ++this.abandWindowVisible;
      },
      openMsg(msg) { // 警告提示
        this.$notify({
          title  : '提示',
          message: msg,
          type   : 'warning',
        });
      },
      getClueDetail(data){ // 获取详情
        showClue(data).then(res => {
          console.log('获取原始数据:', res);
          var res = res.data;
          if (res.code != 200) {
            this.$message.error('接口出错');
            return;
          }
          this.$refs.ruleForm1.resetFields();
          this.$refs.ruleForm1.resetFields();
          this.$refs.ruleForm1.resetFields();
          this.detail = res.data.top; // 顶部数据
          this.cluMsg = res.data.clue;
          res.data.user.forEach(item => {
            this.ruleForm1[item.key] = item.value;
          })
          this.ruleForm1.card = this.ruleForm1.card.toString();
          res.data.wed.forEach(item => {
            if (item.key instanceof Array) {
              if (item.name == "婚礼预算") {
                this.ruleForm1.budgetCostState = item.status.toString();
                var flag = item.value.every(key => {
                  return key == ''
                })
                if (flag) {
                  this.ruleForm1.budgetCostState = null; // 这个改成空字符串就gg了 \(^o^)/
                  this.ruleForm1.budgetCostRange = [null, null];
                }
                else if (item.value[0] == -1) {
                  this.ruleForm1.budgetCostState = '1';
                  this.ruleForm1.budgetCostRange = [null, null];
                }
                else {
                  this.ruleForm1.budgetCostState = '2';
                  this.ruleForm1.budgetCostRange = item.value || [null, null];
                }
                console.log(this.ruleForm1.budgetCostRange)
              } else if (item.name == "婚礼日期") {
                var flag = item.value.every(key => {
                  return key == ''
                })
                if (flag) {
                  this.ruleForm1.wedDate = []
                } else {
                  this.ruleForm1.wedDate = item.value.map(minu => {
                    return minu - 0;
                  })
                }
              } else if (item.name == "举办城市") {
                var flag = item.value.every(key => {
                  return key == ''
                })
                if (flag) {
                  this.ruleForm1.location = [];
                } else {
                  this.ruleForm1.location = item.value.map(lc => {
                    return lc - 0;
                  });
                  console.log('location', this.ruleForm1.location);
                  if (this.ruleForm1.location[0] != -1 && this.ruleForm1.location[1] != '') {
                    this.getClueCitys([], () => {
                      this.getClueCitys([this.ruleForm1.location[0]], () => {
                        this.getClueCitys([this.ruleForm1.location[0], this.ruleForm1.location[1]]);
                      });
                    })
                  }
                }
              }
            } else {
              this.ruleForm1[item.key] = item.value;
            }
          })
          console.log(this.ruleForm1);
          res.data.check.forEach(item => {
            this.ruleForm1[item.key] = item.value;
          })
        })
      },
      form_query(forms, status){ // 特殊数据处理
        var forms = forms.split(',');
        console.log('原始发送数据', this[forms[0]]);
        var allFrom = {};
        var allFromtemp = {
          id            : this.detail.code,
          status        : status,
          ...this[forms[0]],
          wed_date_year : this[forms[0]].wedDate[0],
          wed_date_month: this[forms[0]].wedDate[1] || "",
          wed_date_day  : this[forms[0]].wedDate[2] || "",
          budget_begin  : this[forms[0]].budgetCostRange[0],
          budget_end    : this[forms[0]].budgetCostRange[1],
        }
        // 举办城市
        if (this[forms[0]].location[0] == -1) { // 未确定
          allFromtemp.nation = -1;
        }
        // else if (this[forms[0]].location[0] == 1) { // 再次修改城市信息
        //   allFromtemp.nation = 1;
        //   allFromtemp.province = this[forms[0]].location[1] || "";
        //   allFromtemp.city = this[forms[0]].location[2] || "";
        // }
        else {
          allFromtemp.nation = this[forms[0]].location[0] || "";
          allFromtemp.province = this[forms[0]].location[1] || "";
          allFromtemp.city = this[forms[0]].location[2] || "";
        }
        // 婚礼预算
        if (allFromtemp.budgetCostState == 1) { // 未确定
          allFromtemp.budget_begin = -1;
          allFromtemp.budget_end = '';
        } else {
          allFromtemp.budget_begin = allFromtemp.budgetCostRange[0];
          allFromtemp.budget_end = allFromtemp.budgetCostRange[1];
        }
        for (var key in allFromtemp) {
          if (typeof allFromtemp[key] != "object")
            allFrom[key] = allFromtemp[key];
        }
        console.log('封装数据', allFrom);
        return allFrom;
      },
      tempSubmit(forms){ // 暂存
        var allFrom = this.form_query(forms, 7);
        var uid = this.userData().userInfo.id;
        allFrom.uid = this.userData().userInfo.id;
        optCheck(allFrom).then(res => {
          var res = res.data;
          if (res.code == 200) {
            Bus.$emit('menuTotal');
            this.$message({
              showClose  : true,
              message    : '暂存成功',
              customClass: 'succ',
              iconClass  : 'icon-success'
            });
            this.$router.go(-1);
          } else {
            this.$message({
              showClose  : true,
              message    : '暂存失败',
              customClass: 'err',
              iconClass  : 'icon-wrong'
            });
          }
        })
      },
      doSubmit(forms){ // 核实
        this.subloading = true;
        var promises = forms.split(",").map(form => {
          return new Promise((resolve, reject) => {
            this.$refs[form].validate((valid) => {
              if (valid) {
                setTimeout(resolve, 0)
              } else {
                setTimeout(reject, 0)
                return false;
              }
            });
          });
        });
        console.log('进度', promises);
        Promise.all(promises).then(() => {
          var allFrom = this.form_query(forms, 3);
          allFrom.uid = this.userData().userInfo.id;
          console.log('核实提交数据', allFrom);
          if (allFrom.card == 4) {
            this.$message({
              showClose  : true,
              message    : '核实客户身份有误',
              customClass: 'err',
              iconClass  : 'icon-wrong'
            });
            this.subloading = false;
            return;
          }
          optCheck(allFrom).then(res => {
            var res = res.data;
            if (res.code == 200) {
              this.$message({
                showClose  : true,
                message    : '恭喜，又新增一条商机！',
                customClass: 'succ',
                iconClass  : 'icon-success'
              });
              this.subloading = false;
              this.$router.push(`/check/${this.$route.params.target}`);
            } else {
              this.$message({
                showClose  : true,
                message    : '核实失败',
                customClass: 'err',
                iconClass  : 'icon-wrong'
              });
            }
          })
        }).catch((err) => {
          console.log('错误信息', err);
          this.openMsg('信息有误');
          this.subloading = false;
        });
      },
      submitForm() {
        this.commitVisible++;
        this.commitWinData.title = '核实线索'
        this.commitWinData.content = '确定核实这条线索么？'
        this.commitWinData.type = 0;
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  /* top */
  #opTop {
    display: flex;
    justify-content: space-between;
    padding: 21px 0 7px 24px;
    border-bottom: solid 2px #F2F7FA;
    background-color: #fff;
    .left {
      .go-back {
        display: inline-block;
        padding-left: 19px;
        background: url("../../images/back_btn.png") no-repeat;
        background-size: 14px 14px;
        background-position: left center;
        background-size: contain;
        font-size: 13px;
        color: #919191;
        cursor: pointer;
      }
      .title {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #313131;
      }
      .desc {
        margin: 10px 0 3px;
        .status {
          width: 64px;
          height: 20px;
          line-height: 20px;
          background: #E3F0FF;
          border-radius: 4px;
          font-size: 12px;
          color: #4990E2;
          letter-spacing: 0;
          text-align: center;
        }
        .text {
          margin-left: 20px;
          font-size: 13px;
          color: #6F6F6F;
        }
      }
    }
    .right {
      margin-top: 55px;
      margin-right: 35px;
      .el-button {
        margin-left: 20px;
        padding: 10px 20px;
        border-color: #979797;
        color: #313131;
        &:hover {
          border-color: #979797;
          color: #313131;
        }
        &.primary {
          border-color: #4990E2;
          color: #4990E2;
        }
      }
    }
  }
  /* content */
  #openDetail {
    border-left: 2px solid #f2f7fa;
    .opContent {
      background-color: #fff;
      .title-t {
        border-bottom: 1px solid #eaeaea;
        font-size: 16px;
        color: #313131;
        margin-left: 41px;
        span {
          position: relative;
          bottom: -3px;
          display: inline-block;
          width: 80px;
          height: 70px;
          line-height: 70px;
          border-bottom: 4px solid #4a90e2;
          text-align: center;
        }
      }
      .editArea {
        position: relative;
        margin-left: 41px;
        border-bottom: 1px solid rgba(151, 151, 151, 0.2);
        padding: 30px 0;
        .left-title {
          padding-bottom: 20px;
          font-size: 16px;
          color: #292929;
          letter-spacing: 0;
        }
        &:nth-last-child(1) {
          padding-bottom: 100px;
        }
      }

    }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 30px 41px;
      border-top: 2px solid #f2f7fa;
      background: #fff;
      z-index: 2;
    }
  }
  #openDetail .clueMsg .el-row {
    display: flex;
    margin-bottom: 25px;
    line-height: 20px;
  }
  #openDetail .grid-content.msg-val {
    font-size: 14px;
    color: #1F1F1F;
    word-break: break-all;
  }
  #openDetail .msg-name-box {
    margin-left: 160px;
    width: 140px;
  }
  #openDetail .grid-content.msg-name {
    font-size: 14px;
    color: #919191;
  }
  #openDetail .userMes, #openDetail .clueMsg {
    /*width: 800px;*/
    /*margin-left: 140px;*/
  }
  #openDetail .numCost {
    width: 50px;
    border-radius: 4px;
    float: none;;
  }
  #openDetail .opContent .el-form {
    /*padding-top: 20px;*/
  }
  #openDetail .opContent .el-form .el-form-item {
    margin-left: 140px;
    margin-bottom: 0px;
  }
  #openDetail .opContent .el-form .el-form-item + .el-form-item {
    margin-top: 25px;
  }
  #openDetail .el-button--large {
    padding: 11px 38px;
    border-radius: 4px;
    font-size: 14px;
    letter-spacing: 0;
  }
  #openDetail .el-button--large:not(:first-child) {
    margin-left: 35px;
  }
  #openDetail #range {
    position: absolute;
    left: 420px;
    margin-top: -36px;
    .range-wrap {
      float: left;
    }
  }
  .el-input--small .el-input__inner {
    height: 36px;
  }
  #openDetail #range .el-form-item__content {
    margin-left: 24px !important;
  }
  #openDetail .el-cascader {
    float: left;
  }
  #openDetail #wedCost .el-select {
    float: left;
    .el-input {
      width: 100%;
    }
  }
  #opCard .el-select {
    float: left;
    .el-input {
      width: 100%;
    }
  }
  #openDetail .editArea .el-input {
    width: 357px;
  }
  #openDetail .editArea .el-textarea {
    width: 357px;
  }
  #openDetail .editArea .numCost {
    width: 50px;
  }
</style>
