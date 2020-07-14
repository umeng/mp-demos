//logs.js
const app = getApp();

Page({
  data: {
    logs: []
  },

  gotoIndexPage: function () {
    swan.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  gotoLog: function () {
    swan.navigateTo({
      url: "../logs/logs"
    });
  },

  gotoRc: function () {
    swan.navigateTo({
      url: '../rc-page/rc-page'
    });
  },

  onLoad: function () {},

  onShow: function () {
    // app.globalData.uma.trackPageStart('page1');
  },

  onHide: function () {
    // app.globalData.uma.trackPageEnd('page1');
  },

  onUnload: function () {
    // app.globalData.uma.trackPageEnd('page1');
  },

  trackEvent: function () {
    console.log(22222, app.globalData.uma);
    swan.uma.trackEvent("page1_event_0", {});
    swan.uma.trackEvent("page1_event_1", {});
    swan.uma.trackEvent("page1_event_2", {});
    swan.uma.trackEvent("page1_event_3", {});
    swan.uma.trackEvent("page1_event_4", {});
  }
});