// components/my-component/my-component.js
Component({
   // 组件的属性列表
    properties: {

    },

    data: {

    },
    
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
    },


})