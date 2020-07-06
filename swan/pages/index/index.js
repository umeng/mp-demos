//index.js
//获取应用实例
// import cache from '../../src/core/cache.js';
// import udevice from '../../src/common/udevice.js';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hideInfo: ''
  },

  _socket: null,

  //事件处理函数
  gotoLog: function () {
    swan.navigateTo({
      url: '../logs/logs?query=1235&path=test'
    });
  },

  onLoad: function () {
    // console.log('page load');

    // console.log('Page onLoad: ', this);
    console.log('22222', swan.uma);
  },

  onShow: function () {

    //   // console.log('page show');

    //   // console.log('Page onShow: ', this);

    //   // var data = wx.getStorageSync('pagehide')
    //   // wx.showModal({
    //   //   title: 'pagehide', // alert 框的标题
    //   //   content: data || '',
    //   // });

    //   // var data1 = wx.getStorageSync('pageunload')
    //   // wx.showModal({
    //   //   title: 'pageunload', // alert 框的标题
    //   //   content: data1 || '',
    //   // });
    // console.log('index page show');
    //  console.log(22222, swan.onShareAppMessage);

     
  },

  onHide() {
    // 页面隐藏
    // console.log('page hide');
    console.log('Page onHide: ', this);

    // swan.setStorageSync('pagehide', '1');
  },

  onUnload() {
    // 页面被关闭
    // console.log('page unload');
    console.log('Page onUnload: ', this);

    swan.setStorageSync('pageunload', '1');
  },

  onShareAppMessage: function (res) {
    console.log('Page onShareAppMessage: ', this, this.data);

    return {
      title: '友盟demo',
      path: 'pages/index/index?param1=111&param2=222',
      imageUrl: null
      // imageUrl: 'http://a0.att.hudong.com/27/07/01000000000000119090705857127_s.jpg'
    };
  },

  getAppHide: function () {
    var data = swan.getStorageSync('apphide');
    swan.showModal({
      title: 'apphide', // alert 框的标题
      content: data || ''
    });
  },

  getPageHide: function () {
    var data = swan.getStorageSync('pagehide');
    swan.showModal({
      title: 'pagehide', // alert 框的标题
      content: data || ''
    });
  },

  getPaqeUnload: function () {
    var data = swan.getStorageSync('pageunload');
    swan.showModal({
      title: 'pageunload', // alert 框的标题
      content: data || ''
    });
  },

  getHideCb: function () {
    var data = swan.getStorageSync('hidecb');
    console.log('hidecb: ', data);
    swan.showModal({
      title: 'hidecb', // alert 框的标题
      content: data || ''
    });
  },

  clearSDKCache: function () {
    swan.clearStorageSync();
  },

  storageCache: function () {
    cache().save();
    console.log('cache---save---success!!!!!!!!!!');
  },

  gotoPage1: function () {
    swan.navigateTo({
      url: "../page1/page1"
    });
    // console.log('gotoPage1');
  },

  gotoComponentPage: function () {
    swan.navigateTo({
      url: "../component-page/component-page"
    });
  },

  getCache: function () {
    const cache = swan.getStorageSync('umeng_cache');
    console.log('cache', cache);
  },

  connectWS: function () {
    var TEST_URL = 'ws://192.168.31.64:3000/send';
    this._socket = swan.connectSocket({
      url: TEST_URL + '?token=124'
    });
  },

  closeWS: function () {
    if (this._socket) {
      this._socket.close();
    }
  },

  testStorageRead: function () {
    console.time('set memory');
    const value = 'value';
    console.timeEnd('set memory');

    console.time('set storage');
    swan.setStorageSync('key', 'value');
    console.timeEnd('set storage');

    for (let i = 0; i < 100; i++) {
      console.time('get memory: ' + i);
      var value1 = value;
      console.timeEnd('get memory: ' + i);

      console.time('get storage: ' + i);
      var value2 = swan.getStorageSync('key');
      console.timeEnd('get storage: ' + i);
    }
  },

  getUserInfo: function (e) {
    swan.getUserInfo({
      success: function (res) {
        console.log(res.userInfo);
      }
    });
  },

  trackEvent: function () {
    swan.uma.trackEvent("eventId", {
      key1: 'value1',
      key2: 'value2',
      key3: 99
    });
  },

  handleSetOpenid: function () {
    // swan.uma.setOpenid('111333111333');
  },

  handleSetUnionid: function () {
    // swan.uma.setUnionid('222444222444');
  },

  handleSetUserid: function () {
    swan.uma.setUserid('gongzhen', 'customer');
  },

  handleSetAnonymousid: function() {
    console.log('abcde')
    swan.uma.setAnonymousid('abcde');
  },

  setCookies: function () {
    swan.setCookies({
      cookies: [{
        key: 'uuu',
        value: '111',
        expires: Date.now() + 5 * 24 * 60 * 60 * 1000
      }],
      success: function (res) {
        console.log('success');
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  getCookies: function () {
    swan.getCookies({
      keys: ['uuu'],
      success: function (res) {
        console.log('success');
        console.log(res);
        swan.showModal({
          title: res.cookies[0]['uuu'],
          content: ''
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  authorize: function () {
    swan.authorize({
      scope: 'scope.userInfo',
      success(res) {
        console.log('success: ', res);
      },
      fail(e) {
        console.log('fail: ', e);
      }
    });
  },

//   clearCache: function () {
//     swan.uma.rc.clearCache();
//   },

  fetch: function () {
    console.log(swan.uma.rc);
    swan.uma.rc.fetch({
      active: true
    });
  },

  active: function () {
    console.log('click active');
    swan.uma.rc.active();
  },

  getValue: function () {
    console.log(22222, swan.uma.rc.getValue('home_color'));
  }
});