// import uma from 'umtrack-wx'; // 开发微信小程序时导入此模块
import uma from 'umtrack-alipay'; // 开发支付宝小程序时导入此模块
import Vue from 'vue'
import App from './App'

uma.init({
	appKey: 'YOUR_APP_KEY',
  useOpenid: false,
  autoGetOpenid: false,
	debug: true
});

Vue.prototype.uma = uma;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
