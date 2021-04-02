
import uma from './uma.min.js'
// uma.preinit({
//   ENDPOINT: "https://preulogs.umeng.com"
// });
uma.init({
  debug:true,
  appKey: 'YOUR_APP_KEY',
  useOpenid:false,
  autoGetOpenid:false,
  uploadUserInfo:false
})
App({
  onLaunch: function () {
    // ks.onAppHide(function(){
    //   console.log('onAppHide.....')
    // })
    ks.getSystemInfo({
      success:function(res){
        console.log(res);
      }
    })
  },
  onShow(){
    ks.showToast({
      title: 'onShow',
      icon: 'success',
      duration: 2000
  })
   this.globalData.showtime = this.globalData.showtime + '|' + new Date();
    console.log('onShow....');
  },
  onHide:function(){
      this.globalData.hidetime = this.globalData.hidetime +'|' + new Date() ;
    console.log('onHide....');
  },
  globalData:{
      showtime:'',
      hidetime:''
  }
})