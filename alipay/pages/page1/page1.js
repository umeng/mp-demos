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
  my.getOpenUserInfo({
    fail: (res) => {
      console.log(res)
    },
    success: (res) => {
      let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
      console.log(userInfo)
    }
  });
},
  trackEvent() {
    const eventId = 'event1';
    const properties = { 'test': 'auth' };
    my.uma.trackEvent(eventId, properties);
  }
});
