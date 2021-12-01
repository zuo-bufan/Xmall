<template>
    <div>
        <ul>
            <li>
                <h4>签到得鸡腿</h4>
                <div>去签到</div>
            </li>
             <li>
                <h4>签到得鸡腿</h4>
                <div>去签到</div>
            </li>
             <li>
                <h4>签到得鸡腿</h4>
                <div>去签到</div>
            </li>
             <li>
                <h4>签到得鸡腿</h4>
                <div>去签到</div>
            </li>
        </ul>
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
ul{
    display: flex;
    justify-content: space-between;
    li{
        cursor: pointer;
        width: 285px;
        height: 168px;
        box-sizing: border-box;
        padding-left: 20px;
        padding-top: 43px;
        transition: background-size .5s linear;
        background-size: 100% 100% !important;
        &:first-of-type{
            background: url('../../assets/images/home/integral-01.png')
        }
        &:nth-of-type(2){
            background: url('../../assets/images/home/integral-02.png')
        }
        &:nth-of-type(3){
            background: url('../../assets/images/home/integral-03.png');
        }
        &:nth-of-type(4){
            background: url('../../assets/images/home/integral-04.png')
        }
        &:hover{
            background-size: 105% 105% !important;
        }
        h4{
            font-size: 24px;
            margin-bottom: 19px;
            font-weight: blod;
            color: #fff;
        }
        div{
            width: 96px;
            height: 27px;
            border: 1px solid #fff;
            color: #fff;
            text-align: center;
            line-height: 27px;
        }
    }
}
</style>
