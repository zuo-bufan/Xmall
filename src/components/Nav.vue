<template>
  <div class="nav">
    <div class="banxin">
      <a href="#" @click="$router.push('/home')"><img src="../assets/images/indexLogo.png" alt=""></a>
      <ul>
        <li @click="$router.push('/home')" :class="$route.path=='/home'?'active':''">首页</li>
        <li @click="$router.push('/goods')" :class="$route.path=='/goods'?'active':''">全部商品</li>
        <li @click="$router.push('/user')" :class="/\/cart/g.test($route.path)?'active':''">个人中心</li>
        <li @click="$router.push('/order')" :class="$route.path=='/order'?'active':''">我的订单</li>
        <li @click="$router.push('/welfare')" :class="$route.path=='/welfare'?'active':''">专属福利</li>
      </ul>
      <div class="search">
        <input @keydown.13="searchFn" placeholder="输入关键字" v-model.trim="searchContent" type="text">
        <span @click="searchFn" class="btn"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data() {
    return {
      // 搜索框的内容
      searchContent: ''
    }
  },
  methods: {
    // 执行搜索
    searchFn() {
      this.$router.push(`/goods?keyword=${this.searchContent}`)
      this.searchContent = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import "../total.less";
.nav {
  .banxin {
    height: 118px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  // .logo {
  //   width: 257px;
  //   height: 56px;
  //   background: url('../assets/images/indexLogo.png');
  // }
  ul {
    width: 500px;
    display: flex;
    justify-content: space-between;
    li {
      font-size: 16px;
      font-family: SourceHanSansSC;
      color: #242B39;
      font-weight: 500;
      cursor: pointer;
      &.active {
        font-weight: bold;
        color: @blue;
      }
    }
  }
  .search {
    box-sizing: border-box;
    width: 264px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    input {
      padding: 0;
      width: 214px;
      border: 1px solid #DEDEDE;
      border-radius: 20px 0px 0px 20px;
      outline: none;
      text-indent: 1em;
    }
    .btn {
      width: 50px;
      height: 40px;
      background-color: @blue;
      background-image: url(../assets/images/search.png);
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
      border-radius: 0 20px 20px 0;
    }
  }
}
}
</style>