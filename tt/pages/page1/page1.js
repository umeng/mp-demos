// pages/page1/page1.js
const util = require('../../util/util');
const app = getApp();

Page({
  data: {
    logs: []
  },

  gotoIndexPage: function() {
    tt.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  gotoLog: function() {
    tt.navigateTo({
      url: "../logs/logs"
    });
  },

  onLoad: function (options) {

  },

  onShow: function() {
    // tt.uma.trackPageStart('page1');
    // console.log(2222, getCurrentPages());
  },

  onHide: function() {
    // app.globalData.uma.trackPageEnd('page1');
  },

  onUnload: function() {
    // app.globalData.uma.trackPageEnd('page1');
  },

  trackEvent: function() {
    // console.log(app.globalData.uma);
    tt.uma.trackEvent("page1_event_0",{});
    tt.uma.trackEvent("page1_event_1",{});
    tt.uma.trackEvent("page1_event_2",{});
    tt.uma.trackEvent("page1_event_3",{});
    tt.uma.trackEvent("page1_event_4",{});
  }
})