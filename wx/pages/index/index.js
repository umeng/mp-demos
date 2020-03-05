//index.js
//获取应用实例
// import cache from '../../src/core/cache.js';
// import udevice from '../../src/common/udevice.js';

Page({
  data: {
    motto: 'Hello World'
  },

  onLoad: function () {
  },

  onShow: function() {
  },

  onHide() {
  },

  onUnload() {
  },

  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: 'pages/index/index?test=1111111111'
    }
  },

  gotoPage1: function() {
    wx.navigateTo({
      url: "../page1/page1"
    });
  },

  trackEvent: function(){
    wx.uma.trackEvent("111");
  }
})
