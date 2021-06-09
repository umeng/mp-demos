// app.js
var uma = require('./uma');

App({
  umengConfig: {
    appKey: 'YOUR_APP_KEY',
    useOpenid: false,
    autoGetOpenid: false,
    debug: true,
    uploadUserInfo:true
  },

  onLaunch(options) {
  },

  onShow(options) {
  },

  onHide() {
  },

  onError(/* msg */) {
  },
  
  globalData: {
    uma:uma
  }
});
