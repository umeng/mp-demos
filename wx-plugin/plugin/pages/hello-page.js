// plugin/pages/hello-page.js
import uma from '../umawrap';
Page({
  data: {},
  onLoad() {
    console.log('This is a plugin page!')
  },
  onShow(){
    //wx.uma.trackEvent('xxx')
  }
})
