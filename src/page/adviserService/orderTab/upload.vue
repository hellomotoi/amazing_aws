<template>
  <p v-if="item.type==3" class="upload-box" :class="{'disable': target!='followUp'}">
    <!--不可用-->
    <el-button v-if="item.value.length>0 || target!='followUp' || isLoading"
               type="primary"
               :disabled="true">
      <i class="upload-icon"></i>
      <span>上传文件</span>
    </el-button>
    <span v-if="item.value.length>0 && target!='followUp'">
      <a class="down-link" v-for="i in item.value" :href="i.url" :download="i.url">
        <i class="el-icon-document"></i>{{i.name}}
      </a>
    </span>
    <!--可用-->
    <el-upload
      v-if="target=='followUp'"
      class="upload"
      action="/aws/upload/submit"
      :class="{'disabled':item.value.length>0}"
      :data="{
                  'uid':userData.userInfo.id,
                  'id':$route.params.id,
                  'taskId':item.id
                }"
      :multiple="false"
      :before-upload="uplBeforeHandle"
      :on-remove="uplRemoveHandle"
      :on-success="uplSuccessHandle"
      :on-error="uplErrorHandle"
      :on-preview="uplPreviewHandle"
      :file-list="item.value">
      <el-button size="small" type="primary" v-if="!item.value.length && !isLoading">
        <i class="upload-icon"></i>
        <span>上传文件</span>
      </el-button>
    </el-upload>
  </p>
</template>
<script>
  import {mapState} from 'vuex'
  import Bus from '../../../store/bus.js'
  import {serviceSwitchSubmit, serviceUploadRemove} from '../../../service/getData.js'
  export default{
    data(){
      return {
        isLoading: false, //用于判断是否正在上传文件
        target   : this.$route.params.target
      }
    },
    props     : [
      'item'
    ],
    computed  : {
      ...mapState(['userData'])
    },
    components: {},
    created(){
    },
    methods   : {
      /*上传文件前*/
      uplBeforeHandle(file){
        this.isLoading = true;
      },
      /*删除上传的文件*/
      uplRemoveHandle(file, fileList){
        let params = {
          'uid'         : this.userData.userInfo.id,
          'id'          : this.$route.params.id,
          'taskId'      : file.taskIds,
          'attachmentId': file.id
        };
        serviceUploadRemove(params).then(res => {
          if (res.error) {
            this.$message({
              message    : res.msg,
              showClose  : true,
              customClass: "err",
              iconClass  : 'icon-wrong'
            });
          }
          ;
          Bus.$emit('menuTotal');
          Bus.$emit('stepSubmit');
        })
      },
      /*上传成功*/
      uplSuccessHandle(res, file, fileList){
        this.isLoading = false;
        if (res.error) {
          this.$message({
            message    : res.msg,
            showClose  : true,
            customClass: "err",
            iconClass  : 'icon-wrong'
          });
        }
        ;
        Bus.$emit('menuTotal');
        Bus.$emit('stepSubmit');
      },
      /*上传失败*/
      uplErrorHandle(err, file, fileList){
        this.isLoading = false;
      },
      /*点击文件下载*/
      uplPreviewHandle(file){
        let oA = document.createElement('a');
        oA.href = file.url;
        oA.download = file.url;
        oA.click();
      }
    }
  }
</script>
