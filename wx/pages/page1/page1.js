//logs.js
const util = require('../../util/util.js')
const app = getApp();

Page({
  data: {
    logs: []
  },

  gotoIndexPage: function() {
    wx.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  gotoLog: function() {
    wx.navigateTo({
      url: "../logs/logs"
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
    app.globalData.uma.trackEvent("page1_event_0");
    app.globalData.uma.trackEvent("page1_event_1");
    app.globalData.uma.trackEvent("page1_event_2");
    app.globalData.uma.trackEvent("page1_event_3");
    app.globalData.uma.trackEvent("page1_event_4");
  }
})
