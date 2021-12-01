<template>
  <div class="detail banxin" v-if="themYouCanBuy.length!=0">
    <Mianbao>
      <span v-for="(item,index) in nav" :key="index" v-text="index<nav.length-1?item.name+' / ':item.name"></span>
    </Mianbao>
    <main class="banxin">
      <div class="content">
        <div class="c-left">
          <img class="bigIMg" v-lazy="'http://sc.wolfcode.cn'+productInfo.coverImg" alt="">
          <ul>
            <li @mouseover="changeIMg(item,index)" :class="index1==index ? 'active':''" v-for="(item,index) in productInfo.imgAltas">
              <img v-lazy="'http://sc.wolfcode.cn'+item.src" alt="">
            </li>
          </ul>
        </div>
        <div class="c-right">
          <div class="top">
            <h2>{{productInfo.seriesTitle}}</h2>
            <p>{{productInfo.seriesSubTitle}}</p>
            <div class="coin">{{productInfo.coin}}积分</div>
          </div>
          <div class="down">
            <section v-for="(item,index) in productInfo.parameterJson" :key="index">
              <strong class="scolor">选择：{{item.title}}</strong>
              <ul>
                <li @click="colorClick(items.id)" :class="items.currentActivate ? 'active':''" v-for="(items,index) in item.parameters" :key="items.id">{{items.title}}</li>
              </ul>
            </section>
            <strong class="snum">数量<span>库存剩余{{productInfo.stock}}件</span></strong>
            <div class="step">
              <span @click="stepReduce">-</span>
              <div class="ipt">{{stepNum}}</div>
              <span @click="stepAdd">+</span>
            </div>
            <div class="btn">
              <div class="btn1" @click="addToCartFn">加入购物车</div>
              <div class="btn2">立即购买</div>
            </div>
            <div class="share">
              <div class="love">
                <img src="../assets/images/details/like-click.png" alt="">
                <span>喜欢{{productInfo.like}}</span>
              </div>
              <div class="share_r">
                <vshare :vshareConfig="vshareConfig"></vshare>
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside>
        <h3>你还可以兑换</h3>
        <ul>
          <li @click="goOtherDetail(item.id)" v-for="item in themYouCanBuy" :key="item.id">
            <img class="li_img" v-lazy="'https://sc.wolfcode.cn'+item.img" alt="">
            <div class="right">
              <p>{{item.name}}</p>
              <div class="coin">
                <span>{{item.coin}}</span>
                <img src="../assets/images/home/monad.png" alt="">
              </div>
            </div>
          </li>
        </ul>
      </aside>
    </main>
    <ul class="tab banxin">
      <li @click="tabindex=0" :class="tabindex==0?'active':''">礼品详情</li>
      <li @click="tabindex=1" :class="tabindex==1?'active':''">常见问题</li>
    </ul>
    <div class="tupian" v-html="productInfo.description" v-show="tabindex==0"></div>
    <div class="issue" v-show="tabindex==1">
      <h4>兑换后运费如何收取？</h4>
      <p>商城内大部分实物产品均可包邮，也支持上门自提。虚拟产品则无需运费，可在兑换后直接使用。</p>
      <p>（注：新疆，西藏，内蒙古，青海，海南，宁夏暂不支持包邮，在此地区兑换商品需提前与客服确认运费。）</p>
      <h4>如何申请退换货？</h4>
      <p>所有产品均为鸡腿兑换礼品，无质量问题不支持退换货；</p>
      <p>如因喜好不同，或到货后后悔等原因，不支持退货；</p>
      <p>因客户原因如联系方式有误、电话停机、不接电话、无理由拒收等造成快件无法正常签收的情况，叩丁狼均不进行补发或赔付；</p>
      <p>如因质量问题需要退货，将由客服人员与客户联系，确认邮寄地址与流程。退回物品不得有人为损坏或使用痕迹，否则拒绝退换；</p>
      <p>如顾客选择自行寄回商品，请先垫付运费，到货验证商品后，叩丁狼将以鸡腿发放形式为用户报销运费，不接受单方面到付件。</p>
      <h4>如何开具发票？</h4>
      <p>叩丁狼积分商城产品均为定制礼品，使用积分兑换的产品均不支持开票。</p>
      <h4>关于鸡腿价格问题</h4>
      <p>因可能存在系统缓存、页面更新延迟等不确定性情况，导致价格显示异常，商品具体售价请以订单结算页价格为准。如您发现异常情况出现，请立即联系我们补正，以便您能顺兑换。</p>
    </div>
  </div>
