vue简易轮播组件

### 安装
npm install vue-cnm-swiper --save

```html
<swiper class="swiper" ref="swiper" :options="options">
	<swiper-slide class="swiper-slide" v-for="i in 5" :key="i">{{i}}</swiper-slide>
</swiper>
```
```javascript
import Swiper from 'vue-cnm-swiper'
Vue.use(Swiper)
```

### Options
```javascript
{
	draggable: true,
	pagination: false,
	autoplay: false,
	delay: 2000
}
```

### API

**next**
下一页
**prev**
上一页
**goTo(index)**
跳到
**avtiveIndex**
获取当前页数