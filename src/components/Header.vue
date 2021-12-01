<template>
  <div class="header">
    <section class="banxin">
      <div class="left">欢迎来到叩丁严选积分商城</div>
      <div class="right">
        <ul>
          <li class="avatar_li" @click="userClickFn">
            <img class="avatar" v-lazy="userInfo.headImg" alt="" />
            用户名：{{userInfo.nickName}}
          </li>
          <li @click="userClickFn">我的积分：{{userInfo.coin}}</li>
          <li @click="getCoinClickFn">获取积分</li>
        </ul>
        <div @click="openCart" class="cart_btn" v-if="$store.state.isLogined">
          <img src="../assets/images/Shopping.png" alt="">
          <span>购物车</span>
          <b>{{userInfo.cartNum+1}}</b>
        </div>
        <div v-else class="btn" @click="openLogin">登录</div>
      </div>
    </section>
  </div>
</template>

<script>
import {WeixinLoginApi, getUserInfoApi} from '../request/api'
export default {
  name: "Header",
  data() {
    return {
      userInfo: {
        headImg: require('../assets/images/userImg.png'),
        nickName: '左不凡',
        coin: '--',
        cartNum: 0
      }
    }
  },
  created() {
    let mycode = this.$route.query.code
    if (mycode) { //有code代表了刚刚扫码登录
      // 有code才去置换token
      WeixinLoginApi({
        code: mycode
      }).then(res => {
        if (res.code===0) {
          // 登录成功存储token
          localStorage.setItem('x-auth-token',res['x-auth-token'])
          // vuex中切换登录的状态（Header组件的登录改为购物车）
          this.$store.commit('changeIsLogined')
          // 提示用户
          this.$store.dispatch('changeToastAsync',{msg:'登录成功',type: 'success'})
          // 获取用户信息
          this.getUserInfo()
          // 清除地址栏上的code
          this.$router.replace(this.$route.path)
          //这里是否还用刷新当前页？（应该是不用了）
        } else {
          // 登录失败
          if (res.code===407) {
            let myuuid = res.uuid
            localStorage.setItem('uuid',myuuid)
            this.$store.commit('showBingding')
          } else {
            if (res.code===400) {
              this.$store.dispatch('changeToastAsync',{msg:'请用微信重新扫码登录',type: 'erro'})
            }
          }
        }
      })
    } else {
      // 这里代表没有code，但是并不确定用户是否登录了，所以在这重新判断一下token，进行header组件中登录和购物车的切换
      let mytoken = localStorage.getItem('x-auth-token')
      if (mytoken) {
        // 这里代表用户已经登录，不管是微信或者手机登录的
        // 所以在这儿发起获取用户信息的请求
        let myuserInfo = localStorage.getItem('userInfo')
        if (myuserInfo) {
          // 如果已经有用户的信息就用localStorage中的的数据，不在发起请求
          let userInfo = JSON.parse(localStorage.getItem('userInfo'))
          this.userInfo = userInfo
        } else {
          this.getUserInfo()
        }
      }
    }
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getUserInfoApi().then(res => {
        if (res.code===0) {
          let userInfos = res.data.userInfo
          let cartnum = res.data.cartTotal
          let userInfo = {
            headImg: userInfos.headImg,
            nickName: userInfos.nickName,
            coin: userInfos.coin,
            cartNum: cartnum
          }
          this.userInfo = userInfo
          localStorage.setItem('userInfo',JSON.stringify(userInfo))
        }
      })
    },
    // 打开登录模态框
    openLogin() {
      this.$store.commit('showModalFn')
    },
    // 用户名和我的积分的点击事件
    userClickFn() {
      let mytoken = localStorage.getItem('x-auth-token')
      if (!mytoken) {
        this.$store.dispatch('changeToastAsync',{msg:'请先登录',type: 'wran'})
        return
      }
      this.$router.push('/user/personal')
    },
    // 获取积分的点击事件
    getCoinClickFn() {
      let mytoken = localStorage.getItem('x-auth-token')
      if (mytoken) {
        this.$store.dispatch('changeToastAsync',{msg:'此功能暂未开放',type: 'erro'})
        return
      }
      this.$store.dispatch('changeToastAsync',{msg:'请先登录',type: 'wran'})
    },
    // 跳转到购物车页面
    openCart() {
      this.$router.push('/user/cart')
    }
  },
  // 监测路由然后重新加载header组件，不然用户退出后，跳转到其他页面后，header组件中显示的还是用户已经登录的状态
  watch: {
    $route(to, from) {
      if (from.path.substring(0, 5) === '/user') {
        // 通知app组件重新加载header组件
        this.$emit('gengxinnum')
      }
      return
      // this.$router.go(0); // 刷新页面
    }
  }
};
</script>

<style lang="less" scoped>
@import "../total.less";
.header {
  width: 100%;
  height: 40px;
  background: #242b39;
  section {
    height: 40px;
    color: #FFFEFE;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
      display: flex;
      ul {
        display: flex;
        align-items: center;
        li {
          &.avatar_li {
            display: flex;
            align-items: center;
          }
          cursor: pointer;
          margin-right: 20px;
          .avatar {
            width: 26px;
            margin-right: 5px;
            border-radius: 50%;
          }
        }
      }
      .btn {
        cursor: pointer;
        width: 124px;
        text-align: center;
        height: 40px;
        line-height: 40px;
        background: @blue;
      }
      .cart_btn {
        cursor: pointer;
        width: 124px;
        height: 40px;
        background: @blue;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin: 0 6px 0 8px;
        }
        b {
          width: 22px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          background: #fd604d;
          border-radius: 11px;
        }
      }
    }
  }
}
</style>
