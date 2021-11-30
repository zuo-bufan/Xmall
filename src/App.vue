<template>
  <div id="app">
    <transition name="fade">
      <Toast v-show="$store.state.toastStatus" />
    </transition>
    <Header :key="num" @gengxinnum="gengxinnum"></Header>
    <Nav></Nav>
    <router-view @gengxinnum="gengxinnum" />
    <Footer></Footer>
    <Login @gengxinnum="gengxinnum" v-show="$store.state.ifShowLoginModal"></Login>
    <BindingWx @gengxinnum="gengxinnum" v-show="$store.state.ifShowBinding"></BindingWx>
  </div>
</template>

<script>
import Header from './components/Header'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Login from './components/Login'
import Toast from './components/Toast'
import BindingWx from './components/BindingWx'
export default {
  name: 'App',
  data() {
    return {
      num: 0
    }
  },
  components: {
    Header,
    Nav,
    Footer,
    Login,
    Toast,
    BindingWx
  },
  methods: {
    gengxinnum() {
      this.num++
    }
  }
}
</script>

<style lang="less">
// 引入Toast里用到的icon图标
@import "https://at.alicdn.com/t/font_2730880_ylrio3ahhx.css";
body {
  font-size: 16px;
  font-family: SourceHanSansSC;
  color: #333333;
}
input {
  outline: none;
}

// 入场的起始状态就等于立场的最终状态
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,.fade-leave-active {
  transition: opacity 1s linear;
}
.fade-enter-to,.fade-leave {
  opacity: 1;
}

</style>
