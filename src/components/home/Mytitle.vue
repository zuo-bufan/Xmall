<template>
    <div class="mytitle">
        <div class="left">
            <img :src="titleImg" alt="">
            <h2>{{titles}}</h2>
        </div>
        <div class="right">
            <span>更多</span>
            <img src="../../assets/images/home/Arrow.png" alt="">
        </div>
    </div>
</template>

<script>
export default {
    props:['titles','titleImg'],
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
.mytitle{
    width: 100%;
    height: 106px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
        display: flex;
        align-items: center;
        h2{
            margin-left: 10px;
            font-size: 30px;
            font-weight: 700;
            color: #242b39;
        }
    }
    .right{
        cursor: pointer;
        span{
            margin-right: 6px;
            color: #666;
        }
    }
}
</style>
