<template>
  <div class="e1nBFI"><slot></slot></div>
</template>

<script>
export default {
  name: 'swiperSlide',
  mounted () {
    this.$parent.inited && this.$parent._updateSlide()
  }
}
</script>

<style lang="less" scoped>
.e1nBFI{
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}
</style>