import axios from 'axios';

const instance = axios.create({
    baseURL: "http://gz.wolfcode.cn/cms",
    timeout: 5000
});

// http request 请求拦截器
instance.interceptors.request.use((config) => {
    // console.log(config);
    if (config.url === "/wechatUsers/PCLogin" || config.url === "/sendSMS" || config.url === '/phoneRegin' || config.url === '/shop/carts/add' || config.url === '/wechatUsers/binding') {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    const token = localStorage.getItem("x-auth-token");
    if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers["x-auth-token"] = token; //请求头加上token
    }
    return config;
}, (err) => {
    return Promise.reject(err);
})


// http response 响应拦截器
instance.interceptors.response.use((res) => {
    // console.log(res);

    return res.data;
}, (err) => {
    return Promise.reject(err);
})


export default instance