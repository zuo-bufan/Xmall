<template>
    <div class="footer">
        <div class="banxin">
            <div class="footer-l">
                <img src="@/assets/images/home/slogan.png" alt="">
                <p>本网站仿造叩丁严选积分商城，官网地址位：sc.wolfcode.cn,使用叩丁严选积分商城的后台数据。本网站仅供参考或学习，切勿用到商业用途！</p>
            </div>
            <div class="footer-c">
                <ul>
                    <li>
                        <a href="javascript:;">微信公众号</a>
                        <img src="../assets/images/home/wx.png" alt="">
                    </li>
                     <li>
                        <a href="javascript:;">新浪微博</a>
                    </li>
                     <li>
                        <a href="javascript:;">在线客服</a>
                        <img src="../assets/images/home/service.png" alt="">
                    </li>
                </ul>
            </div>
            <div class="footer-r">
                <p>全国免费咨询热线：</p>
                <h2 style="width:203px;">0552-88889528</h2>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    methods: {

    }
};
</script>

<style scoped lang="less">
@import url('../total.less');
.footer{
    height: 240px;
    background: #242b39;
    .banxin{
        display: flex;
        justify-content: space-between;
        .footer-l{
            width: 426px;
            height: 240px;
            img{
                display: block;
                margin-top: 33px;
                margin-bottom: 27px;
            }
            p{
                font-size: 16px;
                color: darkred;
                margin-top: 27px;
                line-height: 1.4;
            }
        }
        .footer-c{
            ul{
                display: flex;
                justify-content: space-between;
                margin-top: 123px;
                li{
                    position: relative;
                    border-right:1px solid #7d879a; 
                    padding: 0 18px;
                    &:last-child{
                        border: none;
                    }
                    &:hover{
                        img{
                            display: block;
                        }
                    }
                    a{
                        text-decoration: none;
                        color: #7d879a;
                    }
                    img{
                        position: absolute;
                        top: -115px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: none;
                    }
                }
            }
        }
        .footer-r{
            margin-top: 92px;
            p{
                color: #7d879a;
                margin-bottom: 10px;
            }
            h2{
                width: 190px;
                font-weight: bold;
                color: #fff;
                font-size: 22px;
            }
        }
    }
}
</style>
