<template>
  <div class="toast">
    <i class="iconfont" :class="$store.state.toastType=='success' ? 'icon-toast_chenggong' : ($store.state.toastType=='erro' ? 'icon-toast-shibai_huaban' : 'icon-toast-jinggao')"></i>
    <span>{{$store.state.toastMsg}}</span>
  </div>
</template>

<script>
export default {
  name: 'Toast'
}
</script>

<style lang="less" scoped>
.toast {
  position: fixed;
  z-index: 99;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  padding: 10px 20px;
  // background: #fff;
  color: #fff;
  // box-shadow: 0 0 10px pink;
  background: rgba(0, 0, 0, .5);
  span {
    margin-left: 5px;
  }
  .icon-toast-shibai_huaban {
    color: red;
  }
  .icon-toast_chenggong {
    color: green;
  }
  .icon-toast-jinggao {
    color: orange;
  }
}
</style>
