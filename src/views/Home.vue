<template>
  <div class="home">
    <div class="banner">
      <div class="banxin">
        <img src="../assets/images/home/banner.png" alt="">
      </div>
    </div>
    <div class="banxin">
      <Mytitle titles="精品推荐" :titleIMg="titleImg1"></Mytitle>
      <List :goodsList="jpList"></List>
      <Mytitle titles="热门兑换" :titleIMg="titleImg2"></Mytitle>
      <div class="ad">
        <img src="../assets/images/home/ads.png" alt="">
      </div>
      <List :goodsList="jfList"></List>
    </div>
    <div class="jf">
      <div class="banxin">
        <Mytitle titles="积分攻略" :titleIMg="titleImg3"></Mytitle>
        <Jfgl></Jfgl>
      </div>
    </div>
  </div>
</template>

<script>
import {jingpinApi, coinApi} from '../request/api'
import Mytitle from '../components/home/Mytitle'
import List from '../components/List'
import Jfgl from '../components/home/Jfgl'
export default {
  name: 'Home',
  data() {
    return {
      titleImg1: require('../assets/images/home/Recommend.png'),
      titleImg2: require('../assets/images/home/hot.png'),
      titleImg3: require('../assets/images/home/integral.png'),
      // 精品推荐的数据
      jpList: [],
      // 积分兑换的数据
      jfList: []
    }
  },
  components: {
    Mytitle,
    List,
    Jfgl
  },
  methods: {
    // 精品推荐请求
    jingpin() {
      jingpinApi().then(res => {
        if (res.code===0) {
          let {data} = res.data
          this.jpList = data.records
        }
      })
    },
    // 积分兑换请求
    jifen() {
      coinApi().then(res => {
        if (res.code===0) {
          let {data} = res.data
          this.jfList = data.records
        }
      })
    }
  },
  created() {
    this.jingpin()
    this.jifen()
  }
}
</script>

<style lang="less" scoped>
@import "../total.less";
.home {
  background: #f5f5f5;
}
.banner {
  padding-bottom: 30px;
  background: #fff;
  img {
    display: block;
  }
}
.ad {
  height: 180px;
  margin-bottom: 30px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.jf {
  background: #fff;
  padding-bottom: 47px;
}
</style>
