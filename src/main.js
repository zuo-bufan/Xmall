import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入重置样式
import 'reset-css'
import SlideVerify from 'vue-monoplasty-slide-verify' // 拼图验证码
Vue.use(SlideVerify)

// 使用图片懒加载
import VueLazyload from 'vue-lazyload'
// 配置项
Vue.use(VueLazyload, {
    preLoad: 1.3, //1.3的比例去显示这个懒加载的图片
    // 这里注意，不能写相对路径，要不写部署到服务器上以后的这个图片的地址，要不把这个图片放到public文件夹下（这样打包以后这个图片就会在你服务器里的根路径下了），然后直接写/图片名.扩展名
    // loading: 'http://39.105.157.163:8101/static/images/load.gif',
    loading: '/loading.gif',
    attempt: 1 //尝试一次
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
