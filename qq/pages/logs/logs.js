//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },

  gotoPage1: function() {
    qq.navigateTo({
      url: "../page1/index"
    });
    // console.log('gotoPage1');
  },

  gotoIndexPage: function() {
    qq.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  onLoad: function (options) {
    console.log('onLoad---options', options);
  },

  onShow: function(options) {
    console.log('options', options);
    // app.globalData.uma.trackPageStart('log');
  },

  onHide: function() {
    // app.globalData.uma.trackPageEnd('log');
  },

  onUnload: function() {
    // app.globalData.uma.trackPageEnd('log');
  },

  trackEvent: function() {
    qq.uma.trackEvent("logs_event_0");
  },

  choose: function () {
    qq.uma.trackEvent('选择商品', {
      category: '手机' 
    })
  },

  view: function () {
    console.log('view...');
    qq.uma.trackEvent('查看商品', {
      brand: 'iPhone'
    })
  },

  add: function () {
    qq.uma.trackEvent('加入购物车', {
      model: 'iPhone X',
      color: 'black',
      size: '256'
    })
  },

  buy: function () {
    qq.uma.trackEvent('下单', {
      user: 'whiteside',
      address: 'beijing',
      phone: '13888888888'
    })
  },

  pay: function () {
    qq.uma.trackEvent('付款', {
      amount: '1999'
    })
  },

})
