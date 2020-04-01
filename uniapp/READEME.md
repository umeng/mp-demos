# uni-app

# 1.注册友盟+账号 
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)

# 2.友盟官网申请小程序appkey
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)
# 3.配置域名白名单等
 [官网微信小程序文档](https://developer.umeng.com/docs/147615/detail/147619) 
 [官网原生支付宝小程序接入](https://developer.umeng.com/docs/147615/detail/147727)
# 4.创建uni-app框架下的app [demo](https://github.com/umeng/mp-demos/tree/master/uniapp)
# 5.安装sdk
```bash
cd path-to-uniappproject
npm install umtrack-alipay --save
npm install umtrack-wx --save
```
# 6.利用条件编译集成sdk
***main.js***
```js
// #ifdef MP-WEIXIN
import uma from 'umtrack-wx';
uma.init({
	appKey: 'xxxx',
	useOpenid: false,
	autoGetOpenid: false,
	debug: true
});
// #endif
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
	appKey: 'xxxx',
	debug: false
});
// #endif
import Vue from 'vue'
import App from './App'

Vue.prototype.uma = uma || {};// 此处用来挂载入uma到组件实例上，方便组件内使用this.uma
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

```
# 7.自定义事件
***/pages/index/index/vue***
```js
onLoad(){
  this.uma.trackEvent('eventID',{pa:'fff'});
},
```
# 8. sdk集成位置尽量靠前