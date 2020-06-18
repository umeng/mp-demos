var uma = require('./lib/uma.min');

// const $$Rangers = require('./lib/ranger');
// $$Rangers.init({app_id:184310, auto_report:true, log: true}); 

// $$Rangers.send(); 
// let globalAnonymousCode = null;


App({
  umengConfig: {
    appKey: '5ee6f03fcedf3c0749c05a30', //是否需要重新分配?   5dfa09d2c1d04b48c99109a6
    // useOpenId: true,
    autoGetOpenid: true,
    debug: true,
    uploadUserInfo: true
  },

  onLaunch: function (options) {
    // this.$$Rangers = $$Rangers;  
  },

  onShow: function(options) {
    // tt.uma.setAnonymousid('ttTestAnonymousid');
    //  tt.getSystemInfo({
    //   complete: (res) => {
    //     console.log("=================== ", res.system);
    //     console.log("=================== ", res.platform);
    //   },
    // })

    // tt.checkSession({
    //   success() {
    //     tt.request({
    //       url: 'https://developer.toutiao.com/api/apps/jscode2session', // 目标服务器url
    //       data: {
    //         appid: "ttb035c6882f1055a3",
    //         secret: "18a080051728dc11516151b27c578fc6a139522d",
    //         anonymous_code: globalAnonymousCode,
    //       },
    //       success: (res) => {
    //         console.log('session 未过期，', res)
    //       }
    //     });
    //   },
    //   fail() {
    //     console.log(`session 已过期， 需要重新登录`)
        // tt.login({
        //   force: false,
        //   success (res) {
        //     console.log(`login调用成功${res.code} ${res.anonymousCode}`);
        //     console.log(res);
        //     // globalAnonymousCode = res.anonymousCode;
        //     tt.request({
        //       url: 'https://developer.toutiao.com/api/apps/jscode2session', // 目标服务器url
        //       data: {
        //         appid: "ttd710a1ad482af1e6", // ttd710a1ad482af1e6 ttb4cdc2702bf79291
        //         secret: "c42c0282484320585659f270cd0856399e58b74d",   //da0d9c2696677a928f0c1d8cd15b0fa9403a2f26
        //         anonymous_code: res.anonymousCode, //51cb1249d3f76491 61ae50a864206e2e
        //         code: res.code || '',
        //       },
        //       success: (res) => {
        //         console.log("changliang===", res);
        //         // console.log("ttb035c6882f1055a3", "ttb035c6882f1055a3".length);
        //         // console.log(res.data.openid, res.data.openid.length);
        //         // console.log(res.data.session_key, res.data.session_key.length);
        //         // console.log(res.data.anonymous_openid, res.data.anonymous_openid.length);
        //       }
        //     });
        //   },
        //   fail (res) {
        //     console.log(`login调用失败`, res);
        //   }
        // });
    //   }
    // });

    //c42c0282484320585659f270cd0856399e58b74d 钰昭test

    //da0d9c2696677a928f0c1d8cd15b0fa9403a2f26
    
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
