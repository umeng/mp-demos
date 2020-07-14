// pages/rc-page/rc-page.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  clearCache: function() {
    qq.uma.rc.clearCache();
  },

  fetch: function() {
    console.log(qq.uma.rc);
    qq.uma.rc.fetch({
      active: true,
    });
  },

  active: function() {
    console.log('click active');
    qq.uma.rc.active()
  },

  getValue: function() {
    console.log(22222, qq.uma.rc.getValue('home_color'));
  },
})