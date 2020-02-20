import uma from 'umtrack-wx'
import Vue from 'vue'
import App from './App'

uma.init({
	appKey: 'YOUR_APP_KEY',
	useOpenid: true,
	autoGetOpenid: true,
	debug: true
})

Vue.prototype.uma = uma;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
