<!--废弃-->
<template>
  <el-dialog title="申请废弃" v-model="dialogVisible" id='abandWindow' :closeOnClickModal='false'>
    <el-form :model="form" :rules="rule" ref="form">
      <el-form-item label="废弃原因" :label-width="formLabelWidth" prop="lost_type">
        <el-select v-model="form.lost_type" placeholder="请选择">
          <el-option v-for="item in discardList" :label="item.name" :value="item.key"></el-option>
        </el-select>

        <p class="msg" v-for="item in discardList" v-if="form.lost_type==item.key">
          <i class="el-icon-warning"></i>
          {{item.tips}}
        </p>
      </el-form-item>
      <el-form-item label="回捞提醒" prop="lost_back_time" v-if='form.lost_type==3' :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.lost_back_time"
          type="date" format
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="废弃说明" :label-width="formLabelWidth" prop="lost_reason">
        <el-input
          :autosize="{ minRows: 4, maxRows: 888}"
          type="textarea" v-model="form.lost_reason"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false;">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="disabled">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {discard, toDiscardWin} from '../../service/getData.js'
  import {mapState} from 'vuex'
  import Bus from '../../store/bus.js'
  export default {
    data(){
      return {
        dialogVisible : false,
        formLabelWidth: '120px',
        disabled      : false,
        discardList   : null,
        form          : {
          lost_type     : null,
          lost_back_time: '',
          lost_reason   : '',
        },
        rule          : {
          lost_type     : [
            {required: true, message: '请选择废弃类型'}
          ],
          lost_reason   : [
            {required: true, message: '请填写废弃原因'}
          ],
          lost_back_time: [
            {required: true, message: '请选择回捞时间'}
          ]
        },
        pickerOptions : {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    created(){
      toDiscardWin({id: 622}).then(res => {
        var res = res.data;
        this.discardList = res.data;
      })
    },
    mounted(){
    },
    props   : ["dialogFormVisible", 'id'],
    computed: {
      ...mapState(['userId'])
    },
    methods : {
      submit(){
        this.disabled = true;
        this.$refs.form.validate((valid) => {
          if (valid) {
            let sendData = this.form;
            sendData.id = this.id;
            sendData.lost_type == 3 ? sendData.status = 8 : sendData.status = 4;
            if (sendData.lost_type == 3)
              sendData.lost_back_time = sendData.lost_back_time.getFullYear() + '-' +
                (sendData.lost_back_time.getMonth() + 1) + '-' + sendData.lost_back_time.getDate();
            sendData.uid = this.userId;
            discard(sendData).then(res => {
              var res = res.data;
              if (res.code == 200) {
                Bus.$emit('menuTotal');
                this.disabled = false;
                this.dialogVisible = false;
                this.$message({
                  showClose  : true,
                  message    : '废弃成功',
                  customClass: 'succ',
                  iconClass  : 'icon-success'
                });
                this.$router.push(`/check/${this.$route.params.target}`);
              }
            })
          } else {
            this.disabled = false;
            return false;
          }
        });
      }
    },
    watch   : {
      dialogFormVisible(val){
        this.dialogVisible = true;
      },
      dialogVisible(val){
        if (val == false) {
          this.$refs.form.resetFields();
          this.disabled = false;
        }
      }
    }
  }

</script>

<style lang="scss">
  #abandWindow {
    z-index: 9999 !important;
    background: rgba(0, 0, 0, 0.33);
  }
  #abandWindow .dialog-footer button {
    width: 109px;
    line-height: 12px;
  }
  #abandWindow .el-dialog__body {
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }
  #abandWindow .el-button + .el-button {
    margin-left: 18px;
  }
  #abandWindow .el-dialog__header {
    padding: 20px 20px;
    span {
      font-size: 18px;
      color: #343434;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
  #abandWindow .el-textarea {
    width: 95%;
  }
  #abandWindow .el-select {
    float: left;
  }
  #abandWindow .msg {
    float: left;
    display: inline-block;
    font-size: 12px;
    color: #D0011B;
    line-height: 30px;
    background: rgba(208, 1, 27, 0.1);
    border-radius: 4px;
    padding: 0 21px;
    height: 36px;
    line-height: 36px;
  }
</style>
