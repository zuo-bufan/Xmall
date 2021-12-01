import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 是否显示登录模态框
    ifShowLoginModal: false,
    // 是否显示绑定手机模态框
    ifShowBinding: false,
    //Header组件的登录状态（右上角显示登录还是显示购物车）
    isLogined: localStorage.getItem('x-auth-token'),
    //Toast的显示和隐藏
    toastStatus: false,
    // Toast的文字内容
    toastMsg: '',
    // Toast的类型(success、error、warn)
    toastType: 'success'
  },
  mutations: {
    // 登录模态框显示
    showModalFn(state) {
      state.ifShowLoginModal = true
    },
    // 登录模态框的隐藏
    hideModalFn(state) {
      state.ifShowLoginModal = false
    },
    // 绑定手机号模态框的显示
    showBingding(state) {
      state.ifShowBinding = true
    },
    // 绑定手机号模态框的隐藏
    hideBingding(state) {
      state.ifShowBinding = false
    },
    //修改isLogined的值
    changeIsLogined(state) {
      state.isLogined = localStorage.getItem('x-auth-token')
    },
    // 控制Toast的显隐,内容，和样式
    changeToast(state,val) {
      state.toastStatus = val.isShow
      state.toastMsg = val.msg
      state.toastType = val.type
      // setTimeout(() => {
      //   state.toastStatus = false
      // },2000)
    }
  },
  actions: {
    // 因为toast过两秒隐藏要用到定时器，所以是异步操作，放到actions里
    changeToastAsync({commit}, val) {
      commit('changeToast', {
        isShow: true,
        msg: val.msg,
        type: val.type
      })
      // 两秒以后隐藏Toast
      setTimeout(() => {
        commit('changeToast',{
          isShow: false,
          msg: val.msg,
          type: val.type
        })
      },2000)
    }
  },
  modules: {
  }
})
