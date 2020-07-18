import Swiper from '@/components/Swiper/index.vue'
import SwiperSlide from '@/components/SwiperSlide/index.vue'
const lib = {
  install(Vue, options) {
    Vue.component(Swiper.name, Swiper)
    Vue.component(SwiperSlide.name, SwiperSlide)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(lib);
}

export default lib