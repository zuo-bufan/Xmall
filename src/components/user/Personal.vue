<template>
  <div>
    <div class="box">
      <img class="avatar" :src="userInfo.headImg" alt="用户头像" title="用户头像">
      <div class="right">
        <h4 class="user_name">用户名：<span>{{userInfo.nickName}}</span></h4>
        <p class="coin">我的积分：<span>{{userInfo.coin}}</span>分</p>
        <div class="button">
          <div class="login_out" @click="loginOutFn">退出登录</div>
          <div class="jbwx" @click="isShowUnbin=true">解绑微信</div>
        </div>
      </div>
    </div>
    <!-- 解绑微信的模态框 -->
    <transition name="fade">
      <div class="modal" v-if="isShowUnbin" @mousewheel.prevent>
        <section @click="isShowUnbin=false"></section>
        <div class="wranbox">
          <div class="text">你确定要解绑此微信吗？解绑后需重新登录并绑定手机号</div>
          <div class="button1" @click="isShowUnbin=false">取消</div>
          <div class="button2" @click="unBindingWeChat">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {UnbinDingApi} from '../../request/api'
export default {
  name: 'Personal',
  data() {
    return {
      userInfo: null,
      // 解绑微信的模态框
      isShowUnbin: false
    }
  },
  methods: {
    // 退出登录
    loginOutFn() {
      this.$emit('outLogin')
    },
    // 解绑微信
    unBindingWeChat() {
      // 关闭模态框
      this.isShowUnbin = false
      UnbinDingApi().then(res => {
        this.$store.dispatch('changeToastAsync',{msg:res.data,type: 'success'})
        // 退出登录
        setTimeout(() => {
          localStorage.clear()
          this.$store.commit('changeIsLogined')
          this.$store.dispatch('changeToastAsync',{msg:'退出成功',type: 'success'})
          this.$router.push('/home')
        },2000)
      })
    }
  },
  created() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userInfo = userInfo
  }
}
</script>

<style lang="less" scoped>
@import '../../total.less';
.box {
  padding-top: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .avatar {
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
  .right {
    width: 230px;
    text-align: center;
    margin-left: 40px;
    .user_name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        font-weight: 700;
      }
    }
    .coin {
      margin: 20px 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        color: red;
      }
    }
    .button {
      display: flex;
      justify-content: space-between;
      .login_out, .jbwx {
        cursor: pointer;
        width: 100px;
        height: 50px;
        background: @blue;
        color: #fff;
        line-height: 50px;
        text-align: center;
      }
      .jbwx {
        background: #e7e7e7;
        color: #333;
      }
    }
  }
}



.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  section {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
  }
  .wranbox {
    border-radius: 10px;
    position: absolute;
    top: 0;left: 0;bottom: 0;right: 0;
    margin: auto;
    width: 320px;
    height: 190px;
    background: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    .text {
      text-align: center;
      margin-top: 40px;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
      color: #999;
    }
    .button1,.button2 {
      position: absolute;
      bottom: 20px;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
    .button1 {
      left: 30px;
      background: #ccc;
    }
    .button2 {
      right: 30px;
      background: @blue;
    }
  }
}


// 这里是模态框的过渡动画
// 入场的起始状态就等于立场的最终状态
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,.fade-leave-active {
transition: opacity .3s linear;
}
.fade-enter-to,.fade-leave {
opacity: 1;
}
</style>