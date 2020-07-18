<template>
  <div id="app">
    <swiper class="swiper" ref="swiper" @show="d => swiperdata = d">
      <swiper-slide class="swiper-slide" v-for="i in num" :key="i">{{i}}</swiper-slide>
    </swiper>
    <button @click="refswiper.next()">next</button>
    <button @click="refswiper.prev()">prev</button>
    <button @click="num++">add</button>
  </div>
</template>

<script>
import Swiper from './components/Swiper/index'
import SwiperSlide from './components/SwiperSlide/index'
export default {
  name: 'App',
  components: {
    Swiper, SwiperSlide,
  },
  data () {
    return {
      num: 5,
      swiperdata: '',
      refswiper: null
    }
  },
  methods: {
    fuck () {
      console.log(1);
    },
  },
  mounted () {
    this.refswiper = this.$refs.swiper 
  }
}
</script>

<style lang="less" scoped>
#app{
  margin-left: 500px;
  .swiper{
    width: 600px;
    height: 200px;
    border: 1px solid #000;
  }
  .swiper-slide{
    font-size: 40px;
    text-align: center;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>