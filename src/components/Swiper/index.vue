<template>
  <div class="xU1c7L">
    <div class="ie8uha" v-show="cant"></div>
    <div class="yxtVuX pGhsR3" :style="swiperStyle" @mousedown="_down">
      <slot></slot>
    </div>
    <div class="xXQ65t" v-if="options.pagination">
      <div
        :class="index === currentSlide ? 'active' : ''"
        v-for="(i, index) in itemLength"
        :key="index"
        @click="_slideTo(index)"
      ></div>
    </div>
  </div>
</template>

<script>
/**
 * todo:
 *   direction
 *   loop
 *   不基于vue的
 *   兼容性调查
 */
let DOM = {};
let SWIPER_WIDTH = 0;
let downTime = 0;
let bodyMove = null;
let bodyUp = null;
let divisions = [];
let sections = [];
let lastItem = arr => arr[arr.length - 1];
let firstItem = arr => arr[0];
let timer = null
let slideName = 'swiperSlide'
function getTransformByMatrix (translateString) {
  var matrix = translateString.match(/matrix(3d)?\((.+?)\)/);
  var is3D = matrix && matrix[1];
  if (matrix) {
    matrix = matrix[2].split(",");
    if (is3D === "3d") matrix = matrix.slice(12, 15);
    else {
      matrix.push(0);
      matrix = matrix.slice(4, 7);
    }
  } else {
    matrix = [0, 0, 0];
  }
  var result = {
    x: parseFloat(matrix[0]),
    y: parseFloat(matrix[1]),
    z: parseFloat(matrix[2])
  };
  return result;
};
export default {
  name: "swiper",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          draggable: true,
          pagination: false,
          preventOnTransition: false,
          autoplay: false,
          delay: 2000,
          resistance: 0.85
        };
      }
    }
  },
  data() {
    return {
      isMouseDown: false,
      isMouseMove: false,
      downPageX: 0,
      movePageX: 0,
      itemLength: 0,
      currentSlide: 0,
      slideDistance: 0,
      inited: false,
      transitioning: false,
      quicktransitioning: false
    };
  },
  computed: {
    cant () {
      return this.quicktransitioning || (this.preventOnTransition && this.transitioning)
    },
    maxDistance() {
      return (this.itemLength - 1) * -SWIPER_WIDTH;
    },
    moveDistance() {
      if (!this.isMouseMove) return 0;
      return this.movePageX - this.downPageX
    },
    swiperStyle() {
      let dis = this.moveDistance + this.slideDistance
      let r = 0;

      if (dis > 0) {
        r = dis * this.options.resistance;
        dis -= r;
      } else if (dis < this.maxDistance) {
        r =
          (Math.abs(dis) - Math.abs(this.maxDistance)) *
          this.options.resistance;
        dis += r;
      }

      return {
        transform: `translateX(${dis}px)`
      };
    }
  },
  methods: {
    // 对外方法
    next() {
      this.currentSlide++;
      this._judgePage();
      this._slideTo(this.currentSlide);
    },
    prev() {
      this.currentSlide--;
      this._judgePage();
      this._slideTo(this.currentSlide);
    },
    goTo(index) {
      this.currentSlide = index;
      this._judgePage();
      this._slideTo(this.currentSlide);
    },
    avtiveIndex () {
      return this.currentSlide
    },
    // _xx内部方法--------------------------------------------
    _show() {
      let data = {
        downPageX: this.downPageX,
        movePageX: this.movePageX,
        moveDis: this.moveDistance,
        dotClickDis: this.slideDistance,
        taotalDis: this.moveDistance + this.slideDistance,
      };
      this.$emit("show", JSON.stringify(data));
    },
    // 未过渡完就滑动，此时要加上相对距离
    _getTranslateX () {
      if (!DOM.yxtVuX) return 0
        
      let style = document.defaultView.getComputedStyle(DOM.yxtVuX, null);
      let translateX = getTransformByMatrix(style.transform).x
      console.log(translateX);
      return -translateX + this.slideDistance
    },
    _judgePage() {
      if (this.currentSlide < 0) {
        this.currentSlide = 0;
      } else if (this.currentSlide > this.itemLength - 1) {
        this.currentSlide = this.itemLength - 1;
      }
    },
    _slideTo(index) {
      clearInterval(timer)
      this.currentSlide = index;
      this.slideDistance = index * -SWIPER_WIDTH;
    },
    _down(event) {
      this.isMouseDown = true;
      downTime = new Date().valueOf();
      this.downPageX = event.pageX + this._getTranslateX();
      this._show();
    },
    _move(event) {
      if (this.isMouseDown) {
        DOM.yxtVuX.classList.remove("pGhsR3");
        this.isMouseMove = true;
        this.movePageX = event.pageX;
        this._show();
      }
    },
    _up(event) {
      DOM.yxtVuX.classList.add("pGhsR3");
      clearInterval(timer)

      let timeDiff = new Date().valueOf() - downTime;
      if (timeDiff < 1000 && this.moveDistance && !this.quicktransitioning) {
        this.quicktransitioning = true
        let step = sections.findIndex(
          item => Math.abs(this.moveDistance) > item
        );
        step = this.itemLength - step;

        this.moveDistance < 0
          ? (this.currentSlide += step)
          : (this.currentSlide -= step);

        this._judgePage();

        this._slideTo(this.currentSlide);
      } else {
        this._changePage();
      }

      this.isMouseDown = false;
      this.isMouseMove = false;
      this.downPageX = 0;
      this.movePageX = 0;
      this._show();
    },
    _changePage() {
      if (this.moveDistance < 0) {
        let dis = Math.abs(this.moveDistance) + Math.abs(this.slideDistance);

        if (dis > firstItem(divisions)) {
          this.slideDistance = this.maxDistance;
          this.currentSlide = this.itemLength - 1;
          return false;
        }
        let divisionIndex = divisions.findIndex(item => dis > item);

        if (divisionIndex > -1) {
          if (this.currentSlide === this.itemLength - 1) return false;
          this.slideDistance = -(divisions[divisionIndex] + SWIPER_WIDTH / 2);
          this.currentSlide = this.itemLength - divisionIndex;
        }
      } else {
        let divisionIndex = divisions.findIndex(item => {
          return Math.abs(this.moveDistance + this.slideDistance) > item;
        });

        if (divisionIndex > -1) {
          if (this.currentSlide === 0) return false;
          this.slideDistance = -(divisions[divisionIndex] + SWIPER_WIDTH / 2);
          this.currentSlide = this.itemLength - divisionIndex;
        } else {
          this.slideDistance = 0;
          this.currentSlide = 0;
        }
      }
    },
    _updateSlide() {
      this.itemLength = this.$children.filter(
        item => item.$options.name === slideName
      ).length;
      for (let i = 0; i < this.itemLength; i++) {
        divisions.push(SWIPER_WIDTH * (i + 1) - SWIPER_WIDTH / 2);
        sections.push(SWIPER_WIDTH * (i + 1) - SWIPER_WIDTH);
      }
      divisions.reverse();
      sections.reverse();
      console.log(divisions, sections);
    },
    _myinit() {
      bodyMove = this._move;
      bodyUp = this._up;
      document.addEventListener("mousemove", bodyMove);
      document.addEventListener("mouseup", bodyUp);

      DOM = {
        xU1c7L: document.querySelector(".xU1c7L"),
        yxtVuX: document.querySelector(".yxtVuX")
      };

      DOM.yxtVuX.addEventListener("transitionstart", () => {
        this.$emit('beforeChange')
        this.transitioning = true
      });
      DOM.yxtVuX.addEventListener("transitionend", () => {
        this.$emit('afterChange')
        DOM.yxtVuX.classList.remove("pGhsR3");
        this.transitioning = false;
        this.quicktransitioning = false;
        this._show();
      });
      SWIPER_WIDTH = DOM.xU1c7L.offsetWidth;

      if (this.options.autoplay) {
        timer = setInterval(() => {
          DOM.yxtVuX.classList.add("pGhsR3");
          this.next()
        }, this.delay < 2000 ? 2000 : this.options.delay);
      }
      this._updateSlide();
      this.$emit("init");
      this.inited = true;
    }
  },
  created() {},
  mounted() {
    this._myinit();
    this._show();
  },
  destroyed() {
    document.removeEventListener("mousemove", bodyMove);
    document.removeEventListener("mouseup", bodyUp);
  }
};
</script>

<style lang="less" scoped>
.xU1c7L {
  user-select: none;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  .ie8uha{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 1;
  }
  .pGhsR3 {
    transition: transform .5s;
  }
  .yxtVuX {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transform: translateX(0px);
  }
  .xXQ65t {
    transform: translateY(-30px);
    display: flex;
    justify-content: center;
    margin-top: 10px;
    div {
      cursor: pointer;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #ccc;
      margin: 5px;
      &.active,
      &:hover {
        background: #007aff;
      }
    }
  }
}
</style>