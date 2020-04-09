// #ifdef MP-WEIXIN
import uma from 'umtrack-wx';
uma.init({
  appKey: 'xxxxxx',
  useOpenid: false,
  autoGetOpenid: false,
  debug: true
});
// #endif
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
  appKey: 'xxxxx',
  debug: true
});
// #endif

import Vue from 'vue'
import App from './App'

Vue.prototype.uma = uma;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
