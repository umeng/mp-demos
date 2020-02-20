var __CML__GLOBAL = require("../../../../manifest.js");
__CML__GLOBAL.webpackJsonp([3],{

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"/usr/local/lib/node_modules/chameleon-tool/chameleon.js\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=script&index=0&fileType=component&media=dev&cmlType=alipay&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__("./node_modules/chameleon-api/src/interfaces/createInnerAudioContext/index.js");

var _index2 = _interopRequireDefault(_index);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chameleonRuntime = __webpack_require__("./node_modules/chameleon-runtime/index.js");

var _chameleonRuntime2 = _interopRequireDefault(_chameleonRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-ui-builtin/components/audio/audio.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = [];
var __INTERFAE__DEFINES__ = {
  "types": {
    "TimeUpdateDetail": {
      "currentTime": "Number",
      "duration": "Number"
    }
  },
  "interfaces": {
    "CAudioInterface": {
      "id": "String",
      "src": "String",
      "loop": "Boolean",
      "controls": "Boolean",
      "poster": "String",
      "name": "String",
      "author": "String",
      "autoplay": "Boolean",
      "initAudio": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "setCurrentTime": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "handlePause": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "hanleEnded": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "hanleTimeUpdate": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "pause": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "play": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "ended": {
        "input": ["Void"],
        "output": "Undefined"
      },
      "timeupdate": {
        "input": ["TimeUpdateDetail"],
        "output": "Undefined"
      },
      "error": {
        "input": ["CMLObject"],
        "output": "Undefined"
      },
      "handleError": {
        "input": ["CMLObject"],
        "output": "Undefined"
      }
    }
  },
  "classes": {}
};
var __CML__DEFINES__ = {
  "types": {},
  "interfaces": {},
  "classes": {
    "CAudio": ["CAudioInterface"]
  }
};
var __CML__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/runtime/check.js");

var CAudio = function () {
  function CAudio() {
    _classCallCheck(this, CAudio);

    this.props = {
      id: {
        type: String,
        default: ""
      },
      src: {
        //audio的要播放的音频资源地址
        type: String,
        default: ''
      },
      loop: {
        //是否循环播放
        type: Boolean,
        default: false
      },
      controls: {
        //是否默认显示控件
        type: Boolean,
        default: false
      },
      poster: {
        //默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效
        type: String,
        default: ""
      },
      name: {
        //默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效	
        type: String,
        default: '未知音频'
      },
      author: {
        //默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效	
        type: String,
        default: '未知作者'
      },
      autoplay: {
        type: Boolean,
        default: false
      }
    };
    this.data = {
      currentTime: '00:00',
      audioStatus: false,
      //默认不是暂停状态
      audioContext: {}
    };
    this.watch = {};
    this.methods = {
      initAudio: function initAudio() {
        var _this = this;

        this.audioContext = (0, _index2.default)();
        this.audioStatus = this.autoplay; //如果默认自动播放 true，那么 audioStatus 为 true;

        this.audioContext.src = this.src; //初始化音频资源地址

        this.audioContext.autoplay = this.autoplay; //是否自动播放

        if (this.autoplay) {
          this.$cmlEmit('play'); //自动播放的情况下 emit play
        }

        this.audioContext.loop = this.loop;
        this.audioContext.onEnded(function () {
          //loop情况下不会触发ended这个方法
          _this.hanleEnded();
        });
        this.audioContext.onTimeUpdate(function () {
          _this.hanleTimeUpdate();
        });
        this.audioContext.onError(function (res) {
          var detail = {
            errMsg: res.errCode || -1
          };
          _this.handleError({
            detail: detail
          });
        });
      },
      handleError: function handleError(e) {
        this.$cmlEmit('error', e.detail);
      },
      hanleTimeUpdate: function hanleTimeUpdate() {
        this.$cmlEmit('timeupdate', {
          currentTime: this.audioContext.currentTime,
          duration: this.audioContext.duration
        });
        this.setCurrentTime();
      },
      hanleEnded: function hanleEnded() {
        this.audioStatus = false; //如果不是loop的情况下，会触发这个ended方法，需要再次emit pause

        this.$cmlEmit('pause');
        this.$cmlEmit('ended');
      },
      setCurrentTime: function setCurrentTime() {
        var val = this.audioContext.currentTime;

        if (!val) {
          this.currentTime = "00:00";
        } else {
          var min = parseInt(val / 60);

          if (min < 10) {
            min = "0" + min;
          }

          var second = parseInt(val % 60);

          if (second < 10) {
            second = "0" + second;
          }

          this.currentTime = min + ":" + second;
        }
      },
      handlePlay: function handlePlay() {
        this.audioContext.play();
        this.audioStatus = !this.audioStatus;
        this.$cmlEmit('play');
      },
      handlePause: function handlePause() {
        this.audioContext.pause();
        this.audioStatus = !this.audioStatus;
        this.$cmlEmit('pause');
      },
      switchPlay: function switchPlay() {
        if (this.audioStatus) {
          //正在播放状态
          this.handlePause();
        } else {
          //暂停状态
          this.handlePlay();
        }
      }
    };
  }

  _createClass(CAudio, [{
    key: "mounted",
    value: function mounted() {
      var _this2 = this;

      Promise.resolve().then(function () {
        _this2.initAudio();
      });
    }
  }, {
    key: "beforeDestroy",
    value: function beforeDestroy() {
      this.audioContext.destroy();
    }
  }]);

  return CAudio;
}();

exports.default = __CML__WRAPPER__(new CAudio(), __CML_ERROR__, __enableTypes__, __INTERFAE__DEFINES__, __CML__DEFINES__);


module.exports = function () {
  _chameleonRuntime2.default.createComponent(exports.default).getOptions();
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"alipay\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"/usr/local/lib/node_modules/chameleon-tool/configs/postcss/alipay/.postcssrc.js\"}}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"alipay\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=styles&index=0&fileType=component&media=dev&cmlType=alipay&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/createInnerAudioContext/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-api/src/interfaces/createInnerAudioContext/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {
    "callback": {
      "input": ["CMLObject"],
      "output": "Undefined"
    }
  },
  "interfaces": {
    "AudioInterfaceInterface": {
      "createInnerAudioContext": {
        "input": [],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["AudioInterfaceInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "createInnerAudioContext",
    value: function createInnerAudioContext() {
      return my.createInnerAudioContext();
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/createInnerAudioContext/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInnerAudioContext;

var _index = __webpack_require__("./node_modules/chameleon-api/src/interfaces/createInnerAudioContext/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInnerAudioContext() {
  return _index2.default.createInnerAudioContext();
}

/***/ }),

/***/ "./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml":
/***/ (function(module, exports, __webpack_require__) {

var __cml__style0 = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"alipay\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"/usr/local/lib/node_modules/chameleon-tool/configs/postcss/alipay/.postcssrc.js\"}}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"alipay\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=styles&index=0&fileType=component&media=dev&cmlType=alipay&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml");
var __cml__script = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"/usr/local/lib/node_modules/chameleon-tool/chameleon.js\"}!../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=script&index=0&fileType=component&media=dev&cmlType=alipay&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml");

      __CML__GLOBAL.__CMLCOMPONNETS__['npm/chameleon-ui-builtin/components/audio/audio'] = __cml__script;


/***/ })

},["./node_modules/chameleon-ui-builtin/components/audio/audio.alipay.cml"])
module.exports = __CML__GLOBAL.__CMLCOMPONNETS__['npm/chameleon-ui-builtin/components/audio/audio'];