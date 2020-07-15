import uma from './uma';
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.use(uma);

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