</template>

<script>
import {goodsDetailApi, AddcartApi} from '../request/api'
import Mianbao from '../components/Mianbao'
import vshare from 'vshare'
export default {
  name: 'Goodsdetail',
  components: {
    Mianbao,
    vshare
  },
  data() {
    return {
      // tab的索引值
      tabindex: 0, //0代表礼品详情，1代表常见问题
      // 步进器的默认值
      stepNum: 1,
      // 控制图片切换的索引
      index1: 0,
      // 面包屑导航
      nav: [],
      // 商品详情数据
      productInfo: {
        parameterJson: [
          {
            parameters: []
          }
        ]
      },
      // 你还可以兑换
      themYouCanBuy: [],
      // 分享功能的配置
      vshareConfig: {
        // 此处放分享列表（ID）
        shareList: ["weixin","tsina", "qzone"],
        //此处放置分享按钮设置
        share: [{ bdSize: 24 }],
        //此处放置浮窗分享设置
        slide: false
      },
    }
  },
  methods: {

    // 加入购物车
    addToCartFn() {
      AddcartApi({
        productId: this.$route.query.id,
        total: this.stepNum,
        modified: 1
      }).then(res => {
        if (res.code===0) {
          this.$store.dispatch('changeToastAsync',{msg:'已成功加入购物车',type: 'success'})
          // 服务器上已经加入购物车了，本地localStorage中也要更新一下
          let local = JSON.parse(localStorage.getItem('userInfo'))
          let newLocal = {
            ...local,
            cartNum: ++local.cartNum
          }
          localStorage.setItem('userInfo',JSON.stringify(newLocal))
          // 此时header中的购物车数量应该更新一下， 让用户看到，所以要触发一下header组件中的created生命周期函数，所以要改变app组件中的绑定在header组件上key属性的那个num，让num发生变化header组件会重新加载，从而触发created
          // 字传父，通知父组件更新num的值
          this.$emit('gengxinnum')
          // 还有一个办法是刷新页面，也可以触发header组件的created，不过那样用户体验不好
        } else {
          this.$store.dispatch('changeToastAsync',{msg: res.message,type: 'erro'})
        }
      })
    },
    // 鼠标移入切换图片事件
    changeIMg(item,index) {
      this.index1 = index
      this.productInfo.coverImg = item.src
    },
    // 获取商品详情
    getGoodsDetail(id) {
      goodsDetailApi({
        id
      }).then(res => {
        if (res.code===0) {
          let {nav,productInfo,themYouCanBuy} = res.data
          this.nav = nav
          this.productInfo = productInfo
          // 因为后端返回回来的是字符串的html结构标签，而img里的src图片路径写的不全，没办法渲染，所以这里要对description做一个正则匹配，在upload上加上http://sc.wolfcode.cn/upload图片才可显示出来
          this.productInfo.description = this.productInfo.description.replace(/upload/g,'http://sc.wolfcode.cn/upload')
          this.themYouCanBuy = themYouCanBuy
        } else {
          this.$store.dispatch('changeToastAsync',{msg: res.message,type: 'wran'})
          setTimeout(() => {
            this.$router.go(-1)
          },1000)
        }
      })
    },
    // 跳转其它商品详情
    goOtherDetail(id) {
      this.$router.push(`/detail?id=${id}`)
    },
    // 选择颜色的点击事件
    colorClick(id) {
      this.$router.push(`/detail?id=${id}`)
    },
    // 步进器加
    stepAdd() {
      if (this.stepNum>=this.productInfo.stock) {
        this.$store.dispatch('changeToastAsync',{msg: '已达上限了哦',type: 'wran'})
        return
      }
      this.stepNum++
    },
    // 步进器减
    stepReduce() {
      if (this.stepNum<=1) {
        this.$store.dispatch('changeToastAsync',{msg: '最少选择一件哟',type: 'wran'})
        return
      }
      this.stepNum--
    }
  },
  created() {
    let myid = this.$route.query.id
    this.getGoodsDetail(myid)
  },
  // 监测路由然后刷新页面，不然路径一样id变化的情况下，只是地址栏中的地址变化了，页面并不会变化，所以要刷新页面
  watch: {
    $route(to, from) {
      if (to.fullPath === from.fullPath) return;
      this.$router.go(0); // 刷新页面
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../total.less');
main {
  height: 600px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 53px;
  border-bottom: 1px solid #ccc;
  .content {
    width: 970px;
    display: flex;
    justify-content: space-between;
    .c-left {
      img {
        display: block;
        width: 459px;
        height: 459px;
      }
      ul {
        margin-top: 21px;
        width: 459px;
        display: flex;
        justify-content: space-between;
        li {
          cursor: pointer;
          width: 100px;
          height: 100px;
          opacity: 0.4;
          &.active {
            opacity: 1;
          }
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
    .c-right {
      padding: 2px 49px 0 31px;
      box-sizing: border-box;
      width: 510px;
      .top {
        padding-bottom: 23px;
        border-bottom: 1px solid #ccc;
        h2 {
          margin-top: 2px;
          margin-bottom: 15px;
          font-size: 28px;
          font-weight: 400;
          color: #000000;
        }
        p {
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          margin-bottom: 26px;
        }
        .coin {
          font-size: 28px;
          font-weight: bold;
          color: @orange;
        }
      }
      .down {
        .scolor {
          display: block;
          font-size: 16px;
          color: #000000;
          margin-top: 19px;
          margin-bottom: 14px;
        }
        ul {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          li {
            cursor: pointer;
            padding: 0 10px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin-right: 20px;
            margin-bottom: 11px;
            border: 1px solid #D1D1D1;
            color: #666666;
            &.active {
              border: 1px solid @blue;
              color: @blue;
            }
          }
        }
        .snum {
          display: block;
          font-size: 16px;
          color: #000000;
          margin-top: 19px;
          margin-bottom: 14px;
          span {
            font-size: 14px;
            color: #666;
            padding-left: 10px;
          }
        }
        .step {
          width: 106px;
          height: 32px;
          display: flex;
          justify-content: space-between;
          user-select: none;
          span {
            cursor: pointer;
            display: inline-block;
            width: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #D1D1D1;
            background: #fff;
          }
          .ipt {
            flex: 1;
            line-height: 30px;
            text-align: center;
            border-top: 1px solid #D1D1D1;
            border-bottom: 1px solid #D1D1D1;
            background: #fafafa;
          }
        }
        .btn {
          width: 320px;
          height: 46px;
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          div {
            cursor: pointer;
            width: 150px;
            line-height: 46px;
            color: #fff;
            text-align: center;
          }
          .btn1 {
            background: #3DC36B;
          }
          .btn2 {
            background: #FD604D;
          }
        }
        .share {
          margin-top: 35px;
          display: flex;
          justify-content: flex-start;
          .love {
            cursor: pointer;
            display: flex;
            align-items: center;
            border-right: 1px solid #ccc;
            margin-right: 20px;
            span {
              padding: 0 12px;
              font-size: 16px;
              color: #666;
            }
          }
        }
      }
    }
  }
  aside {
    box-sizing: border-box;
    padding-top: 2px;
    width: 230px;
    border-left: 1px solid #ccc;
    h3 {
      padding-left: 20px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
    }
    ul {
      width: 100%;
      box-sizing: border-box;
      padding-left: 20px;
      li {
        box-sizing: border-box;
        margin-bottom: 20px;
        cursor: pointer;
        &:hover {
          .li_img {
            border: 1px solid @blue;
          }
          p {
            color: @blue;
          }
        }
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .li_img {
          width: 80px;
          margin-right: 11px;
          display: block;
          border: 1px solid transparent;
        }
        p {
          width: 111px;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .coin {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            color: @orange;
            font-size: 18px;
            font-weight: bold;
          }
          img {
            display: block;
            width: 20px;
            height: 20px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.tab {
  display: flex;
  margin-bottom: 40px;
  li {
    cursor: pointer;
    width: 120px;
    height: 50px;
    font-size: 18px;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    background: #fff;
    &.active {
      color: #fff;
      background: @blue;
    }
  }
}
.tupian {
  padding-bottom: 40px;
}
.issue {
  padding-bottom: 40px;
  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  p {
    line-height: 1.3;
  }
}
</style>
