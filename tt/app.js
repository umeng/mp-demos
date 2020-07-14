var uma = require('./lib/uma.min');


App({
  umengConfig: {
    appKey: 'testAppkey', 

    autoGetOpenid: true,
    debug: true,
    uploadUserInfo: true
  },

  onLaunch: function (options) {

  },

  onShow: function(options) {
    
  },

  onHide: function(options) {

  },

  onError: function(msg) {
    console.log('onError');
    tt.showToast({
      title: 'onError',
    });
  },
  globalData: {
    userInfo: null,
    uma: uma,
  },


})
