<template>
  <div class="mianbao">
    <slot class="abc"></slot>
  </div>
</template>

<script>
export default {
  name: 'Mianbao'
}
</script>

<style lang="less" scoped>
.mianbao {
  padding: 15px 0;
  span {
    &:nth-child(1) {
      font-weight: 700;
    }
  }
}
</style>