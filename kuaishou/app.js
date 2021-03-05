
import uma from './uma.min.js'
uma.init({
  debug:true,
  appKey: 'YOUR_APP_KEY',
  useOpenid:false,
  uploadUserInfo:true
})
App({
  onLaunch: function () {
    ks.onAppHide(function(){
      console.log('hide.....')
    })
    ks.getSystemInfo({
      success:function(res){
        console.log(res)
      }
    })
  },
  onShow(){
    console.log(';;;;;;;;;;')
  },
  onHide:function(){
    console.log('...999999999....')
  },
})