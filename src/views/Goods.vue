<template>
  <div class="goods">
    <div class="banxin">
      <Mianbao>
      <span v-for="(item,index) in nav" :key="index" v-text="index<nav.length-1?item+' / ':item"></span>
      </Mianbao>
      <img style="display: block;" src="../assets/images/home/ads.png" alt="">
      <ul class="navlist">
        <li>
          <strong>排序：</strong>
          <span @click="options1Click(item,index)" :class="num1==index?'active':''" v-for="(item,index) in options1" :key="index">{{item.txt}}</span>
        </li>
       <li>
          <strong>分类：</strong>
          <span @click="options2Click(item,index)" :class="num2==index?'active':''" v-for="(item,index) in options2" :key="index">{{item.txt}}</span>
        </li>
      </ul>
      <List :goodsList="goodsList"></List>
      <div class="loading">
        <i class="iconfont icon-loading" v-show="loading"></i>
        <span>{{loading ? '正在加载中' : '已经到底啦~'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Mianbao from '../components/Mianbao'
import List from '../components/List'
import {searchGoodsApi} from '../request/api'
// 声明一个obj，用来存放每一份数组项（每一项为8个）
let obj = {}
// 声明一个objKey,用来指明哪一份数组项
let objKey = 0

export default {
  name: 'Goods',
  data() {
    return {
      // 正在加载的状态
      loading: true,
      nav: ['首页','全部商品'],
      // 排序的选项
      options1: [
        {min: 0, max: 0, txt: '全部'},
        {min: 0, max: 0, txt: '我能兑换的'},
        {min: 1000, max: 1500, txt: '1000-1500分'},
        {min: 1500, max: 2500, txt: '1500-2500分'},
        {min: 2500, max: 3500, txt: '2500-3500分'},
        {min: 3500, max: 5000, txt: '3500-5000分'},
        {min: 5000, max: 100000, txt: '5000分以上'}
      ],
      // 分类的选项
      options2: [
        {type: 0, txt: '全部'},
        {type: 1, txt: '实物商品'},
        {type: 2, txt: '虚拟商品'}
      ],
      // 排序的当前项
      num1: -1,
      // 分类的当前项
      num2: -1,
      // 栏目 目前可提供的参数是 1->精品推荐 2-> 热门兑换 0->全部
      did: 0,
      // ( 1->实体商品 2->虚拟商品 0->全部 )
      type: 0,
      // 大于多少积分，最少是0
      min: 0,   
      // 少于多少积分，最多是10000，当传入0的时候，会直接返回所有商品，无视后台逻辑。
      max: 0,
      // 商品关键词
      keyword: '',
      // 商品列表数据
      goodsList: []
    }
  },
  components: {
    Mianbao,
    List
  },
  methods: {
    // 获取商品的数据请求
    getData() {
      // 恢复初始值
      obj = {}
      objKey = 0
      this.loading = true

      searchGoodsApi({
        did: this.did,
        type: this.type,
        min: this.min,
        max: this.max,
        keyword: this.keyword
      }).then(res => {
        if (res.code===0) {
          // 如果res.data.length<=8，此时就直接赋值给this.goodsList
          // 如果是超过了8项，需要切割数组，假如总共30项，以每8项为1份，不管得到多少，都要向上取整
          if (res.data.length<=8) {
            this.loading = false
            this.goodsList = res.data
          } else {
            // 此时需要切割数组
            for (let i=0; i<res.data.length/8;i++) {
              obj[i] = res.data.slice(8*i,8*(i+1))
            }
            // 一开始先渲染8个，也就是obj里的第一项
            this.goodsList = obj[0]
          }
        }
      })
    },
    // options1选项的点击
    options1Click(item,index) {
      this.min = item.min
      this.max = item.max
      this.num1 = index
      this.getData()
    },
    // options2选项的点击
    options2Click(item,index) {
      this.type = item.type
      this.num2 = index
      this.getData()
    },
    // 滚动事件
    scrollFn() {
      // 判断是否滑动到底，思路应该是，滚动的长度（就是文档超出当前Windows的长度）加上 Windows的长度（就是当前浏览器的高度） 等于 文档的长度（整个dom的高度）
      // 获取窗口的高度
      let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      // 获取滚动长度
      let st = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 获取文档长度
      let docHeight = document.documentElement.scrollHeight || document.body.scrollHeight

      // 因为我们规定每8个是一份，一共有30个，所以要分成4份，但是一共有多少个是后端返回过来的，不一定每次都是30个，所以不能写死
      // 如果objKey的值等于3，这个时候不需要再去判断触底，这件事情可以停止了
      // 这里的3其实就是obj这个对象属性的个数-1
      // Object.keys(obj).length是获取obj对象属性的个数

      // 这里要写大于等于不能写成等于，因为如果请求回来的数据本来就小于等于8个，比如点击2500-3500分的请求回来的数据就小于8个，这样对象的长度为0，在减一，Object.keys(obj).length-1的值为-1，而objKey的值为0，所以写成等于不会终止，还会继续执行触底事件，就会报错。
      // 还有一种方法是，这里写成等于，然后在上边请求数据的函数里if (res.data.length<=8)条件中成立是取消滚动监测，然后在else里开启滚动监测，这样小于8条数据时，就不会再来到这里进行这个判断了，因为已经不监测滚动了
      if (objKey>=Object.keys(obj).length-1) {
        this.loading = false
        return
      }

      // 因为高度获取的不太精确，有小数啥的，所以在这把docHeight-1一下就好了
      // 但是在这为了用户体验良好，写成减200，这样不用滑动到最下边，滑动到距离底部还剩200的时候就加载新的数据，因为底部还有一个footer是240px的高度
      if(st+winHeight>=docHeight-200) {
        // 此时代表已经触底了
        objKey++ //从上一个属性加一
        // 触底的时候要给this.goodsList追加数组项
        this.goodsList = this.goodsList.concat(obj[objKey])
      }
    }
  },
  created() {
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword
    }
    this.getData()
  },
  // 监听路由的keyword变化，如果有变化就刷新页面
  watch: {
    "$route.query.keyword": {
      handler(newVal,oldVal) {
        if (newVal!==oldVal) {
          // 此时刷新页面
          this.$router.go()
        }
      }
    }
  },
  mounted() {
    // 监听滚动
    window.addEventListener('scroll', this.scrollFn)
  },
  beforeDestroy() {
    // 取消监听的滚动
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style lang="less" scoped>
@import '../total.less';
.goods {
  background: #f5f5f5;
}
.navlist {
  margin-top: 50px;
  margin-bottom: 40px;
  li {
    &:nth-child(1) {
      margin-bottom: 32px;
    }
    span {
      cursor: pointer;
      margin-right: 28px;
      color: #999;
      &.active {
        color: @blue;
        font-weight: 700;
      }
    }
    strong {
      font-weight: 700;
      color: #000;
      margin-right: 14px;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  .iconfont {
    margin-right: 10px;
    animation: loading 1s linear infinite;
  }
}

@keyframes loading {
  from {transform: rotate(0);}
  to {transform: rotate(360deg);}
}
</style>