import './js/libs/weapp-adapter'
import './js/libs/symbol'
import './js/umstat';
import Main from './js/main'

new Main()
wx.onShow(()=>{
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userInfo']) {
        wx.authorize({
          scope: 'scope.userInfo',
          success () {
            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            
          },
          fail:function(){
            wx.openSetting({
              withSubscriptions: true,
            })
            let button = wx.createOpenSettingButton({
              type: 'text',
              text: '打开设置页面',
              style: {
                left: 10,
                top: 76,  
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
              }
            })
          }
        })
      }
    }
  })

})
