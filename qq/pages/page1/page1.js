//logs.js
const app = getApp();

Page({
  data: {
    logs: []
  },

  gotoIndexPage: function() {
    qq.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  gotoLog: function() {
    qq.navigateTo({
      url: "../logs/logs"
    });
  },

  gotoRc: function() {
    qq.navigateTo({
      url: '../rc-page/rc-page',
    });
  },

  onLoad: function () {
    
  },

  onShow: function() {
    // app.globalData.uma.trackPageStart('page1');
  },

  onHide: function() {
    // app.globalData.uma.trackPageEnd('page1');
  },

  onUnload: function() {
    // app.globalData.uma.trackPageEnd('page1');
  },

  trackEvent: function() {
    console.log(22222, app.globalData.uma);
    qq.uma.trackEvent("page1_event_0", {});
    qq.uma.trackEvent("page1_event_1", {});
    qq.uma.trackEvent("page1_event_2", {});
    qq.uma.trackEvent("page1_event_3", {});
    qq.uma.trackEvent("page1_event_4", {});
  }
})
