<template>
  <div class="login_modal" @mousewheel.prevent>
    <section @click="hideLogin"></section>
    <div class="login_content">
      <img
        class="close"
        @click="hideLogin"
        src="../assets/images/login/userArrow.png"
        alt=""
      />
      <ul>
        <li @click="loginType='phone'" :class="loginType=='phone'?'active': ''">手机号码登录</li>
        <li @click="weixinClickFn" :class="loginType=='weChat'?'active': ''">微信扫码登录</li>
      </ul>
      <div id="weixin" v-show="loginType=='weChat'"></div>
      <div class="form" v-show="loginType=='phone'">
        <div class="ipt">
          <input v-model="phoneNum" placeholder="请输入手机号" type="number" />
        </div>
        <!-- 滑动拼图模块开始 -->
        <slide-verify
          :l="42"
          :r="20"
          :w="362"
          :h="140"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          :style="{ width: '100%', marginBottom: '20px' }"
          class="slide-box"
          ref="slideBlock"
          :slider-text="msg"
        ></slide-verify>
        <!-- 滑动拼图模块结束 -->
        <div class="ipt">
          <input v-model="code" placeholder="请输入短信验证码" type="text" />
          <div class="btn">
            <span class="getcode" v-show="showcount" @click="getCode"
              >获取验证码</span
            >
            <span class="codeing" v-show="!showcount">{{ count }}s</span>
          </div>
        </div>
        <div class="login_btn" @click="submitFn">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateTelephone } from "../utils";
