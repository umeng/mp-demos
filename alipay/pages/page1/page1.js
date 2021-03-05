Page({
  data: {},
  onLoad(option) {
  },
  onReady() {
    // 页面加载完成
  },
  onShow(e) {
  },
  onHide() {
  },
  onUnload() {
  },
  onShareAppMessage(e) {
    return {
      title: '分享 View 组件',
      desc: 'View 组件很通用',
      path: 'pages/page1/page1',
    };
  },
  gotoPage2() {
    my.navigateTo({
      url: '../page2/page2'
    })
  },
  noop2() {
  console.log('noop')
  var callback = function(){}
  my.getSetting({
    success: function (res) {
      console.log('setting: ', res);

      if (res && res.authSetting && res.authSetting.userInfo) {
        my.getOpenUserInfo({
          fail: (res) => {
            console.log(res)
          },
          success: (res) => {
            let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
            console.log(userInfo)
          }
        });
      } else {
        callback && callback();
      }
    },
  fail: function (e) {
      console.log(e)
      callback && callback(); 
  }
})
},
  trackEvent() {
    const eventId = 'event1';
    const properties = { 'test': 'auth' };
    my.uma.trackEvent(eventId, properties);
  }
});
