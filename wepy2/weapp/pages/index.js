"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(1));

var _eventHub = _interopRequireDefault(require('./../common/eventHub.js'));

var _test = _interopRequireDefault(require('./../mixins/test.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].page({
  config: {
    navigationBarTitleText: 'test'
  },
  hooks: {
    // Page 级别 hook, 只对当前 Page 的 setData 生效。
    'before-setData': function beforeSetData(dirty) {
      if (Math.random() < 0.2) {
        console.log('setData canceled');
        return false; // Cancel setData
      }

      dirty.time = +new Date();
      return dirty;
    }
  },
  data: {},
  computed: {
    testcomputed: function testcomputed() {
      return 'computed - ' + this.mynum;
    }
  },
  methods: {
    trackEvent: function trackEvent() {
      console.log('sssss');
      console.log(this.$app.$options.globalData.uma.trackEvent('buy', {
        name: 'car'
      }));
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: '欢迎体验wepy2',
      path: '/pages/index/index'
    };
  },
  created: function created() {
    var self = this;
    self.currentTime = +new Date();
    self.setTimeoutTitle = '标题三秒后会被修改';
    setTimeout(function () {
      self.setTimeoutTitle = '到三秒了';
    }, 3000);
    wx.getUserInfo({
      success: function success(res) {
        self.userInfo = res.userInfo;
      }
    });
  }
}, {info: {"components":{"list":{"path":"./../components/wepy-list"},"group":{"path":"./../components/group"},"panel":{"path":"./../components/panel"},"counter":{"path":"./../components/counter"},"slide-view":{"path":"./../$vendor/miniprogram-slide-view/miniprogram_dist/index"}},"on":{}}, handlers: {'6-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.trackEvent($event);
      })();
    
  }}}, models: {}, refs: undefined });