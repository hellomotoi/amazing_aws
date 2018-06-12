<template>
  <router-view></router-view>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import WebStorageCache from 'web-storage-cache'
  export default {
    created(){
      this.setUserData();
    },
    props  : [],
    methods: {
      ...mapState(['userData']),
      ...mapMutations(['setUserData'])
    }
  }
</script>
