# uni-app

# 1.注册友盟+账号 
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)

# 2.友盟官网申请小程序appkey
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)
# 3.配置域名白名单等
 [官网微信小程序文档](https://developer.umeng.com/docs/147615/detail/147619) 
 [官网原生支付宝小程序接入](https://developer.umeng.com/docs/147615/detail/147727)
 [官网字节节接入文档](https://developer.umeng.com/docs/147615/detail/171374)
# 4.创建uni-app框架下的app [demo](https://github.com/umeng/mp-demos/tree/master/uniapp)
# 5.安装sdk
```bash
cd path-to-uniappproject
npm install umtrack-alipay --save
npm install umtrack-wx --save
```
字节等不支持npm的参考如下步骤
> 打开官方帮助文档，找到sdk下载地址，下载最新的sdk文件
> 将文件移动到uni-app工程某目录 比如./libs/umtrack-tt/uma.min.js
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
// 字节sdk
// #ifdef MP-TOUTIAO
import uma from './libs/umtrack-tt/uma.min.js'
uma.init({
    appKey: 'YOUR_UMENG_APPKEY', //由友盟分配的APP_KEY
    autoGetOpenid: false, // 是否需要通过友盟后台获取openid或匿名openid，如若需要，请到友盟后台设置appId及secret
    debug: true, //是否打开调试模式
    uploadUserInfo: false // 自动上传用户信息，设为false取消上传，默认为false
  })
// #endif
// 此处用来挂载入uma到组件实例上，方便组件内使用this.$uma
uma.install = function (Vue) {
	Vue.prototype.$uma = uma;
}
import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false
Vue.use(uma);
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
  this.$uma.trackEvent('eventID',{pa:'fff'});
},
```
# 8. sdk集成位置尽量靠前