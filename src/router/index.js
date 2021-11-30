import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import( /* webpackChunkName: "Home" */ '../views/Home.vue')
  },
  {
    path: '/goods',
    name: "Goods",
    component: () => import( /* webpackChunkName: "Goods" */ '../views/Goods.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import( /* webpackChunkName: "User" */ '../views/User.vue'),
    redirect: '/user/cart',
    children: [
      {
        path: 'cart',
        name: 'Cart',
        component: () => import(/* webpackChunkName: "cart" */ '../components/user/Cart.vue')
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import(/* webpackChunkName: "personal" */ '../components/user/Personal.vue')
      },
      {
        path: '*',
        name: 'Others',
        component: () => import(/* webpackChunkName: "others" */ '../components/user/Others.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import( /* webpackChunkName: "Welfare" */ '../views/Order.vue')
  },
  {
    path: '/welfare',
    name: 'Welfare',
    component: () => import( /* webpackChunkName: "Welfare" */ '../views/Welfare.vue')
  },
  {
    path: '/detail',
    name: 'GoodsDetail',
    component: () => import( /* webpackChunkName: "Goodsdetail" */ '../views/GoodsDetail.vue')
  },

  {
    path: '*',
    name: 'Error',
    component: () => import( /* webpackChunkName: "about" */ '../views/Error404.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // 跳转路由的时候，页面不从最顶部开始显示的解决代码
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
})

export default router
