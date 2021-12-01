<template>
  <div class="cart_page">
    <div v-show="cartList.length!=0">
      <table>
        <thead>
          <tr>
            <th style="width: 8%">
              <i @click="totalselectClick" :class="totalSelect? 'iconfont icon-yduifuxuankuangxuanzhong': 'iconfont   icon-yduifuxuankuang'"></i>
            </th>
            <th style="width: 30%">礼品信息</th>
            <th>兑换分数</th>
            <th>数量</th>
            <th>小计 (鸡腿)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartList" :key="item.id">
            <td>
            <i @click="goodsSelect(item)" :class="item.isSelect ? 'iconfont icon-yduifuxuankuangxuanzhong': 'iconfont icon-yduifuxuankuang'"></i>
            </td>
            <td>
            <section>
              <img width="84" v-lazy="'http://sc.wolfcode.cn' + item.coverImg" alt="列表图片">
              <div class="info">
                <h5>{{item.title}}</h5>
                <p>{{item.versionDescription}}</p>
              </div>
            </section>
            </td>
            <td>{{item.coin}}鸡腿</td>
            <td>
            <div class="step">
              <span @click="reduceFn(item)">-</span>
              <input type="text" disabled v-model="item.total" />
              <span @click="addFn(item)">+</span>
            </div>
            </td>
            <td>{{item.totalCost * item.total}}鸡腿</td>
            <td>
            <span class="del" @click="openDetele(item)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="total">总计：<span>{{totalPrice}}鸡腿</span></div>
      <div class="submit" @click="pay">结算</div>
      <!-- 确认删除商品的模态框 -->
      <transition name="fade">
        <div class="modal" v-if="isShowModal" @mousewheel.prevent>
          <section @click="isShowModal=false"></section>
          <div class="wranbox">
            <div class="text">你确定删除此商品吗？</div>
            <div class="button1" @click="isShowModal=false">取消</div>
            <div class="button2" @click="deleteFn">确定</div>
          </div>
        </div>
      </transition>
    </div>
    <div class="cartEmpt" v-show="cartList.length==0">
      <img src="../../assets/images/noShop.png" alt="">
      <p>您的购物车是空的！</p>
    </div>
  </div>
