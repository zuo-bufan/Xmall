<template>
  <div class="person_page">
    <div class="person banxin">
      <Mianbao>
        <span v-for="(item,index) in nav" :key="index" v-text="index<nav.length-1?item+' / ':item"></span>
      </Mianbao>
      <main>
        <aside>
          <div
              class="avatar"
              :style="{ backgroundImage: `url(${userInfo.headImg})` }"
          ></div>
          <div class="name"><span class="username">{{ userInfo.nickName }}</span> <span class="outlogin" @click="isShowOut=true">[退出]</span></div>
          <div class="title">
            <img
                src="../assets/images/person/transaction.png"
                width="20"
                alt="交易管理"
            />
            交易管理
          </div>
          <ul class="list">
            <li @click="goToRuter('账号管理','/user/personal')" :class="/\/personal/g.test($route.path) ? 'active' : ''">
              账号管理
            </li>
            <li @click="goToRuter('我的订单','/user/other1')" :class="/\/other1/g.test($route.path) ? 'active' : ''">
              我的订单
            </li>
            <li @click="goToRuter('购物车','/user/cart')" :class="/\/cart/g.test($route.path) ? 'active' : ''">
              购物车
            </li>
            <li @click="goToRuter('消息通知','/user/other2')" :class="/\/other2/g.test($route.path) ? 'active' : ''">
              消息通知
            </li>
            <li @click="goToRuter('积分明细','/user/other3')" :class="/\/other3/g.test($route.path) ? 'active' : ''">
              积分明细
            </li>
            <li @click="goToRuter('积分攻略','/user/other4')" :class="/\/other4/g.test($route.path) ? 'active' : ''">
              积分攻略
            </li>
          </ul>
          <div class="title">
            <img
                src="../assets/images/person/transaction.png"
                width="20"
                alt="交易管理"
            />
            个人信息管理
          </div>
          <ul class="list">
            <li @click="goToRuter('地址管理','/user/other5')" :class="/\/other5/g.test($route.path) ? 'active' : ''">地址管理</li>
            <li @click="goToRuter('账号安全','/user/other6')" :class="/\/other6/g.test($route.path) ? 'active' : ''">账号安全</li>
          </ul>
        </aside>
        <article>
          <router-view @outLogin="isShowOut=true" @gengxinnum="gengxinnum"></router-view>
        </article>
      </main>
    </div>
    <!-- 确认退出的模态框 -->
    <transition name="fade">
      <div class="modal" v-if="isShowOut" @mousewheel.prevent>
        <section @click="isShowOut=false"></section>
        <div class="wranbox">
          <div class="text">你确定要退出吗？</div>
          <div class="button1" @click="isShowOut=false">取消</div>
          <div class="button2" @click="loginOutFn">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Mianbao from '../components/Mianbao'
export default {
  name: 'User',
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      nav: ['首页','个人中心','购物车'],
      isShowOut: false
    };
  },
  components: {
    Mianbao
  },
  methods: {
    // 退出登录
    loginOutFn(){
      // 关闭模态框
      this.isShowOut = false
      localStorage.clear()
      this.$store.commit('changeIsLogined')
      this.$store.dispatch('changeToastAsync',{msg:'退出成功',type: 'success'})
      setTimeout(()=>{
        this.$router.push('/home')
      }, 1000)
    },
    // 通知app组件重新加载header组件
    gengxinnum() {
      this.$emit('gengxinnum')
    },
    // 跳转路由
    goToRuter(val,route) {
      this.nav = ['首页','个人中心']
      this.nav.push(val)
      this.$router.push(route)
    }
  },
  created() {
    if (this.$route.path==='/user/personal') {
      this.nav = ['首页','个人中心','账号管理']
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/user/personal') {
        this.nav = ['首页','个人中心','账号管理']
      }
      if (to.path === '/user/cart') {
        this.nav = ['首页','个人中心','购物车']
      }
      return
    }
  }
};
</script>
<style lang="less" scoped>
@import "../total.less";
.person_page {
  background: #f5f5f5;
  main {
    border-top: 1px solid #e1e1e1;
    padding: 28px 0 48px;
    display: flex;
    justify-content: space-between;
    background: #f5f5f5;
    aside {
      width: 200px;
      height: 740px;
      background: #e7e7e7;
      margin-right: 62px;
      box-sizing: border-box;
      padding: 30px 18px 0;
      .avatar {
        width: 100px;
        height: 100px;
        margin: auto;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .name {
        text-align: center;
        margin-top: 19px;
        margin-bottom: 43px;
        .username {
          text-align: center;
          display: inline-block;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .outlogin {
          cursor: pointer;
          text-decoration: underline;
          color: #2a5df1;
        }
      }
      .title {
        font-size: 16px;
        color: #333333;
        display: flex;
        align-items: center;
        margin-bottom: 14px;
        img {
          margin-right: 6px;
        }
      }
      .list {
        li {
          margin-bottom: 17px;
          font-weight: 300;
          color: #666666;
          cursor: pointer;
          &.active {
            color: @blue;
            font-weight: bold;
            &::before {
              width: 2px;
              height: 14px;
              background: @blue;
              display: inline-block;
              content: "";
              margin-right: 10px;
            }
          }
        }
      }
    }
    article {
      flex: 1;
      padding: 20px 0 0 20px;
      box-sizing: border-box;
      background: #f5f5f5;
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
    width: 300px;
    height: 170px;
    background: #fff;
    .text {
      text-align: center;
      margin-top: 40px;
      font-size: 20px;
      font-weight: 700;
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
