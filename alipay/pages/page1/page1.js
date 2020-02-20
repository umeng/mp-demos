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
  trackEvent() {
    const eventId = 'event1';
    const properties = { 'test': 'auth' };
    my.uma.trackEvent(eventId, properties);
  }
});