</template>
<script>
import {getCartDataApi, deleteGoodsApi} from '../../request/api'
export default {
  name: 'Cart',
  data() {
    return {
      stepNum: 1,
      // 全选
      totalSelect: false,
      // 单选
      oneSelect: false,
      // 购物车数据
      cartList: [],
      // 确认删除的模态框
      isShowModal: false,
      // 要删除商品的id
      deleteId: 0
    };
  },
  computed: {
    // 总价的计算遍历cartList数组，对已选择的商品进阶价格计算
    totalPrice() {
      let num = 0;
      this.cartList.map(item => {
        if (item.isSelect) {
          num+=item.totalCost * item.total
        }
      })
      return num
    }
  },
  methods: {
    // 获取购物车数据请求
    getCartList() {
      getCartDataApi().then(res => {
        if (res.code===0) {
          // 深拷贝一下res.data
          let arr = JSON.parse(JSON.stringify(res.data))
          // 把每一个item里加一个isSelect属性，来判断当前商品是否选中，默认都为false
          arr.map(item => {
            item.isSelect = false
          })
          this.cartList = arr
        }
      })
    },
    // 全选按钮的点击事件
    totalselectClick() {
      // 切换全选的图标
      this.totalSelect = !this.totalSelect
      // 对每个一商品的选择框图片进行切换
      this.cartList.map(item => {
        item.isSelect = this.totalSelect
      })
    },
    // 每一个商品选择框的点击事件
    goodsSelect(item) {
      // 不管点击了谁，也不管点击之后这一项到底是选中还是不选中，总之一定要计数，如果处于勾选状态的个数===数组的长度，此时就应该全选，否则全选按钮处于未勾选状态
      item.isSelect = !item.isSelect
      let num = 0
      this.cartList.forEach(val => {
        if (val.isSelect) num++
      })
      if (num == this.cartList.length) {
        // 设置全选按钮处于勾选状态
        this.totalSelect = true
      } else {
        // 设置全选按钮处于不勾选状态
        this.totalSelect = false
      }
    },
    // 步进器加
    addFn(item) {
      if (item.total>=10) {
        this.$store.dispatch('changeToastAsync',{msg:'已达上限了哦',type: 'wran'})
        return
      }
      item.total++
    },
    // 步进器减
    reduceFn(item) {
      if (item.total<=1) {
        this.$store.dispatch('changeToastAsync',{msg:'不能再减了哟',type: 'wran'})
        return
      }
      item.total--
    },
    // 打开确认删除商品的模态框
    openDetele(item) {
      this.isShowModal = true
      // 存储要删除的这个商品的id
      this.deleteId = item.id
    },
    // 删除购物车商品
    deleteFn() {
      // 关闭确认删除商品的模态框
      this.isShowModal = false
      deleteGoodsApi({
        id: this.deleteId
      }).then(res => {
        if (res.code===0) {
          this.$store.dispatch('changeToastAsync',{msg:'删除成功',type: 'success'})
          // 服务器上已经删除了，本地localStorage中也要更新一下
          let local = JSON.parse(localStorage.getItem('userInfo'))
          let newLocal = {
            ...local,
            cartNum: --local.cartNum
          }
          localStorage.setItem('userInfo',JSON.stringify(newLocal))
          // 通知user组件，让user组件通知它的父组件app，让app组件重新加载header组件
          this.$emit('gengxinnum')
          // 在重新请求购物车里的数据，更新购物车数据页面的视图
          this.getCartList()
        }
      })
    },
    // 支付
    pay() {
      if (this.totalPrice==0) {
        this.$store.dispatch('changeToastAsync',{msg:'您还未选择任何商品',type: 'wran'})
      } else {
        this.$store.dispatch('changeToastAsync',{msg:'抱歉暂不对外开放',type: 'erro'})
      }
    }
  },
  created() {
    this.getCartList()
  }
};
</script>
<style lang="less" scoped>
@import '../../total.less';
.cart_page {
  background: #f5f5f5;
  table {
    width: 100%;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    color: #666;
    border-collapse: collapse;
    font-size: 14px;
    thead {
      background: #f2f2f2;
      th {
        padding: 19px 0;
        .iconfont {
          cursor: pointer;
        }
        .icon-yduifuxuankuangxuanzhong {
          color: #0a328e;
        }
      }
    }
    tbody {
      tr {
        td {
          vertical-align: middle;
          text-align: center;
          padding: 19px 0;
          // table-layout: fixed; // td的宽度固定，不随内容变化
          .iconfont {
            cursor: pointer;
          }
          .icon-yduifuxuankuangxuanzhong {
            color: #0a328e;
          }
          section {
            padding-left: 20px;
            display: flex;
            box-sizing: border-box;
            img {
              margin-right: 12px;
            }
            .info {
              padding-top: 20px;
              flex: 1;
              overflow: hidden;
              box-sizing: border-box;
              text-align: left;
              h5 {
                overflow: hidden;
                color: #333;
                font-size: 18px;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 20px;
              }
              p {
                color: #666;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .step {
            width: 106px;
            height: 32px;
            margin: auto;
            span {
              user-select: none;
              float: left;
              width: 30px;
              height: 32px;
              display: block;
              border: solid 1px #d1d1d1;
              font-size: 20px;
              box-sizing: border-box;
              font-weight: normal;
              font-stretch: normal;
              line-height: 30px;
              letter-spacing: 0px;
              color: #999999;
              text-align: center;
              cursor: pointer;
              background: #fff;
            }
            input {
              box-sizing: border-box;
              width: 46px;
              height: 32px;
              float: left;
              text-align: center;
              font-size: 14px;
              line-height: 23px;
              letter-spacing: 0px;
              color: #666666;
              border: 0;
              border-top: 1px solid #d1d1d1;
              border-bottom: 1px solid #d1d1d1;
              background: #fff;
            }
          }
          .del {
            border: 1px solid #ececec;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            &:hover {
              color: #fff;
              background: #0a328e;
            }
          }
        }
      }
    }
  }
  .total {
    padding: 30px 0;
    text-align: right;
    font-size: 22px;
    span {
      font-weight: bold;
      color: #fd604d;
    }
  }
  .submit {
    width: 175px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-family: SourceHanSansSC-Light;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    cursor: pointer;
    background-color: #0a328e;
    float: right;
  }
}

.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  section {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
  }
  .wranbox {
    border-radius: 10px;
    position: absolute;
    top: 0;left: 0;bottom: 0;right: 0;
    margin: auto;
    width: 300px;
    height: 170px;
    background: #fff;
    .text {
      text-align: center;
      margin-top: 40px;
      font-size: 20px;
      font-weight: 700;
    }
    .button1,.button2 {
      position: absolute;
      bottom: 20px;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
    .button1 {
      left: 30px;
      background: #ccc;
    }
    .button2 {
      right: 30px;
      background: @blue;
    }
  }
}


.cartEmpt {
  text-align: center;
  padding-top: 110px;
  p {
    margin-top: 35px;
    color: #999;
    font-size: 18px;
  }
}


// 这里是模态框的过渡动画
// 入场的起始状态就等于立场的最终状态
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,.fade-leave-active {
transition: opacity .3s linear;
}
.fade-enter-to,.fade-leave {
opacity: 1;
}
</style>