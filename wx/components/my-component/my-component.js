// components/my-component/my-component.js
// var oldComponent = Component;

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
    onShow: function (options) {
      console.log('myComponent-onShow: ', options);
    },
    onHide: function (options) {
      console.log('myComponent-onHide: ', options);
    },
    onUnload: function (options) {
      console.log('myComponent-onUnload: ', options);
    }
  }
})
