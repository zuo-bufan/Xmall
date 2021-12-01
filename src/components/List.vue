<template>
  <ul class="list">
    <li @click="goDetail(item.id)" v-for="item in goodsList" :key="item.id">
      <img class="productimg" v-lazy="'http://sc.wolfcode.cn' + item.coverImg" alt="" />
      <section>
        <div class="protitle">{{item.name}}</div>
        <div class="price">
          <span>{{item.coin}}</span>
          <img class="producticon" src="../assets/images/home/monad.png" alt="" />
        </div>
        <div class="button">立即兑换</div>
      </section>
      <img :style="{display: item.isLatest==1 ?'block':'none'}" class="new" src="../assets/images/home/new-j.png" alt="">
      <img :style="{display: item.isHotSale==1 ?'block':'none'}" class="hot" src="../assets/images/home/hot-j.png" alt="">
    </li>
  </ul>
</template>

<script>
export default {
  name: "List",
  props: ['goodsList'],
  methods: {
    goDetail(id) {
      this.$router.push(`/detail?id=${id}`)
    }
  }
};
</script>

<style lang="less" scoped>
@import "../total.less";
ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    position: relative;
    margin-bottom: 20px;
    margin-right: 20px;
    transition: all .5s linear;
    cursor: pointer;
    box-shadow: 1px 1px 10px #ccc;
    &:hover {
      transform: translateY(-10px);
      .button {
        color: #FFFFFF;
        background:@blue;
      }
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    background: #fff;
    .productimg {
      width: 285px;
      height: 330px;
      display: block;
    }
    section {
      font-size: 18px;
      font-weight: 300;
      width: 285px;
      padding-bottom: 32px;
      .protitle {
        margin-top: 22px;
        margin-bottom: 16px;
        color: #333333;
        text-align: center;
      }
      .price {
        display: flex;
        justify-content: center;
        color: @orange;
        font-weight: bold;
        .producticon {
          width: 20px;
          height: 20px;
        }
      }
      .button {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        margin: 20px auto;
        margin-bottom: 0;
        border: 1px solid @blue;
        color: @blue;
        background: #fff;
      }
    }
    .new,.hot {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
