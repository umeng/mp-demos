// pages/index/index.js


Page({
  data: {
    motto: 'Hello TT',
    userInfo: {},
    hasUserInfo: false,
    canIUse: tt.canIUse('button.open-type.getUserInfo'),
    hideInfo: ''
  },

  _socket: null,

  onShow: function(options) {
    console.log('index page show', options);

  },
  onHide: function(options){
    
  },
  onUnload: function(options) {
    
  },
  onShareAppMessage: function(res) {
    console.log('index Page onShareAppMsg: ', res);


    return {
      title: '友盟demo',
      path: 'pages/index/index?_um_campaign=5ee36c43dbc2ec076dd4723a&_um_channel=5ee36c43dbc2ec076dd4723b',
      imageUrl: 'http://a0.att.hudong.com/27/07/01000000000000119090705857127_s.jpg',
      success () {
        console.log('转发发布器已调起，并不意味着用户转发成功，微头条不提供这个时机的回调');
      },
      fail () {
        console.log('转发发布器调起失败');
      }
    }
  },

  onLoad (query) {
    if (query.from === 'sharebuttonabc') {
      // do something...
    }
  },

  clearSDKCache: function(){
    tt.clearStorageSync();
  },

  storageCache: function(){
    console.log('cache---save---success!!!!!!!!!!');
  },

  gotoPage1: function() {
    tt.navigateTo({
      url: '../page1/page1' // 指定页面的url
    });
  },

  gotoComponentPage: function(){
    tt.navigateTo({
      url: '../component-page/component-page' // 指定页面的url
    });
  },

  gotoLog: function() {
    tt.navigateTo({
      url: '../logs/logs?query=1235&path=test'
    })
  },

  getUserInfo: function(e) {
    console.log('.....getUserInfo');
    tt.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
      },
      fail(res) {
        console.log(`getUserInfo 调用失败`);
      }
    })
  },

  trackEvent: function(){
    tt.uma.trackEvent('eventId', {
      key1: 'value1',
      key2: 'value2',
      key3: 99
    })
  },

  handleSetOpenid: function () {
    tt.uma.setOpenid('ttTestOpenId');
  },

  handleSetAnonymousid: function () {
    tt.uma.setAnonymousid('ttTestAnonymousid');
  },

  handleSetUserid: function () {
    tt.uma.setUserid('ttTestUserId', 'customer');
  },

})