import { sendCodeApi, phoneLoginApi } from "../request/api";
export default {
  name: "Login",
  data() {
    return {
      msg: "向右滑动填充拼图",
      phoneNum: "", //用户输入的手机号
      code: '', //用户输入的验证码
      count: 60, //倒计时
      showcount: true, //为true时候显示获取验证码，为false时显示倒计时秒数
      loginType: 'phone'
    };
  },
  methods: {
    // 微信登录
    weixinClickFn() {
      this.loginType = 'weChat'
      let _this = this;
      new WxLogin({
        id: "weixin",
        appid: "wx67cfaf9e3ad31a0d",  // 这个appid要填死
        scope: "snsapi_login",
        // 扫码成功后重定向的接口
        redirect_uri: "https://sc.wolfcode.cn/cms/wechatUsers/shop/PC",
        // state填写编码后的url
        state: encodeURIComponent(window.btoa(process.env.VUE_APP_STATE_URL + _this.$route.path)),
        // 调用样式文件
        href: "data:text/css;base64,Lyogd3hsb2dpbi5jc3MgKi8NCi5pbXBvd2VyQm94IC50aXRsZSwgLmltcG93ZXJCb3ggLmluZm97DQogIGRpc3BsYXk6IG5vbmU7DQp9DQoNCi5pbXBvd2VyQm94IC5xcmNvZGV7DQogIG1hcmdpbi10b3A6IDEwcHg7DQp9",
      })
    },
    // 获取验证码
    getCode() {
      if (this.phoneNum.trim() == "") {
        // alert("请输入手机号");
        this.$store.dispatch('changeToastAsync',{msg:'请输入手机号',type: 'erro'})
      } else {
        // 手机号正则校验
        let result = validateTelephone(this.phoneNum);
        if (result) {
          // 这里可以发起验证码请求
          sendCodeApi({
            phone: this.phoneNum.trim(),
          }).then((res) => {
            if (res.code === 0) {
              this.showcount = false;
              this.$store.dispatch('changeToastAsync',{msg:'发送成功',type: 'success'})
              let timer = setInterval(() => {
                this.count--;
                if (this.count == 0) {
                  this.count = 60;
                  this.showcount = true;
                  clearInterval(timer);
                }
              }, 1000);
            } else {
              this.$store.dispatch('changeToastAsync',{msg:'发送频繁 请稍后再试',type: 'erro'})
            }
          });
        } else {
          // 这里代表手机号正则校验未通过，手机号输入不正确
          this.$store.dispatch('changeToastAsync',{msg:'手机号输入不正确',type: 'wran'})
          // alert("手机号输入不正确");
        }
      }
    },
    // 关闭登录模态框
    hideLogin() {
      this.$store.commit("hideModalFn");
    },
    // 拼图成功
    onSuccess(times) {
      let ms = (times / 1000).toFixed(1);
      this.msg = "login success, 耗时 " + ms + "s";
    },
    // 拼图失败
    onFail() {
      this.onRefresh(); // 重新刷新拼图
    },
    // 拼图刷新
    onRefresh() {
      this.msg = "再试一次";
    },
    // 点击登录按钮
    submitFn(formName) {
      // 判断是否输入手机号
      if (this.phoneNum.trim()=='') {
        this.$store.dispatch('changeToastAsync',{msg:'请输入手机号',type: 'erro'})
        return
      }
      // 判断输入手机号码是否正确
      if (!validateTelephone(this.phoneNum)) {
          this.$store.dispatch('changeToastAsync',{msg:'手机号输入不正确',type: 'wran'})
        return
      }
      // 判断验证码是否输入
      if (this.code.trim()==='') {
          this.$store.dispatch('changeToastAsync',{msg:'请输入验证码',type: 'erro'})
        return
      }
      // 判断拼图滑块是否通过
      if (this.msg == "再试一次" || this.msg == "向右滑动填充拼图") {
        // 这里代表滑动拼图没有通过
          this.$store.dispatch('changeToastAsync',{msg:'请滑动拼图',type: 'wran'})
        return
      }
      // 这里代表可以正常发起登录请求了
      phoneLoginApi({
        verifyCode: this.code.trim(),
        phone: this.phoneNum.trim()
      }).then(res => {
        if (res.code===0) {
          // 存储token
          localStorage.setItem('x-auth-token',res['x-auth-token'])
          // vuex中切换登录的状态（Header组件的登录改为购物车）
          this.$store.commit('changeIsLogined')
          this.$store.dispatch('changeToastAsync',{msg:'登录成功',type: 'success'})
          setTimeout(() => {
            // 等待一秒后关闭登录模态框
            this.hideLogin()
            // 通知app组件重新渲染header组件，更改用户信息
            this.$emit('gengxinnum')
          },1000)
        } else {
          // 验证码填写错误
          this.$store.dispatch('changeToastAsync',{msg: res.msg,type: 'erro'})
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
#weixin {
  width: 300px;
  height: 300px;
  margin: auto;
}
.login_modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  section {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .login_content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 555px;
    height: 423px;
    background: url(../assets/images/login/loginBg.png);
    .close {
      position: absolute;
      top: 20px;
      right: 60px;
      cursor: pointer;
    }
    ul {
      margin-top: 50px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      li {
        cursor: pointer;
        font-size: 18px;
        color: #ccc;
        &:first-child {
          padding-right: 10px;
          border-right: 1px solid #dfdfdf;
        }
        &:last-child {
          padding-left: 10px;
        }
        &.active {
          color: #333;
        }
      }
    }
    .form {
      width: 362px;
      margin: auto;
      .ipt {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        input {
          text-indent: 1em;
          flex: 1;
          height: 50px;
          box-sizing: border-box;
          border: 1px solid #ccc;
        }
        .btn {
          width: 100px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          color: #fff;
          cursor: pointer;
          margin-left: 10px;
          background: #0a328e;
          .getcode {
            display: block;
            width: 100%;
            height: 100%;
          }
          .codeing {
            display: block;
            width: 100%;
            height: 100%;
            color: #000;
            background: #e8e8e8;
          }
        }
      }
      .login_btn {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        background: #0a328e;
      }
    }
  }
}

/deep/.slide-box {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  canvas {
    position: absolute;
    left: 0;
    top: -140px;
    display: none;
    width: 100%;
    box-sizing: border-box;
  }
  .slide-verify-block {
    width: 85px;
    height: 136px;
  }
  .slide-verify-refresh-icon {
    top: -140px;
    display: none;
  }
  &:hover {
    canvas {
      display: block;
    }
    .slide-verify-refresh-icon {
      display: block;
    }
  }
}
</style>
