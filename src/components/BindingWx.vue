<template>
  <div class="wx">
    <div class="form">
      <img @click="closeFn" class="close" src="../assets/images/login/userArrow.png" alt="" />
      <h2>叩丁狼积分商城</h2>
      <h3>绑定手机号即可正常使用叩丁严选</h3>
      <div class="inputs">
        <div class="ipt">
          <input v-model="phoneNum" placeholder="请输入手机号" type="number" />
        </div>
        <div class="ipt">
          <input v-model="code" placeholder="请输入短信验证码" type="text" />
          <div class="btn">
            <span class="getcode" @click="getCode" v-show="showcount">获取验证码</span>
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
import { binDingApi, sendCodeApi } from "../request/api";
export default {
  name: "BiningWx",
  data() {
    return {
      phoneNum: "",
      code: "",
      count: 60, //倒计时
      showcount: true, //为true时候显示获取验证码，为false时显示倒计时秒数
    }
  },
  methods: {
    closeFn() {
      this.$store.commit('hideBingding')
    },
    // 获取验证码
    getCode() {
      if (this.phoneNum.trim() == "") {
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
        }
      }
    },
    // 登录
    submitFn() {
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
      // 此时在这儿可以发送请求了
      // 清除地址栏上的code
      let myuuid = localStorage.getItem('uuid')
      binDingApi({
        phone: this.phoneNum.trim(),
        verifyCode: this.code.trim(),
        uuid: myuuid
      }).then(res => {
        if (res.code===0) {
          localStorage.setItem('x-auth-token',res['x-auth-token'])
          this.$store.dispatch('changeToastAsync',{msg:'登录成功',type: 'success'})
          // vuex中切换登录的状态（Header组件的登录改为购物车）
          this.$store.commit('changeIsLogined')
          this.$router.replace(this.$route.path)
          setTimeout(() => {
            // 等待一秒后关闭登录模态框
            this.closeFn()
            // 通知app组件重新渲染header组件，更改用户信息
            this.$emit('gengxinnum')
          },1000)
        } else {
          this.$store.dispatch('changeToastAsync',{msg: res.message,type: 'erro'})
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.wx {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  .form {
    position: absolute;
    width: 470px;
    height: 420px;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 15px;
    padding: 20px 30px;
    box-sizing: border-box;
    .close {
      display: block;
      cursor: pointer;
      position: absolute;
      top: 20px;
      right: 20px;
      user-select: none;
    }
    h2 {
      text-align: center;
      font-size: 20px;
      color: #999;
    }
    h3 {
      width: 350px;
      text-align: center;
      padding-bottom: 10px;
      margin: auto;
      margin-top: 40px;
      margin-bottom: 45px;
      font-size: 18px;
      font-weight: 700;
      border-bottom: 1px solid #ccc;
    }
    .inputs {
      padding: 0 50px;
      .ipt {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
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
        width: 160px;
        margin: 0 auto;
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
</style>