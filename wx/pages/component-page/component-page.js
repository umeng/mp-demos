// pages/component-page/component-page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function(options) {
      console.log('componentPage-onShow: ', options, this);
    },
    onHide: function(options) {
      console.log('componentPage-onHide: ', options, this);
    },
    onUnload: function(options) {
      console.log('componentPage-onUnload: ', options, this);
    },
    onShareAppMessage: function (res) {
      console.log('componentPage-onShareAppMessage: ', this);

      return {
        title: '自定义转发标题',
        path: 'pages/index/index?um_test=1111111111'
      }
    },
  }
})
