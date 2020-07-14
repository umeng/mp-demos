//app.js
var uma = require('./lib/uma.min');
// import 'umtrack-qq';

App({
  umengConfig: {
    appKey: '5ef04e116975e3e1362f37f7', 
    useOpenid: true,
    autoGetOpenid: true,
    uploadUserInfo: true,
    debug: true 
  },
  onLaunch(options) {
    console.log('app onLaunch', options);

  },

  onShow(options) {
    console.log('app show', options);

  },

  onHide() {
    console.log('app hide');
    
  },

  onError(/* msg */) {
    console.log('onError');
    qq.showToast({
      title: 'onError',
      content: ''
    });
  },
  globalData: {
    userInfo: null
  }
})
