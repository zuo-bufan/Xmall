import request from './request'
// 接口文档已经告诉接口的Content-Type值为：application/x-www-form-urlencoded这个的，请求的参数需要经过qs.stringify转换
import qs from 'qs'

// 在axios中get请求的形参必须是params，post无所谓

// 获取精品推荐的请求
export const jingpinApi = () => request.get('/products/recommend')

// 获取积分兑换数据的请求
export const coinApi = () => request.get('/products/hot')

// 获取短信验证码请求
export const sendCodeApi = (params) => request.post('/sendSMS',qs.stringify(params))

// 手机验证码登录请求
export const phoneLoginApi = (params) => request.post('/phoneRegin',qs.stringify(params))

// 微信登录接口
export const WeixinLoginApi = (params) => request.post('/wechatUsers/PCLogin', qs.stringify(params))

// 获取用户信息
export const getUserInfoApi = () => request.get('/shop/userProfiles')

// 获取商品详情信息
export const goodsDetailApi = (params) => request.get(`/products/${params.id}`)

// 添加购物车
export const AddcartApi = (params) => request.post('/shop/carts/add', qs.stringify(params))

// 商品搜索（含首页的“更多”）
export const searchGoodsApi = (params) => request.get('/products',{params})

// 获取购物车数据
export const getCartDataApi = () => request.get('/shop/carts')

// 删除购物车商品
export const deleteGoodsApi = (params) => request.delete(`/shop/carts?productIds=${params.id}`)

// 手机号码绑定微信
export const binDingApi = (params) => request.post('/wechatUsers/binding', qs.stringify(params))

// 解绑微信
export const UnbinDingApi = () => request.put('/wechatUsers/unbindingWeChat')



