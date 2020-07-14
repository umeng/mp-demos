// pages/component-page/component-page.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
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
  },
  onShareAppMessage: function (res) {
    console.log('componentPage-onShareAppMessage: ', this);

    return {
      title: '自定义转发标题',
      path: 'pages/index/index?um_test=1111111111'
    }
  },
})