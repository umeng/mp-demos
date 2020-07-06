// pages/rc-page/rc-page.js
Page({

  /**
   * Page initial data
   */
  data: {},

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {},

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},

  clearCache: function () {
    swan.uma.rc.clearCache();
  },

  fetch: function () {
    console.log(swan.uma.rc);
    swan.uma.rc.fetch({
      active: true
    });
  },

  active: function () {
    console.log('click active');
    swan.uma.rc.active();
  },

  getValue: function () {
    console.log(22222, swan.uma.rc.getValue('home_color'));
  }
});