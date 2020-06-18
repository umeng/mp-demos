// pages/logs/logs.js
const util = require('../../util/util');
const app = getApp();

Page({
  data: {
    logs: []
  },
  onLoad: function (options) {
    console.log('Logs Page onLoad---options', options);  
  },

  onShow: function(options) {
    console.log('Logs Page onShow---options', options);
    // app.globalData.uma.trackPageStart('log');
  },

  onHide: function(options) {
    // app.globalData.uma.trackPageEnd('log');
  },

  onUnload: function(options) {
    // app.globalData.uma.trackPageEnd('log');
  },

  gotoPage1: function() {
    tt.navigateTo({
      url: "../page1/page1"
    });
    // console.log('gotoPage1');
  },

  gotoIndexPage: function() {
    tt.navigateTo({
      url: "../index/index"
    });
    // console.log('gotoPage1');
  },

  trackEvent: function(options) {
    tt.uma.trackEvent("logs_event_0");
  },

  choose: function () {
    tt.uma.trackEvent('选择商品', {
      category: '手机' 
    })
  },

  view: function () {
    tt.uma.trackEvent('查看商品', {
      brand: 'iPhone'
    })
  },

  add: function () {
    tt.uma.trackEvent('加入购物车', {
      model: 'iPhone X',
      color: 'black',
      size: '256'
    })
  },

  buy: function () {
    tt.uma.trackEvent('下单', {
      user: 'whiteside',
      address: 'beijing',
      phone: '13888888888'
    })
  },

  pay: function () {
    tt.uma.trackEvent('付款', {
      amount: '1999'
    })
  },
})