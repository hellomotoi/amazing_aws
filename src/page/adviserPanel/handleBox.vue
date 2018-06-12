<template>
  <div class="handle-box">
    <div class="title">
      <h4>{{title}}</h4>
      <span class="refresh">刷新</span>
    </div>
    <div class="content">
      <ul>
        <li class="sys">
          <div class="left-box">
            <p class="name">
              <span>系统超时提醒</span>
              <!--wait、done、finish、over-->
              <span class="status over">已超时</span>
            </p>
            <p class="desc">ID 20170812891 [未跟进]</p>
          </div>
          <div class="right-box over">-5:30</div>
        </li>
        <li class="wait">
          <div class="left-box">
            <p class="name">
              <span>ID 20170712009</span>
              <span class="status wait">待预约</span>
            </p>
            <p class="desc">主题：[与新人一起勘察场地]</p>
          </div>
          <div class="right-box">下午 5:40</div>
        </li>
        <li class="done">
          <div class="left-box">
            <p class="name">
              <span>ID 20170712009</span>
              <span class="status done">预约成功</span>
            </p>
            <p class="desc">主题：[与新人一起勘察场地]</p>
          </div>
          <div class="right-box">下午 5:40</div>
        </li>
        <li class="sys">
          <div class="left-box">
            <p class="name">
              <span>ID 20170712009</span>
              <span class="status finish">已到店</span>
            </p>
            <p class="desc">主题：[与新人一起勘察场地]</p>
          </div>
          <div class="right-box">下午 5:40</div>
        </li>
        <li class="sys">
          <div class="left-box">
            <p class="name">
              <span>ID 20170712009</span>
              <span class="status finish">已到店</span>
            </p>
            <p class="desc">主题：[与新人一起勘察场地]</p>
          </div>
          <div class="right-box">下午 5:40</div>
        </li>
        <li class="sys">
          <div class="left-box">
            <p class="name">
              <span>ID 20170712009</span>
              <span class="status finish">已到店</span>
            </p>
            <p class="desc">主题：[与新人一起勘察场地]</p>
          </div>
          <div class="right-box">下午 5:40</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {}
    },
    props     : [
      'title'
    ],
    computed  : {},
    components: {},
    created(){
    },
    mounted(){
    },
    methods   : {},
    watch     : {}
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .handle-box {
    display: flex;
    flex-direction: column;
    .title{
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      padding: 26px;
      border-bottom: 2px solid #F2F7FA;
      h4{
        font-size: 18px;
        color: #222222;
      }
      .refresh{
        font-size: 16px;
        color: #4A90E2;
        cursor: pointer;
      }
    }
    .content{
      overflow-y: auto;
      ul{
        li{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 22px 20px 81px;
          border-bottom: 2px solid #F2F7FA;
          background-size: 42px 42px;
          &:last-child{
            border-bottom: none;
          }
          /*图标*/
          &.sys{
            background: url("../../images/panel/Oval_1.png") no-repeat;
            background-position: 20px center;
          }
          &.wait{
            background: url("../../images/panel/Oval_2.png") no-repeat;
            background-position: 20px center;
          }
          &.done{
            background: url("../../images/panel/Oval_3.png") no-repeat;
            background-position: 20px center;
          }
          .left-box{
            .name{
              font-size: 16px;
              color: #4A4A4A;
              display: flex;
              align-items: center;
              .status{
                margin-left: 13px;
                padding: 5px 8px;
                border-radius: 2px;
                font-size: 12px;
                &.wait{
                  color: #4A90E2;
                  background: #dbe9f9;
                }
                &.done{
                  color: #49B111;
                  background: #dbefcf;
                }
                &.finish{
                  color: #565656;
                  background: #ebebeb;
                }
                &.over{
                  color: #D0021B;
                  background: #f6cbd1;
                }
              }
            }
            .desc{
              margin-top: 15px;
              font-size: 14px;
              color: #4A4A4A;
            }
          }
          .right-box{
            font-size: 14px;
            line-height: 16px;
            &.wait{
              color: #D0021B;
            }
            &.done{
              color: #49B111;
            }
            &.finish{
              color: #D0021B;
            }
            &.over{
              color: #D0021B;
            }
          }
        }
      }
    }
  }
</style>
