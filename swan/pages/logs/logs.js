//logs.js
const app = getApp();

Page({
  data: {
    logs: []
  },
  gotoPage1: function () {
    swan.navigateTo({
      url: "../page1/index"
    });
    // console.log('gotoPage1');
  },

  gotoIndexPage: function () {
    swan.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  onLoad: function (options) {
    console.log('onLoad---options', options);
  },

  onShow: function (options) {
    console.log('options', options);
    // app.globalData.uma.trackPageStart('log');
  },

  onHide: function () {
    // app.globalData.uma.trackPageEnd('log');
  },

  onUnload: function () {
    // app.globalData.uma.trackPageEnd('log');
  },

  trackEvent: function () {
    swan.uma.trackEvent("logs_event_0");
  },

  choose: function () {
    swan.uma.trackEvent('选择商品', {
      category: '手机'
    });
  },

  view: function () {
    swan.uma.trackEvent('查看商品', {
      brand: 'iPhone'
    });
  },

  add: function () {
    swan.uma.trackEvent('加入购物车', {
      model: 'iPhone X',
      color: 'black',
      size: '256'
    });
  },

  buy: function () {
    swan.uma.trackEvent('下单', {
      user: 'whiteside',
      address: 'beijing',
      phone: '13888888888'
    });
  },

  pay: function () {
    swan.uma.trackEvent('付款', {
      amount: '1999'
    });
  }
});