// app.js
var uma = require('./lib/uma.min');
// import 'umtrack-swan';


App({
  umengConfig: {
    appKey: '5ee6f03fcedf3c0749c05a30', //rc 钰昭
    // useOpenid: true,
    // autoGetOpenid: true,
    uploadUserInfo: true,
    debug: true
  },

  onLaunch(options) {
    // wx.uma.setOpenid('oo3e-4pe2kdZzjxLAvxZqR5D8Mj9');
    
    // var eventId = 'eventid';
    // var properties = {};
    // for(var i = 0; i < 100; i++) {
    //   properties['event'+i] = i;
    // }
    // wx.uma.trackEvent(eventId, properties);
    // console.log('App onLaunch this:', this, options);   
  },

  onShow(options) {
    // console.log('app show', options);

    // var data = wx.getStorageSync('apphide')
    // wx.showModal({
    //   title: 'apphide', // alert 框的标题
    //   content: data || '',
    // });

    // console.log('App onShow this:', this, options);

    // var hidecb = wx.getStorageSync('hidecb');
    // // console.log('hidecb: ', hidecb);
    // wx.showModal({
    //   title: 'hidecb',
    //   content: hidecb || '',
    // });

    // var hide = wx.getStorageSync('hide');
    // // console.log('hide: ', hide);
    // wx.showModal({
    //   title: 'hide',
    //   content: hide || '',
    // });

    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })

    // swan.login({
    //     success: res => {
    //         console.log('login success', res) // {code: "e4a13af4e6d8c491b701a86682a5bc76NW"}
    //         console.log("=======changliang", res.code, res.code.length);
    //         swan.request({
    //             url: 'https://spapi.baidu.com/oauth/jscode2sessionkey',
    //             method: 'POST',
    //             header: {
    //                 'content-type': 'application/x-www-form-urlencoded',
    //             },
    //             data: {
    //                 code: res.code,
    //                 client_id: '6l0C1C7e0ElfMTSARjGTQr9vjGpW1TKd',
    //                 sk: '0SNItTXoKgQtz3bdPmDm6gX94BGBiuQD'
    //             },
    //             success: resp => {
    //                 console.log('getSessionKey success', res);
    //                 if (resp.statusCode === 200) {
    //                     console.log("=======changliang", resp);
    //                     console.log("==========changliang", resp.data.session_key, resp.data.session_key.length)
    //                     console.log("==========changliang", resp.data.openid, resp.data.openid.length);
    //                 }
    //             }
    //         });
    //     },
    //     fail: err => {
    //         console.log('login fail', err);
    //     }
    // });

    // swan.getSystemInfo({
    //   complete: res => {
    //     console.log("=================== ", res.system);
    //     console.log("=================== ", res.platform);
    //   }
    // });

    // swan.getSwanId({
    //     success: res => {
    //         // alert(res.data.swanid);
    //         swan.showToast({
    //                 title: res.data.swanid
    //         });
    //     },
    //     fail: err => {
    //         alert("=========changliang err", err);
    //     }
    // });
  },

  onHide() {
    console.log('app hide');
    // wx.closeSocket({
    //   url: 'ws://localhost:8080'
    // });
    // console.log('App onHide this:', this);
    // var options = {
    //   success: function (info) {
    //   },
    //   fail: function (/* code */) {
    //   },
    //   complete(res) {
    //     wx.setStorageSync('hidecb', '1');
    //   }
    // };

    // wx.getNetworkType(options);


    // wx.setStorageSync('hide', '1');
  },

  onError() /* msg */{
    console.log('onError');
    swan.showToast({
      title: 'onError',
      content: ''
    });
  },
  globalData: {
    uma: uma,
    userInfo: null
  }
});