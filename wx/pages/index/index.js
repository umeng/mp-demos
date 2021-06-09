//index.js
//获取应用实例
// import cache from '../../src/core/cache.js';
// import udevice from '../../src/common/udevice.js';

Page({
  data: {
    motto: 'Hello World'
  },

  onLoad: function () {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.uma.setUserInfo(res.userInfo)
      }
    })
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
  bindGetUserInfo:function(){
    
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.uma.setUserInfo(res.userInfo)
      }
    })
  },
  trackEvent: function(){
    wx.uma.trackEvent("111");
  }
})
