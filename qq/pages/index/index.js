//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: qq.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    qq.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('Page onLoad: ');
  },
  onShow: function() {
    console.log('Page onShow');
  },
  onHide: function() {
    console.log('Page onHide: ');
  },
  onShareAppMessage: function (res) {
    console.log('Page onShareAppMessage: ');

    return {
      title: '友盟demo',
      path: 'pages/index/index?param1=111&param2=222',
      imageUrl: 'http://a0.att.hudong.com/27/07/01000000000000119090705857127_s.jpg'
    }
  },
  getAppHide: function () {
    var data = qq.getStorageSync('apphide')
    qq.showModal({
      title: 'apphide', // alert 框的标题
      content: data || '',
    });
  },

  getPageHide: function () {
    var data = qq.getStorageSync('pagehide')
    qq.showModal({
      title: 'pagehide', // alert 框的标题
      content: data || '',
    });
  },

  getPaqeUnload: function () {
    var data = qq.getStorageSync('pageunload')
    qq.showModal({
      title: 'pageunload', // alert 框的标题
      content: data || '',
    });
  },

  getHideCb: function () {
    var data = qq.getStorageSync('hidecb')
    console.log('hidecb: ', data);
    qq.showModal({
      title: 'hidecb', // alert 框的标题
      content: data || '',
    });
  },

  clearCache: function() {
    qq.clearStorageSync();
  },
  storageCache:function() {
    cache().save();
    console.log('cache---save---success!!!!!!!!!!');
  },

  gotoPage1: function() {
    qq.navigateTo({
      url: "../../pages/page1/page1"
    });
    console.log('gotoPage1');
  },

  gotoComponentPage: function() {
    qq.navigateTo({
      url: "../component-page/component-page"
    });
  },

  getCache: function() {
    const cache = qq.getStorageSync('umeng_cache');
    console.log('cache', cache);
  },

  connectWS: function() {
    var TEST_URL = 'ws://192.168.31.64:3000/send';
    this._socket = qq.connectSocket({
      url: TEST_URL + '?token=124'
    });
  },

  closeWS: function() {
    if(this._socket) {
      this._socket.close();
    }
  },

  testStorageRead: function() {
    console.time('set memory');
    const value = 'value';
    console.timeEnd('set memory');

    console.time('set storage');
    qq.setStorageSync('key', 'value');
    console.timeEnd('set storage');

    for (let i = 0; i < 100; i++) {
      console.time('get memory: ' + i);
      var value1 = value;
      console.timeEnd('get memory: ' + i);

      console.time('get storage: ' + i);
      var value2 = qq.getStorageSync('key');
      console.timeEnd('get storage: ' + i);
    }
  },

  getUserInfo: function(e) {
    qq.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
      }
    })
  },

  trackEvent: function(){
    qq.uma.trackEvent("eventId", {
      key1: 'value1',
      key2: 'value2',
      key3: 99
    });
  },

  gotoLog: function() {
    qq.navigateTo({
      url: '../logs/logs?query=1235&path=test'
    })
  },

  handleSetOpenid: function () {
    qq.uma.setOpenid('111333111333');
  },

  handleSetUnionid: function () {
    qq.uma.setUnionid('222444222444');
  },

  handleSetUserid: function () {
    qq.uma.setUserid('gongzhen', 'customer');
  },

  setCookies: function () {
    qq.setCookies({
      cookies: [{
        key: 'uuu',
        value: '111',
        expires: Date.now() + (5 * 24 * 60 * 60 * 1000)
      }],
      success: function (res) {
        console.log('success')
        console.log(res);
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },

  getCookies: function () {
    qq.getCookies({
      keys: ['uuu'],
      success: function (res) {
        console.log('success')
        console.log(res);
        qq.showModal({
          title: res.cookies[0]['uuu'],
          content: '',
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },

  authorize: function () {
    qq.authorize({
      scope: 'scope.userinfo',
      success(res) {
        console.log('success: ', res);
      },
      fail(e) {
        console.log('fail: ', e);
      }
    })
  },
})
