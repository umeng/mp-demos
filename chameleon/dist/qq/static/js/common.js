var __CML__GLOBAL = require("./manifest.js");
__CML__GLOBAL.webpackJsonp([0],{

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/babel-runtime/regenerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/regenerator-runtime/runtime-module.js");


/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/handler/lines.js":
/***/ (function(module, exports) {

// 静态编译和运行时 web和小程序端对lines属性特殊处理

module.exports = function (linesNumber) {
  // 作为一个属性注意最后不能添加分号
  return "display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: " + linesNumber + "; overflow: hidden";
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/proxy/proxyMiniapp.js":
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/utils.js");
var lines = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/handler/lines.js");
// 运行时的cpx2rpx不能使用postcss处理，因为$cmlStyle方法用到了该方法，在运行时使用postcss 会出现Cannot find module "fs"的错误
module.exports = function (content) {
  content = utils.disappearCssComment(content);
  return parse(content);
  function parse(style) {
    return style.split(';').filter(function (declaration) {
      return !!declaration.trim();
    }).map(function (declaration) {
      var _utils$getStyleKeyVal = utils.getStyleKeyValue(declaration),
          key = _utils$getStyleKeyVal.key,
          value = _utils$getStyleKeyVal.value;

      return {
        property: key,
        value: value
      };
    }).map(function (declaration) {
      if (declaration.property === 'lines') {
        return lines(declaration.value);
      }
      declaration.value = handle(declaration.value);
      return declaration.property + ':' + declaration.value;
    }).join(';');
  }

  function handle(content) {
    if (content && content.replace) {
      content = content.replace(/(\d*\.?\d+)cpx/ig, function (m, $1) {
        return $1 + 'rpx';
      });
    }
    return content;
  }
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/utils.js":
/***/ (function(module, exports) {

var _ = {};
module.exports = _;
// 将字符串中的 单引号变成 双引号；
_.singlequot2doublequot = function (value) {
  return value.replace(/['']/g, '"');
};
// 用于将css样式值中的重复样式去掉
_.uniqueStyle = function (content) {
  var uniqueStyleKeyValue = {};
  var splitStyleKeyValue = content.split(';').filter(function (item) {
    return !!item.trim();
  });
  splitStyleKeyValue.forEach(function (declaration) {
    var _$getStyleKeyValue = _.getStyleKeyValue(declaration),
        key = _$getStyleKeyValue.key,
        value = _$getStyleKeyValue.value;

    if (!key || !value) {
      throw new Error('please check if the style that you write is correct');
    }
    uniqueStyleKeyValue[key] = value;
  });

  var result = [];
  Object.keys(uniqueStyleKeyValue).forEach(function (key) {
    result.push(key + ':' + uniqueStyleKeyValue[key]);
  });
  return result.join(';');
};
// 用于删除css样式的注释； /*width:100px;*/ ==> ''
_.disappearCssComment = function (content) {
  var commentReg = /\/\*[\s\S]*?\*\//g;
  return content.replace(commentReg, function (match) {
    return '';
  });
};
_.getStyleKeyValue = function (declaration) {
  var colonIndex = declaration.indexOf(':');
  var key = declaration.slice(0, colonIndex).trim();
  var value = declaration.slice(colonIndex + 1).trim();
  return {
    key: key, value: value
  };
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-loader/src/runtime/check.js":
/***/ (function(module, exports) {


/* istanbul ignore next */
module.exports = function (obj, __CML_ERROR__, __enableTypes__, __INTERFAE__DEFINES__, __CML__DEFINES__) {
  var className = obj.constructor.name;
  var interfaceDefines = __INTERFAE__DEFINES__;
  var enableTypes = __enableTypes__; // ['Object','Array','Nullable']
  var types = interfaceDefines.types;
  var interfaceKey = Object.keys(interfaceDefines.interfaces)[0]; // interface Name
  var interfaceObj = interfaceDefines.interfaces[interfaceKey];
  var cmlDefines = __CML__DEFINES__;
  var isImplementInterface = false;
  // 找到class
  if (cmlDefines.classes[className]) {
    // class 的interface数组中有interface中的定义
    if (~cmlDefines.classes[className].indexOf(interfaceKey)) {
      isImplementInterface = true;
    } else {
      console.error('class ' + className + ' not implements interface ' + interfaceKey);
    }
  }

  var props = [];
  var events = {};

  Object.keys(interfaceObj).forEach(function (key) {
    var item = interfaceObj[key];
    if (is(item, 'Object')) {
      // 是事件  有output和input
      events[key] = item;
    } else {
      // 是属性
      props.push({
        key: key,
        value: item
      });
    }
  });

  // created 时做props校验  同时建立watch属性检测props类型
  // 包装this.$cmlEmit 校验自定义事件参数类型
  function isFunc(target) {
    return target && is(target, 'Function');
  }

  function is(source, type) {
    return Object.prototype.toString.call(source) === '[object ' + type + ']';
  }

  var getType = function getType(value) {
    var type = Object.prototype.toString.call(value);
    return type.replace(/\[object\s(.*)\]/g, '$1').replace(/( |^)[a-z]/g, function (L) {
      return L.toUpperCase();
    });
  };

  // beforeCreate时 vue中还获取不到mixins的this.$cmlEmit方法
  var oldCreated = obj.created || function () {};
  obj.created = function () {
    checkProps.call(this);
    oldCreated.call(this);
  };

  obj.methods = obj.methods || {};

  obj.methods.$__checkCmlEmit__ = function (eventName, eventDetail) {
    if (events[eventName]) {
      var input = events[eventName].input;

      var detailType = input[0];
      var _errList = checkType(eventDetail, detailType, []);
      if (_errList && _errList.length) {
        __CML_ERROR__('errorinfo: event ' + eventName + ' detail verification fails\n           ' + _errList.join('\n') + '\n         ');
      }
    } else {
      __CML_ERROR__('errorinfo:  event ' + eventName + ' is not defined in interface\n           ' + errList.join('\n') + '\n         ');
    }
  };

  function checkProps() {
    var _this = this;

    props.forEach(function (item) {
      var errList = checkType(_this[item.key], item.value, []);
      if (errList && errList.length) {
        __CML_ERROR__('error: prop [' + item.key + '] verification fails\n         ' + errList.join('\n') + '\n       ');
      }
    });
  }

  obj.watch = obj.watch || {};

  props.forEach(function (item) {
    var oldWatch = obj.watch[item.key];
    obj.watch[item.key] = function (newVal, oldVal) {
      var errList = checkType(newVal, item.value, []);
      if (errList && errList.length) {
        __CML_ERROR__('errorinfo: prop [' + item.key + '] verification fails\n           ' + errList.join('\n') + '\n         ');
      }
      if (isFunc(oldWatch)) {
        oldWatch.call(this, newVal, oldVal);
      }
    };
  });

  /**
   * 校验类型  两个loader共用代码
   *
   * @param  {*}      value 实际传入的值
   * @param  {string} type  静态分析时候得到的值得类型
   * @param  {array[string]} errList 校验错误信息  类型
   * @return {bool}         校验结果
   */
  var checkType = function checkType(value, originType) {
    var errList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var isNullableReg = /_cml_nullable_lmc_/g;
    var type = originType.replace('_cml_nullable_lmc_', '');
    type === "Void" && (type = "Undefined");
    var currentType = getType(value); // Undefined Null Object Array Number String  Function只可能是这几种类型；
    // 但是对于type的值则可能是 Undefined Null Number String NullUndefinedStiring
    // Object Array Function EventDetail(...这种自定义的复杂数据类型) 这几种；
    // 判断nullable类型的参数
    // 如果 currentType === type 那么就会直接返回 [];
    var canUseNullable = enableTypes.includes("Nullable");
    var canUseObject = enableTypes.includes("Object");
    var canUseArray = enableTypes.includes("Array");
    if (currentType == 'Null') {
      // 如果传入的值是 null类型，那么可能的情况是该值在接口处的被定义为Null或者是 ?string 这种可选参数的形式；
      if (type == "Null") {
        // 如果定义的参数的值就是 Null，那么校验通过
        errList = [];
      } else {
        // 实际定义的参数的值不是 Null  ?string这种形式的定义，type = new String('String') ?Callback type = new String('Callback')
        // 那么判断是否是可选参数的情况
        canUseNullable && isNullableReg.test(originType) ? errList = [] : errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542Fnullable\u914D\u7F6E');
      }
      return errList;
    }
    if (currentType == 'Undefined') {
      // 如果运行时传入的真实值是undefined,那么可能改值在接口处就是被定义为 Undefined类型或者是 ?string 这种可选参数 nullable的情况；
      if (type == "Undefined") {
        errList = [];
      } else {
        canUseNullable && isNullableReg.test(originType) ? errList = [] : errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542Fnullable\u914D\u7F6E\u6216\u8005\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'String') {
      if (type == 'String') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Boolean') {
      if (type == 'Boolean') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Number') {
      if (type == 'Number') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Object') {
      if (type == 'Object') {
        !canUseObject ? errList.push('\u4E0D\u80FD\u76F4\u63A5\u5B9A\u4E49\u7C7B\u578B' + type + '\uFF0C\u9700\u8981\u4F7F\u7528\u7B26\u5408\u7C7B\u578B\u5B9A\u4E49\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542F\u4E86\u53EF\u4EE5\u76F4\u63A5\u5B9A\u4E49 Object \u7C7B\u578B\u53C2\u6570\uFF1B') : errList = [];
      } else if (type == 'CMLObject') {
        errList = [];
      } else {
        // 这种情况的对象就是自定义的对象；
        if (types[type]) {
          var keys = Object.keys(types[type]);
          // todo 这里是同样的问题，可能多传递
          keys.forEach(function (key) {
            var subError = checkType(value[key], types[type][key], []);
            if (subError && subError.length) {
              errList = errList.concat(subError);
            }
          });
          if (Object.keys(value).length > keys.length) {
            errList.push('type [' + type + '] \u53C2\u6570\u4E2A\u6570\u4E0E\u5B9A\u4E49\u4E0D\u7B26');
          }
        } else {
          errList.push('找不到定义的type [' + type + ']!');
        }
      }
      return errList;
    }
    if (currentType == 'Array') {
      if (type == 'Array') {
        !canUseObject ? errList.push('\u4E0D\u80FD\u76F4\u63A5\u5B9A\u4E49\u7C7B\u578B' + type + '\uFF0C\u9700\u8981\u4F7F\u7528\u7B26\u5408\u7C7B\u578B\u5B9A\u4E49\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542F\u4E86\u53EF\u4EE5\u76F4\u63A5\u5B9A\u4E49 Array \u7C7B\u578B\u53C2\u6570\uFF1B') : errList = [];
      } else {
        if (types[type]) {
          // 数组元素的类型
          var itemType = types[type][0];
          for (var i = 0; i < value.length; i++) {
            var subError = checkType(value[i], itemType, []);
            if (subError && subError.length) {
              errList = errList.concat(subError);
            }
          }
        } else {
          errList.push('找不到定义的type [' + type + ']!');
        }
      }

      return errList;
    }
    if (currentType == 'Function') {
      if (types[type]) {
        if (!types[type].input && !types[type].output) {
          errList.push('\u627E\u4E0D\u5230' + types[type] + ' \u51FD\u6570\u5B9A\u4E49\u7684\u8F93\u5165\u8F93\u51FA');
        }
      } else {
        errList.push('找不到定义的type [' + type + ']!');
      }
    }
    if (currentType == 'Promise') {
      if (type == 'Promise') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Date') {
      if (type == 'Date') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'RegExp') {
      if (type == 'RegExp') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }

    return errList;
  };

  return obj;
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/common.js":
/***/ (function(module, exports, __webpack_require__) {


var _ = module.exports = {};
var utils = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/utils.js");
_.eventProxyName = '_cmlEventProxy';
_.modelEventProxyName = '_cmlModelEventProxy'; // c-model  v-model的事件代理
_.inlineStatementEventProxy = '_cmlInline'; // 内联语句的事件代理
_.eventEmitName = '$cmlEmit'; // 触发事件的方法
_.styleParseName = '$cmlStyle'; // 提供各端处理style属性的方法  weex中处理成对象，wx中处理成字符串，web中不处理
_.styleProxyName = '_cmlStyleProxy'; // 提供代理 weex和web端处理style
_.mergeStyleName = '$cmlMergeStyle';
_.animationProxy = '_animationCb';
_.weexClassProxy = '_weexClassProxy';
_.merge = function (target, fromObj) {
  Object.keys(fromObj).forEach(function (key) {
    target[key] = fromObj[key];
  });
};

_.isType = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1) === type;
};

_.mergeStyle = function () {
  // 可以接受字符串或者对象
  function styleToObj(str) {
    var obj = {};
    str.split(';').filter(function (item) {
      return !!item.trim();
    }).forEach(function (item) {
      var _utils$getStyleKeyVal = utils.getStyleKeyValue(item),
          key = _utils$getStyleKeyVal.key,
          value = _utils$getStyleKeyVal.value;

      key = key.replace(/\s+/, '');
      value = value.replace(/\s+/, '');
      obj[key] = value;
    });
    return obj;
  }
  var arr = [];

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.forEach(function (arg) {
    if (typeof arg === 'string') {
      arr.push(styleToObj(arg));
    } else if (Object.prototype.toString.call(arg) === '[object Object]') {
      arr.push(arg);
    }
  });
  var resultObj = Object.assign.apply(Object, arr);

  var resultStr = '';
  Object.keys(resultObj).forEach(function (key) {
    resultStr += key + ':' + resultObj[key] + ';';
  });
  return resultStr;
};
_.trim = function (value) {
  return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
_.isReactive = function (value) {
  var reg = /(?:^'([^']*?)'$)/;
  return _.trim(value).match(reg);
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/miniapp-utils/px2cpx.js":
/***/ (function(module, exports, __webpack_require__) {

var _ = module.exports = {};
var platform = "qq";
var viewportWidth = void 0;
_.px2cpx = function (px) {
  function getViewportSize() {
    if (platform === 'wx') {
      var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
          windowWidth = _wx$getSystemInfoSync.windowWidth;

      return windowWidth;
    }
    if (platform === 'baidu') {
      var _swan$getSystemInfoSy = swan.getSystemInfoSync(),
          _windowWidth = _swan$getSystemInfoSy.windowWidth;

      return _windowWidth;
    }
    if (platform === 'alipay') {
      var _my$getSystemInfoSync = my.getSystemInfoSync(),
          _windowWidth2 = _my$getSystemInfoSync.windowWidth;

      return _windowWidth2;
    }
    if (platform === 'qq') {
      var _qq$getSystemInfoSync = qq.getSystemInfoSync(),
          _windowWidth3 = _qq$getSystemInfoSync.windowWidth;

      return _windowWidth3;
    }
  }

  viewportWidth = viewportWidth || getViewportSize();
  var cpx = +(750 / viewportWidth * px).toFixed(3);
  return cpx;
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/utils.js":
/***/ (function(module, exports) {

var _ = module.exports = {};

_.getStyleKeyValue = function (declaration) {
  var colonIndex = declaration.indexOf(':');
  var key = declaration.slice(0, colonIndex);
  var value = declaration.slice(colonIndex + 1);
  return {
    key: key, value: value
  };
};
// 支付宝中的e.type="touchStart"
_.handleEventType = function (eventType) {
  var aliEventMap = {
    touchStart: "touchstart",
    touchEnd: "touchend",
    touchMove: "touchmove"
  };
  if (Object.keys(aliEventMap).includes(eventType)) {
    return aliEventMap[eventType];
  } else {
    return eventType;
  }
};
// 对于组件上绑定的touchstart事件，在编译之后会处理成 onTouchStart="handleStart",所以需要改为对应的大写
_.handleCompEventType = function (eventType) {
  var aliEventMap = {
    touchstart: 'touchStart',
    touchend: 'touchEnd',
    touchmove: 'touchMove'
  };
  if (Object.keys(aliEventMap).includes(eventType)) {
    return aliEventMap[eventType];
  } else {
    return eventType;
  }
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/wx-alipay-common-mixins.js":
/***/ (function(module, exports, __webpack_require__) {

var _methods;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var common = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/common.js");
var wxStyleHandle = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-css-loader/proxy/proxyMiniapp.js");
var utils = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/utils.js");

var _require = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/miniapp-utils/px2cpx.js"),
    px2cpx = _require.px2cpx;

var deepClone = function deepClone(obj) {
  if (obj.toString().slice(8, -1) !== "Object") {
    return obj;
  }
  var res = {};
  Object.keys(obj).forEach(function (key) {
    res[key] = deepClone(obj[key]);
  });
  return res;
};

var _ = module.exports = { deepClone: deepClone };

common.merge(_, common);

_.mixins = {
  methods: (_methods = {}, _defineProperty(_methods, _.inlineStatementEventProxy, function (e) {
    var dataset = e.currentTarget.dataset;
    // 支付宝的e.type = 'touchStart',需要改为小写，否则找不到函数

    e.type = utils.handleEventType(e.type);
    var eventKey = e.type.toLowerCase();
    var originFuncName = dataset && dataset['event' + eventKey] && dataset['event' + eventKey][0];
    var inlineArgs = dataset && dataset['event' + eventKey] && dataset['event' + eventKey].slice(1);
    var argsArr = [];
    // 由于百度对于 data-arg="" 在dataset.arg = true 值和微信端不一样所以需要重新处理下这部分逻辑
    if (inlineArgs) {
      argsArr = inlineArgs.reduce(function (result, arg, index) {
        if (arg === "$event") {
          var newEvent = getNewEvent(e);
          result.push(newEvent);
        } else {
          result.push(arg);
        }
        return result;
      }, []);
    }
    if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
      this[originFuncName].apply(this, _toConsumableArray(argsArr));
    } else {
      console.log('can not find method ' + originFuncName);
    }
  }), _defineProperty(_methods, _.modelEventProxyName, function (e) {
    var dataset = e.currentTarget && e.currentTarget.dataset;
    var modelKey = dataset && dataset.modelkey;
    if (modelKey) {
      this[modelKey] = e.detail.value;
    }
  }), _defineProperty(_methods, _.eventProxyName, function (e) {
    var dataset = e.currentTarget.dataset;
    // 支付宝的e.type = 'touchStart',需要改为小写，否则找不到函数

    e.type = utils.handleEventType(e.type);
    var eventKey = e.type.toLowerCase();
    var originFuncName = dataset && dataset['event' + eventKey] && dataset['event' + eventKey][0];
    if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
      var newEvent = getNewEvent(e);
      this[originFuncName](newEvent);
    } else {
      console.log('can not find method ' + originFuncName);
    }
  }), _defineProperty(_methods, _.styleParseName, function (content) {
    var res = '';
    if (_.isType(content, 'Object')) {
      Object.keys(content).forEach(function (key) {
        res += key + ':' + content[key] + ';';
      });
    } else if (_.isType(content, 'String')) {
      res = content;
    }
    return wxStyleHandle(res);
  }), _defineProperty(_methods, _.mergeStyleName, function () {
    return _.mergeStyle.apply(_, arguments);
  }), _defineProperty(_methods, _.animationProxy, function () {
    var animationValue = arguments.length <= 0 ? undefined : arguments[0];
    // animationValue:{cbs:{0:cb0,1:cb1,length:2},index}
    var animation = this[animationValue]; // 引用值
    if (!animation) {
      return;
    }
    var cbs = animation.cbs,
        index = animation.index;
    // 配合 解决百度端动画bug

    if (cbs === undefined || index === undefined) {
      return;
    }
    var cb = cbs[index];
    if (cb && typeof cb === 'function') {
      cb();
    }
    delete animation.index;
    animation.index = index + 1;
  }), _methods)

};

function getNewEvent(e) {
  var newEvent = {};
  ['type', 'timeStamp', 'target', 'currentTarget', 'detail', 'touches', 'changedTouches'].forEach(function (key) {
    if (e[key]) {
      if (~['target', 'currentTarget'].indexOf(key)) {
        var newTarget = {};
        newTarget = {
          id: e[key].id,
          dataset: e[key].dataset
        };
        newEvent[key] = newTarget;
      } else if (~['touches', 'changedTouches'].indexOf(key)) {
        if (key == 'touches') {
          var touches = e[key];
          newEvent.touches = [];
          for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var ret = {};
            ret.identifier = touch.identifier;
            ret.pageX = px2cpx(parseInt(touch.pageX, 10));
            ret.pageY = px2cpx(parseInt(touch.pageY, 10));
            ret.clientX = px2cpx(parseInt(touch.clientX, 10));
            ret.clientY = px2cpx(parseInt(touch.clientY, 10));
            newEvent.touches.push(ret);
          }
        }

        if (key == 'changedTouches') {
          var changedTouches = e[key];
          newEvent.changedTouches = [];
          for (var _i = 0; _i < changedTouches.length; _i++) {
            var _touch = changedTouches[_i];
            var _ret = {};
            _ret.identifier = _touch.identifier;
            _ret.pageX = px2cpx(parseInt(_touch.pageX, 10));
            _ret.pageY = px2cpx(parseInt(_touch.pageY, 10));
            _ret.clientX = px2cpx(parseInt(_touch.clientX, 10));
            _ret.clientY = px2cpx(parseInt(_touch.clientY, 10));
            newEvent.changedTouches.push(_ret);
          }
        }
      } else {
        newEvent[key] = e[key];
      }
    }
  });

  newEvent._originEvent = e;
  return newEvent;
}

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/wx-mixins.js":
/***/ (function(module, exports, __webpack_require__) {

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var commonMixins = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/wx-alipay-common-mixins.js");

var _ = module.exports = commonMixins.deepClone(commonMixins);
commonMixins.merge(_.mixins.methods, _defineProperty({}, _.eventEmitName, function (eventKey, detail) {
  this.triggerEvent(eventKey, detail);
  if (this.$__checkCmlEmit__) {
    this.$__checkCmlEmit__(eventKey, detail);
  }
}));

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js":
/***/ (function(module, exports) {

/**
* 对象包裹器
*运行时的错误信息，根据端传入不同的方法，
* @param  {Object} obj 需要处理的对象
* @return {Object}     对象
*/
/* istanbul ignore next */
module.exports = function (obj, __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__) {
  var className = obj.constructor.name;
  /* eslint-disable no-undef */
  var defines = __CHECK__DEFINES__;
  var enableTypes = __enableTypes__.split(',') || []; // ['Object','Array','Nullable']
  /* eslint-disable no-undef */
  var types = defines.types;
  var interfaceNames = defines.classes[className];
  var methods = {};

  interfaceNames && interfaceNames.forEach(function (interfaceName) {
    var keys = Object.keys(defines.interfaces);
    keys.forEach(function (key) {
      Object.assign(methods, defines.interfaces[key]);
    });
  });

  /**
  * 获取类型
  *
  * @param  {*}      value 值
  * @return {string}       类型
  */
  var getType = function getType(value) {
    if (value instanceof Promise) {
      return "Promise";
    }
    var type = Object.prototype.toString.call(value);
    return type.replace(/\[object\s(.*)\]/g, '$1').replace(/( |^)[a-z]/g, function (L) {
      return L.toUpperCase();
    });
  };

  /**
  * 校验类型  两个loader共用代码
  *
  * @param  {*}      value 实际传入的值
  * @param  {string} type  静态分析时候得到的值得类型
  * @param  {array[string]} errList 校验错误信息  类型
  * @return {bool}         校验结果
  */

  /* eslint complexity:[2,39] */
  var checkType = function checkType(value, originType) {
    var errList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var isNullableReg = /_cml_nullable_lmc_/g;
    var type = originType.replace('_cml_nullable_lmc_', '');
    type === "Void" && (type = "Undefined");
    var currentType = getType(value);
    var canUseNullable = enableTypes.includes("Nullable");
    var canUseObject = enableTypes.includes("Object");
    if (currentType == 'Null') {
      if (type == "Null") {
        // 如果定义的参数的值就是 Null，那么校验通过
        errList = [];
      } else {
        // 那么判断是否是可选参数的情况
        canUseNullable && isNullableReg.test(originType) ? errList = [] : errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542Fnullable\u914D\u7F6E');
      }
      return errList;
    }
    if (currentType == 'Undefined') {
      // 如果运行时传入的真实值是undefined,那么可能改值在接口处就是被定义为 Undefined类型或者是 ?string 这种可选参数 nullable的情况；
      if (type == "Undefined") {
        errList = [];
      } else {
        canUseNullable && isNullableReg.test(originType) ? errList = [] : errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542Fnullable\u914D\u7F6E\u6216\u8005\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'String') {
      if (type == 'String') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Boolean') {
      if (type == 'Boolean') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Number') {
      if (type == 'Number') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Object') {
      if (type == 'Object') {
        !canUseObject ? errList.push('\u4E0D\u80FD\u76F4\u63A5\u5B9A\u4E49\u7C7B\u578B' + type + '\uFF0C\u9700\u8981\u4F7F\u7528\u7B26\u5408\u7C7B\u578B\u5B9A\u4E49\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542F\u4E86\u53EF\u4EE5\u76F4\u63A5\u5B9A\u4E49 Object \u7C7B\u578B\u53C2\u6570\uFF1B') : errList = [];
      } else if (type == 'CMLObject') {
        errList = [];
      } else {
        // 这种情况的对象就是自定义的对象；
        if (types[type]) {
          var _keys = Object.keys(types[type]);
          // todo 这里是同样的问题，可能多传递
          _keys.forEach(function (key) {
            var subError = checkType(value[key], types[type][key], []);
            if (subError && subError.length) {
              errList = errList.concat(subError);
            }
          });
          if (Object.keys(value).length > _keys.length) {
            errList.push('type [' + type + '] \u53C2\u6570\u4E2A\u6570\u4E0E\u5B9A\u4E49\u4E0D\u7B26');
          }
        } else {
          errList.push('找不到定义的type [' + type + ']!');
        }
      }
      return errList;
    }
    if (currentType == 'Array') {
      if (type == 'Array') {
        !canUseObject ? errList.push('\u4E0D\u80FD\u76F4\u63A5\u5B9A\u4E49\u7C7B\u578B' + type + '\uFF0C\u9700\u8981\u4F7F\u7528\u7B26\u5408\u7C7B\u578B\u5B9A\u4E49\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u5F00\u542F\u4E86\u53EF\u4EE5\u76F4\u63A5\u5B9A\u4E49 Array \u7C7B\u578B\u53C2\u6570\uFF1B') : errList = [];
      } else {
        if (types[type]) {
          // 数组元素的类型
          var itemType = types[type][0];
          for (var i = 0; i < value.length; i++) {
            var subError = checkType(value[i], itemType, []);
            if (subError && subError.length) {
              errList = errList.concat(subError);
            }
          }
        } else {
          errList.push('找不到定义的type [' + type + ']!');
        }
      }

      return errList;
    }
    if (currentType == 'Function') {
      // if (type == 'Function') {
      //   errList = [];
      // } else {
      //   errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
      // }
      if (types[type]) {
        if (!types[type].input && !types[type].output) {
          errList.push('\u627E\u4E0D\u5230' + types[type] + ' \u51FD\u6570\u5B9A\u4E49\u7684\u8F93\u5165\u8F93\u51FA');
        }
      } else {
        errList.push('找不到定义的type [' + type + ']!');
      }
      return errList;
    }
    if (currentType == 'Promise') {
      if (type == 'Promise') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'Date') {
      if (type == 'Date') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }
    if (currentType == 'RegExp') {
      if (type == 'RegExp') {
        errList = [];
      } else {
        errList.push('\u5B9A\u4E49\u4E86' + type + '\u7C7B\u578B\u7684\u53C2\u6570\uFF0C\u4F20\u5165\u7684\u5374\u662F' + currentType + ',\u8BF7\u68C0\u67E5\u6240\u4F20\u53C2\u6570\u662F\u5426\u548C\u63A5\u53E3\u5B9A\u4E49\u7684\u4E00\u81F4');
      }
      return errList;
    }

    return errList;
  };

  /**
  * 校验参数类型
  *
  * @param  {string} methodName 方法名称
  * @param  {Array}  argNames   参数名称列表
  * @param  {Array}  argValues  参数值列表
  * @return {bool}              校验结果
  */
  /**
       * var __CHECK__DEFINES__ = {
          "types": {
            "Callback": {
              "input": [],
              "output": "Undefined"
            }
          },
          "interfaces": {
            "MultiInterface": {
              "getMsg": {
                "input": ["String", "Object_cml_nullable_lmc_", "Callback_cml_nullable_lmc_"],
                "output": "String"
              }
            }
          },
          "classes": {
            "Method": ["MultiInterface"]
          }
        };
      */
  var checkArgsType = function checkArgsType(methodName, argValues) {
    var argList = void 0;
    if (getType(methodName) == 'Array') {
      // methodName:['getMsg',2];
      // 回调函数的校验    methodName[0] 方法的名字 methodName[1]该回调函数在方法的参数索引
      // 如上，对于可传可不传的回调函数来说，Callback_cml_nullable_lmc_,所以需要将其去掉
      var funcKey = methods[methodName[0]].input[methodName[1]].replace('_cml_nullable_lmc_', '');
      argList = types[funcKey].input;
      // 拿到这个回调函数的参数定义
    } else {
      argList = methods[methodName].input;
    }
    // todo 函数可能多传参数
    argList.forEach(function (argType, index) {
      var errList = checkType(argValues[index], argType, []);
      if (errList && errList.length > 0) {
        __CML_ERROR__('\n       \u6821\u9A8C\u4F4D\u7F6E: \u65B9\u6CD5' + methodName + '\u7B2C' + (index + 1) + '\u4E2A\u53C2\u6570\n       \u9519\u8BEF\u4FE1\u606F: ' + errList.join('\n'));
      }
    });
    if (argValues.length > argList.length) {
      __CML_ERROR__('[' + methodName + ']\u65B9\u6CD5\u53C2\u6570\u4F20\u9012\u4E2A\u6570\u4E0E\u5B9A\u4E49\u4E0D\u7B26');
    }
  };

  /**
  * 校验返回值类型
  *
  * @param  {string} methodName 方法名称
  * @param  {*}      returnData 返回值
  * @return {bool}              校验结果
  */
  var checkReturnType = function checkReturnType(methodName, returnData) {
    var output = void 0;
    if (getType(methodName) == 'Array') {
      // 回调函数的校验    methodName[0] 方法的名字 methodName[1]该回调函数在方法的参数索引
      // 如上，对于可传可不传的回调函数来说，Callback_cml_nullable_lmc_,所以需要将其去掉
      var funcKey = methods[methodName[0]].input[methodName[1]].replace('_cml_nullable_lmc_', '');
      output = types[funcKey].output;
      // output = types[methods[methodName[0]].input[methodName[1]]].output;
    } else {
      output = methods[methodName].output;
    }
    // todo output 为什么可以是数组
    // if (output instanceof Array) {
    //   output.forEach(type => {

    //     //todo 而且是要有一个校验不符合就check失败？ 应该是有一个校验通过就可以吧
    //     checkType(returnData, type,[])
    //   });
    // }
    var errList = checkType(returnData, output, []);
    if (errList && errList.length > 0) {
      __CML_ERROR__('\n     \u6821\u9A8C\u4F4D\u7F6E: \u65B9\u6CD5' + methodName + '\u8FD4\u56DE\u503C\n     \u9519\u8BEF\u4FE1\u606F: ' + errList.join('\n'));
    }
  };

  /**
  * 创建warpper
  *
  * @param  {string}   funcName   方法名称
  * @param  {Function} originFunc 原有方法
  * @return {Function}            包裹后的方法
  */
  var createWarpper = function createWarpper(funcName, originFunc) {
    return function () {
      var argValues = Array.prototype.slice.call(arguments).map(function (arg, index) {
        // 对传入的方法要做特殊的处理，这个是传入的callback，对callback函数再做包装
        if (getType(arg) == 'Function') {
          return createWarpper([funcName, index], arg);
        }
        return arg;
      });

      checkArgsType(funcName, argValues);

      var result = originFunc.apply(this, argValues);

      checkReturnType(funcName, result);
      return result;
    };
  };

  // 获取所有方法
  var keys = Object.keys(methods);

  // 处理包装方法
  keys.forEach(function (key) {
    var originFunc = obj[key];
    if (!originFunc) {
      __CML_ERROR__('method [' + key + '] not found!');
      return;
    }

    if (obj.hasOwnProperty(key)) {
      obj[key] = createWarpper(key, originFunc);
    } else {
      Object.getPrototypeOf(obj)[key] = createWarpper(key, originFunc);
    }
  });

  return obj;
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js":
/***/ (function(module, exports) {


module.exports = function copyProtoProperty(obj) {
  var EXPORT_OBJ = obj || {};
  var EXPORT_PROTO = Object.getPrototypeOf(EXPORT_OBJ);
  if (EXPORT_PROTO.constructor !== Object) {
    Object.getOwnPropertyNames(EXPORT_PROTO).forEach(function (key) {
      if (!/constructor|prototype|length/ig.test(key)) {
        // 原型上有自身没有的属性 放到自身上
        if (!EXPORT_OBJ.hasOwnProperty(key)) {
          EXPORT_OBJ[key] = EXPORT_PROTO[key];
        }
      }
    });
  }
  return EXPORT_OBJ;
};

/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/regenerator-runtime/runtime-module.js":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/regenerator-runtime/runtime.js");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/regenerator-runtime/runtime.js":
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ "../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/cpx2px/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cpx2px;

var _getWidth = __webpack_require__("./node_modules/chameleon-api/src/interfaces/px2cpx/getWidth.interface");

var _getWidth2 = _interopRequireDefault(_getWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cpx2px(cpx) {
  if (typeof cpx !== 'number') {
    console.error('Parameter must be a number');
    return;
  }
  var viewportWidth = _getWidth2.default.getWidth();
  var px = +(viewportWidth / 750 * cpx).toFixed(3);
  return px;
}

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/getRect/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__("./node_modules/chameleon-api/src/interfaces/px2cpx/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-api/src/interfaces/getRect/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {
    "resData": {
      "width": "Number",
      "height": "Number",
      "left": "Number",
      "top": "Number",
      "right": "Number",
      "bottom": "Number"
    },
    "CallBack": {
      "input": ["resData"],
      "output": "Undefined"
    }
  },
  "interfaces": {
    "UserInfoInterface": {
      "getRect": {
        "input": ["CMLObject", "CallBack"],
        "output": "Undefined"
      }
    }
  },
  "classes": {
    "Method": ["UserInfoInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "getRect",
    value: function getRect(refObj, cb) {
      var query = qq.createSelectorQuery().in(refObj.context);
      query.select("#" + refObj.id).boundingClientRect();
      query.exec(function (res) {
        var rectObj = {
          width: res[0] && (0, _index2.default)(res[0].width) || 0,
          height: res[0] && (0, _index2.default)(res[0].height) || 0,
          left: res[0] && (0, _index2.default)(res[0].left) || 0,
          top: res[0] && (0, _index2.default)(res[0].top) || 0,
          right: res[0] && (0, _index2.default)(res[0].right) || 0,
          bottom: res[0] && (0, _index2.default)(res[0].bottom) || 0
        };
        cb(rectObj);
      });
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/getRect/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRect;

var _index = __webpack_require__("./node_modules/chameleon-api/src/interfaces/getRect/index.interface");

var _index2 = _interopRequireDefault(_index);

var _utils = __webpack_require__("./node_modules/chameleon-api/src/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRect(ref, context) {
  return new Promise(function (resolve, reject) {
    var refObj = (0, _utils.getRefObj)(ref, context);
    _index2.default.getRect(refObj, function (res) {
      resolve(res);
    });
  });
}

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/getSystemInfo/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-api/src/interfaces/getSystemInfo/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {
    "res": {
      "os": "String",
      "env": "String",
      "viewportWidth": "Number",
      "viewportHeight": "Number",
      "extraParams": "CMLObject"
    },
    "CallBack": {
      "input": ["res"],
      "output": "Undefined"
    }
  },
  "interfaces": {
    "UserInfoInterface": {
      "getSystemInfo": {
        "input": ["CallBack"],
        "output": "Undefined"
      }
    }
  },
  "classes": {
    "Method": ["UserInfoInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");

var systemInfo = null;

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "getSystemInfo",
    value: function getSystemInfo(cb) {
      if (systemInfo) {
        cb(systemInfo);
        return;
      }

      qq.getSystemInfo({
        success: function success(res) {
          var os = /android/i.test(res.system) ? 'android' : 'ios';
          var viewportWidth = res.windowWidth;
          var viewportHeight = res.windowHeight;
          systemInfo = {
            os: os,
            env: 'qq',
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight,
            extraParams: res || {}
          };
          cb(systemInfo);
        },
        fail: function fail(err) {
          // 获取失败时不做存储
          var failSystemInfo = {
            os: '',
            env: 'qq',
            viewportWidth: 0,
            viewportHeight: 0,
            extraParams: {}
          };
          cb(failSystemInfo);
        }
      });
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/getSystemInfo/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getSystemInfo;

var _index = __webpack_require__("./node_modules/chameleon-api/src/interfaces/getSystemInfo/index.interface");

var _index2 = _interopRequireDefault(_index);

var _utils = __webpack_require__("./node_modules/chameleon-api/src/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSystemInfo() {
  return new Promise(function (resolve, reject) {
    _index2.default.getSystemInfo(function (res) {
      res.extraParams = (0, _utils.tryJsonParse)(res.extraParams);
      // px2viewpx
      var pxRpxRate = 750 / res.viewportWidth;
      var viewportHeight = +(res.viewportHeight * pxRpxRate).toFixed(3);
      var viewportWidth = +(res.viewportWidth * pxRpxRate).toFixed(3);

      if (res.os) {
        resolve(_extends({}, res, {
          viewportHeight: viewportHeight,
          viewportWidth: viewportWidth
        }));
      } else {
        reject(res);
      }
    });
  });
}

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/px2cpx/getWidth.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-api/src/interfaces/px2cpx/getWidth.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "getWidthInterface": {
      "getWidth": {
        "input": [],
        "output": "Number"
      }
    }
  },
  "classes": {
    "Method": ["getWidthInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");

var _qq$getSystemInfoSync = qq.getSystemInfoSync(),
    windowWidth = _qq$getSystemInfoSync.windowWidth;

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "getWidth",
    value: function getWidth() {
      return windowWidth;
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-api/src/interfaces/px2cpx/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = px2cpx;

var _getWidth = __webpack_require__("./node_modules/chameleon-api/src/interfaces/px2cpx/getWidth.interface");

var _getWidth2 = _interopRequireDefault(_getWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function px2cpx(px) {

  if (typeof px !== 'number') {
    console.error('Parameter must be a number');
    return;
  }

  var viewportWidth = _getWidth2.default.getWidth();
  var cpx = +(750 / viewportWidth * px).toFixed(3);
  return cpx;
}

/***/ }),

/***/ "./node_modules/chameleon-api/src/lib/utils.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFn = isFn;
exports.isStr = isStr;
exports.isNum = isNum;
exports.isObj = isObj;
exports.isArray = isArray;
exports.isUndefined = isUndefined;
exports.isEmpty = isEmpty;
exports.noop = noop;
exports.parseQuery = parseQuery;
exports.queryStringify = queryStringify;
exports.buildQueryStringUrl = buildQueryStringUrl;
exports.queryParse = queryParse;
exports.isNeedApiPrefix = isNeedApiPrefix;
exports.addApiPrefix = addApiPrefix;
exports.tryJsonParse = tryJsonParse;
exports.getQueryParamsFromUrl = getQueryParamsFromUrl;
exports.getOpenObj = getOpenObj;
exports.getUrlWithConnector = getUrlWithConnector;
exports.getRefObj = getRefObj;
exports.compareVersion = compareVersion;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * 基础js方法的封装
 *
 */
function typeEqual(obj, type) {
  return Object.prototype.toString.call(obj) === '[object ' + type + ']';
}

function isFn(obj) {
  return typeEqual(obj, 'Function');
}

function isStr(obj) {
  return typeEqual(obj, 'String');
}

function isNum(obj) {
  return typeof obj === 'number';
}

function isObj(obj) {
  return typeEqual(obj, 'Object');
}

function isArray(obj) {
  return typeEqual(obj, 'Array');
}

function isUndefined(obj) {
  return typeEqual(obj, 'Undefined');
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function noop() {}

function parseQuery(obj) {
  var str = '&';
  var keys = null;
  if (obj && Object.keys(obj).length > 0) {
    keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      str += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
  }
  return str;
}

function queryStringify(obj) {
  var strArr = [];
  var keys = null;
  if (obj && Object.keys(obj).length > 0) {
    keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      strArr.push(key + '=' + encodeURIComponent(obj[key]));
    }
  }
  return strArr.join('&');
}

function buildQueryStringUrl(params) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!url) return queryStringify(params);
  var retUrl = url;
  if (queryStringify(params)) {
    retUrl = url.indexOf('?') > -1 ? url + '&' + queryStringify(params) : url + '?' + queryStringify(params);
  }
  return retUrl;
}

function queryParse() {
  var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var arr = search.split(/(\?|&)/);
  var parmsObj = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('=') !== -1) {
      var keyValue = arr[i].match(/([^=]*)=(.*)/);
      parmsObj[keyValue[1]] = decodeURIComponent(keyValue[2]);
    }
  }
  return parmsObj;
}

function isNeedApiPrefix(url) {
  return !/^(https?\:\/\/)|^(\/\/)/.test(url);
}

function addApiPrefix(url, domainkey) {
  var domainMap = process.env.domainMap;
  // 新版cli
  if (domainMap) {
    var prefix = domainMap[domainkey] || process.env.devApiPrefix;
    return prefix + url;
  } else {
    // 老版本配置apiPrefix
    if (true) {
      return "http://192.168.31.64:8000" + url;
    }
  }
}

function tryJsonParse(some) {
  // 这里eslint提示也先别删除\[\]
  if (isStr(some) && /[\{\[].*[\}\]]/.test(some)) {
    try {
      some = JSON.parse(some);
    } catch (err) {}
  }
  return some;
}

function getQueryParamsFromUrl(url) {
  var arr = url.split(/(\?|&)/);
  var parmsObj = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('=') !== -1) {
      var keyValue = arr[i].match(/([^=]*)=(.*)/);
      parmsObj[keyValue[1]] = decodeURIComponent(keyValue[2]);
    }
  }
  return parmsObj;
}

/**
 * 获取处理后的各端打开的地址
 * @param {String} url url地址
 * @return {Object} objTreated 处理好的三端地址及对象
 */
function getOpenObj(url) {
  var webUrlWithoutQuery = url.split('?')[0];
  var queryObj = getQueryParamsFromUrl(url);

  var _queryObj$path = queryObj.path,
      path = _queryObj$path === undefined ? '' : _queryObj$path,
      _queryObj$envVersion = queryObj.envVersion,
      envVersion = _queryObj$envVersion === undefined ? '' : _queryObj$envVersion,
      _queryObj$weixin_appi = queryObj.weixin_appid,
      weixin_appid = _queryObj$weixin_appi === undefined ? '' : _queryObj$weixin_appi,
      _queryObj$weixin_path = queryObj.weixin_path,
      weixin_path = _queryObj$weixin_path === undefined ? '' : _queryObj$weixin_path,
      _queryObj$weixin_envV = queryObj.weixin_envVersion,
      weixin_envVersion = _queryObj$weixin_envV === undefined ? '' : _queryObj$weixin_envV,
      _queryObj$qq_appid = queryObj.qq_appid,
      qq_appid = _queryObj$qq_appid === undefined ? '' : _queryObj$qq_appid,
      _queryObj$qq_path = queryObj.qq_path,
      qq_path = _queryObj$qq_path === undefined ? '' : _queryObj$qq_path,
      _queryObj$qq_envVersi = queryObj.qq_envVersion,
      qq_envVersion = _queryObj$qq_envVersi === undefined ? '' : _queryObj$qq_envVersi,
      _queryObj$baidu_appid = queryObj.baidu_appid,
      baidu_appid = _queryObj$baidu_appid === undefined ? '' : _queryObj$baidu_appid,
      _queryObj$baidu_path = queryObj.baidu_path,
      baidu_path = _queryObj$baidu_path === undefined ? '' : _queryObj$baidu_path,
      _queryObj$baidu_envVe = queryObj.baidu_envVersion,
      baidu_envVersion = _queryObj$baidu_envVe === undefined ? '' : _queryObj$baidu_envVe,
      _queryObj$alipay_appi = queryObj.alipay_appid,
      alipay_appid = _queryObj$alipay_appi === undefined ? '' : _queryObj$alipay_appi,
      _queryObj$alipay_path = queryObj.alipay_path,
      alipay_path = _queryObj$alipay_path === undefined ? '' : _queryObj$alipay_path,
      _queryObj$alipay_envV = queryObj.alipay_envVersion,
      alipay_envVersion = _queryObj$alipay_envV === undefined ? '' : _queryObj$alipay_envV,
      _queryObj$weex_path = queryObj.weex_path,
      weex_path = _queryObj$weex_path === undefined ? '' : _queryObj$weex_path,
      _queryObj$cml_addr = queryObj.cml_addr,
      cml_addr = _queryObj$cml_addr === undefined ? '' : _queryObj$cml_addr,
      extraData = _objectWithoutProperties(queryObj, ['path', 'envVersion', 'weixin_appid', 'weixin_path', 'weixin_envVersion', 'qq_appid', 'qq_path', 'qq_envVersion', 'baidu_appid', 'baidu_path', 'baidu_envVersion', 'alipay_appid', 'alipay_path', 'alipay_envVersion', 'weex_path', 'cml_addr']);

  var objTreated = {
    weex: cml_addr ? webUrlWithoutQuery + '?weex_path=' + weex_path + queryStringify(extraData) + '&cml_addr=' + cml_addr : null,
    web: webUrlWithoutQuery + '?' + queryStringify(extraData),
    wx: {
      appId: weixin_appid,
      path: weixin_path || path,
      extraData: extraData,
      envVersion: weixin_envVersion || envVersion
    },
    qq: {
      appId: qq_appid,
      path: qq_path || path,
      extraData: extraData,
      envVersion: qq_envVersion || envVersion
    },
    alipay: {
      appId: alipay_appid,
      path: alipay_path || path,
      extraData: extraData,
      envVersion: alipay_envVersion || envVersion
    },
    baidu: {
      appKey: baidu_appid,
      path: baidu_path || path,
      extraData: extraData
    }
  };
  return objTreated;
}

// 获得带正确连接符的url
function getUrlWithConnector(url) {
  var connector = url.includes('?') ? '&' : '?';
  return url + connector;
}

// 获取ref的通用对象
function getRefObj(ref, context) {
  var refObj = {
    webDom: '',
    id: '',
    weexRef: '',
    context: context
  };
  // 容错处理
  if (!ref) return refObj;

  // 兼容新版ref, 为字符串
  if (typeof ref == 'string') {
    refObj.id = ref;
    if (false) {
      refObj.weexRef = context.$refs && context.$refs[ref];
    } else if (false) {
      refObj.webDom = context.$refs[ref] && context.$refs[ref][0] || context.$refs[ref] && context.$refs[ref].$el || context.$refs[ref];
    }
    return refObj;
  }

  // 向下兼容旧版ref
  if (true) {
    refObj.id = ref.id;
  } else if (process.env.platform === 'weex') {
    refObj.weexRef = ref;
  } else if (ref.$el) {
    refObj.webDom = ref.$el;
  } else {
    refObj.webDom = ref;
  }
  return refObj;
}

/**
 * 比较版本号
 * @param {String} v1 版本号1
 * @param {String} symb 比较符
 * @param {String} v2 版本号2
 */
function compareVersion(v1, symb, v2) {
  v1 = parseVersion(v1);
  v2 = parseVersion(v2);
  if (symb.indexOf('=') !== -1 && v1 === v2) {
    return true;
  }
  if (symb.indexOf('>') !== -1 && v1 > v2) {
    return true;
  }
  if (symb.indexOf('<') !== -1 && v1 < v2) {
    return true;
  }
  return false;
}

function parseVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  version = version.split('.');
  version.length = 4;
  var ret = [];
  version.forEach(function (n) {
    n = n * 1;
    if (n) {
      ret.push(n >= 10 ? n : '0' + n);
    } else {
      ret.push('00');
    }
  });
  return parseInt(ret.join(''), 10);
}

/**
 * 判断targetMap中的属性是否被checkMap的属性包含，不是则抛出错误
 * @param {Object || Array} checkMap 
 * @param {Object} targetMap 
 * @returns {Boolean}
 */
var checkValue = exports.checkValue = function checkValue(check, targetMap) {
  if (isObj(check) || isArray(check)) {
    var checkArray = isObj(check) ? Object.keys(check) : check;
    Object.keys(targetMap).forEach(function (key) {
      if (!checkArray.includes(key)) {
        throw Error(key + '\u503C\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u68C0\u67E5\uFF01');
      }
    });
  } else {
    // redLog('请传入数组或对象')
    return false;
  }
  return true;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/chameleon-runtime/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createApp/index.js");

var _index2 = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createPage/index.js");

var _index3 = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createComponent/index.js");

var _index4 = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/bootstrap/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({
  createApp: _index.createApp,
  createPage: _index2.createPage,
  createComponent: _index3.createComponent
}, _index5.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/bootstrap/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__("./node_modules/chameleon-runtime/src/interfaces/bootstrap/shim.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-runtime/src/interfaces/bootstrap/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "bootstrapInterface": {
      "bootstrap": {
        "input": ["CMLObject"],
        "output": "Undefined"
      },
      "getInfo": {
        "input": [],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["bootstrapInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");
// 定义模块的interface

/* istanbul ignore next */

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "bootstrap",
    value: function bootstrap(options) {//  小程序端启动入口为src/app/app.cml
    }
  }, {
    key: "getInfo",
    value: function getInfo() {
      return {};
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/bootstrap/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/bootstrap/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
exports.default = {
  bootstrap: function bootstrap() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _index2.default.bootstrap.call(_index2.default, options);
  },
  getInfo: _index2.default.getInfo

};

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/bootstrap/shim.js":
/***/ (function(module, exports) {

/**
 * Promise.finally、Promise.done 垫片
 */
if (typeof Promise.prototype.finally !== 'function') {
  Promise.prototype.finally = function (onFinally) {
    var P = this.constructor;
    return this.then(function (value) {
      return P.resolve(onFinally()).then(function () {
        return value;
      });
    }, function (reason) {
      return P.resolve(onFinally()).then(function () {
        throw reason;
      });
    });
  };
}

if (typeof Promise.prototype.done === 'undefined') {
  Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected).catch(function (error) {
      setTimeout(function () {
        throw error;
      }, 0);
    });
  };
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createApp/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qq = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-runtime/src/interfaces/createApp/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "createAppInterface": {
      "createApp": {
        "input": ["CMLObject"],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["createAppInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");
// 定义模块的interface

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "createApp",
    value: function createApp(options) {
      return new _qq.App(options);
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createApp/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;

var _index = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createApp/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApp(options) {
  return _index2.default.createApp(options);
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createComponent/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qq = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-runtime/src/interfaces/createComponent/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "createCmptInterface": {
      "createComponent": {
        "input": ["CMLObject"],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["createCmptInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");
// 定义模块的interface

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "createComponent",
    value: function createComponent(options) {
      return new _qq.Component(options);
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createComponent/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;

var _index = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createComponent/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createComponent(options) {
  return _index2.default.createComponent(options);
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createPage/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qq = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-runtime/src/interfaces/createPage/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "createPgInterface": {
      "createPage": {
        "input": ["CMLObject"],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["createPgInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");
// 定义模块的interface

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "createPage",
    value: function createPage(options) {
      return new _qq.Page(options);
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/interfaces/createPage/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPage = createPage;

var _index = __webpack_require__("./node_modules/chameleon-runtime/src/interfaces/createPage/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPage(options) {
  return _index2.default.createPage(options);
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/proto/BaseCtor.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _proto = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/proto.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseCtor = function () {
  function BaseCtor(options) {
    _classCallCheck(this, BaseCtor);

    // 拷贝原型链上属性
    (0, _proto.copyProtoProperty)(options);

    this.options = _extends({}, options);
    this.originalOptions = options;
  }

  _createClass(BaseCtor, [{
    key: 'initVmAdapter',
    value: function initVmAdapter(VmAdapter, config) {
      var vmAdapter = new VmAdapter(_extends({
        options: this.options
      }, config));
      this.options = vmAdapter.getOptions();
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }]);

  return BaseCtor;
}();

exports.default = BaseCtor;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/proto/BaseVmAdapter.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _warn = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/warn.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// options transform 基类
var BaseVmAdapter = function () {
  function BaseVmAdapter(config) {
    _classCallCheck(this, BaseVmAdapter);

    this.type = config.type;
    this.options = config.options;
    this.injectMixins = config.injectMixins || [];
    this.runtimeMixins = config.runtimeMixins;
    this.hooks = config.hooks;
    this.hooksMap = config.hooksMap;
    this.polyHooks = config.polyHooks;
    this.usedHooks = config.usedHooks;
    this.platform = '';

    if (true) {
      var mix = this.options.mixins;
      (0, _warn.invariant)((0, _type.type)(mix) === 'Undefined' || (0, _type.type)(mix) === "Array", "mixins expects an Array");
    }
  }

  _createClass(BaseVmAdapter, [{
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }]);

  return BaseVmAdapter;
}();

exports.default = BaseVmAdapter;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/proto/MiniRuntimeCore.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

var _toJS = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/toJS.js");

var _toJS2 = _interopRequireDefault(_toJS);

var _util = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/util.js");

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _KEY = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/KEY.js");

var _KEY2 = _interopRequireDefault(_KEY);

var _diff = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/diff.js");

var _diff2 = _interopRequireDefault(_diff);

var _warn = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/warn.js");

var _debug = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/debug.js");

var _EventBus = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/EventBus.js");

var _EventBus2 = _interopRequireDefault(_EventBus);

var _proto = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/proto.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEY_COMPUTED = _KEY2.default.get('computed');

var MiniRuntimeCore = function () {
  function MiniRuntimeCore(config) {
    _classCallCheck(this, MiniRuntimeCore);

    this.platform = config.platform || '';
    this.options = config.options;

    this.polyHooks = config.polyHooks;

    this.propsName = _KEY2.default.get(this.platform + '.props');
  }

  _createClass(MiniRuntimeCore, [{
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = options;
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      this.context = context;
      return this;
    }
  }, {
    key: 'init',
    value: function init() {
      if (true) {
        (0, _warn.invariant)(!!this.context, "【chameleon-runtime】runtime context should not undefined");
      }

      var context = this.context;

      this.extendContext();
      // 属性
      this.initData();

      // 方法
      this.initInterface();

      // 数据劫持
      this.proxyHandler();

      // watch 属性mobx转换
      var mergeWatches = (0, _util.extend)(context.__cml_originOptions__.watch, context.watch || {});
      initWatch(context, mergeWatches);
      return this;
    }
  }, {
    key: 'extendContext',
    value: function extendContext() {
      this.context['$cmlEventBus'] = _EventBus2.default;
    }
  }, {
    key: 'initData',
    value: function initData() {
      var context = this.context;
      context.__cml_originOptions__ = this.options;
      // 清理函数列表
      context.__cml_disposerList__ = [];
      // update后，回调函数收集器
      context.__cml_cbCollection__ = [];

      context['$cmlPolyHooks'] = this.polyHooks;

      if (this.platform === 'alipay') {
        context.__cml_data__ = (0, _util.extend)({}, context.data, context.props);
      } else {
        context.__cml_data__ = (0, _util.extend)({}, context.data);
      }

      transformComputed(context.__cml_data__, context);
    }
  }, {
    key: 'initInterface',
    value: function initInterface() {
      var context = this.context;
      // 构造 watch 能力
      context.$watch = watchFnFactory(context);

      // 构造 updated callback 收集能力
      context.$collect = updatedCbFactory(context);

      // 构造数据更新能力
      context.$setData = setDataFactory(context, this);

      // 构造强制更新能力
      context.$forceUpdate = forceUpdateFactory(context);
    }
  }, {
    key: 'proxyHandler',
    value: function proxyHandler() {
      var context = this.context;
      context.__cml_ob_data__ = (0, _mobx.observable)(context.__cml_data__);

      var origComputed = context.__cml_originOptions__[KEY_COMPUTED];
      var origComputedKeys = origComputed ? (0, _util.enumerableKeys)(origComputed) : [];
      /* 计算属性在mobx里面是不可枚举的，所以篡改下*/
      (0, _util.enumerable)(context.__cml_ob_data__, origComputedKeys);

      (0, _util.proxy)(context, context.__cml_ob_data__);
    }

    /**
     * 启动器
     * @param  {[type]} context [description]
     * @return {[type]}       [description]
     */

  }, {
    key: 'start',
    value: function start(name) {
      if (!this.context) return;
      var context = this.context;
      var self = this;

      /**
       * [computed description]
       * @return {[type]} [description]
       */
      function dataExprFn() {
        var properties = context.__cml_originOptions__[self.propsName];
        var propKeys = (0, _util.enumerableKeys)(properties);
        // setData 的数据不包括 props
        var obData = (0, _util.deleteProperties)(context.__cml_ob_data__, propKeys);

        return (0, _toJS2.default)(obData);
      }

      var _cached = false;
      var cacheData = void 0;
      function sideEffect(curVal) {
        var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if ((0, _type.type)(r.schedule) !== 'Function') {
          return;
        }
        // 缓存reaction
        context.__cml_reaction__ = r;

        var diffV = void 0;
        if (_cached) {
          diffV = (0, _diff2.default)(curVal, cacheData);

          // emit 'beforeUpdate' hook ，第一次不触发
          emit('beforeUpdate', context, curVal, cacheData, diffV);
        } else {
          _cached = true;
          diffV = curVal;
        }

        if ((0, _type.type)(context.setData) === 'Function') {
          context.setData(diffV, walkUpdatedCb(context));
        }

        cacheData = _extends({}, curVal);
      }

      var options = {
        fireImmediately: true,
        name: name,
        onError: function onError() {
          (0, _debug.warn)('RuntimeCore start reaction error!');
        }
      };

      var disposer = (0, _mobx.reaction)(dataExprFn, sideEffect, options);

      context.__cml_disposerList__.push(disposer);
    }

    /**
     * 销毁器
     * @param  {[type]} context [description]
     * @return {[type]}       [description]
     */

  }, {
    key: 'destory',
    value: function destory() {
      if (!this.context) return;
      var context = this.context;
      disposerFactory(context.__cml_disposerList__)();
    }
  }]);

  return MiniRuntimeCore;
}();

/**
 * watch 工厂函数
 * @param  {[type]} context [description]
 * @return {function}       vm.$watch
 */


exports.default = MiniRuntimeCore;
function watchFnFactory(context) {
  return function (expr, handler) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var exprType = typeof expr === 'undefined' ? 'undefined' : _typeof(expr);
    var curVal = void 0;
    var oldVal = void 0;
    if (!/^function|string$/.test(exprType)) {
      console.warn(new Error('watch expression must be a string or function'));
      return;
    }
    if (typeof handler !== 'function') {
      console.warn(new Error('watch callback must be a function'));
      return;
    }

    /**
     * [computed description]
     * @return {[type]} [description]
     */
    function dataExprFn() {
      oldVal = curVal;
      curVal = exprType === 'string' ? (0, _util.getByPath)(context, expr) : expr.call(context);
      if (options.deep) {
        curVal = (0, _toJS2.default)(curVal);
      } else if ((0, _mobx.isObservableArray)(curVal)) {
        // 转成纯数组
        curVal = curVal.slice();
      }
      return curVal;
    }

    function sideEffect(curVal, reaction) {
      handler.call(context, curVal, oldVal);
    }

    // 返回清理函数
    var disposer = (0, _mobx.reaction)(dataExprFn, sideEffect, {
      fireImmediately: !!options.immediate,
      delay: options.sync ? 0 : 1
    });

    context.__cml_disposerList__.push(disposer);
    return disposerFactory(context.__cml_disposerList__, disposer);
  };
}
/**
 * 清理函数构造工厂
 * @param  {array} disposerList 清理函数列表
 * @param  {function} disposer     清理函数
 * @return {function}              清理函数包装方法
 */
function disposerFactory(disposerList, disposer) {
  return function () {
    if (disposer) {
      var index = disposerList.indexOf(disposer);
      index > -1 && disposerList.splice(index, 1);
      disposer();
    } else {
      var _disposer = void 0;
      while (_disposer = disposerList.shift()) {
        _disposer();
      }
    }
  };
}

/**
 * 更新后回调 工厂函数
 * @param  {[type]} context [description]
 * @return {[type]}       [description]
 */
function updatedCbFactory(context) {
  return function (cb) {
    context.__cml_cbCollection__.push(cb);
  };
}

/**
 * 设置数据工厂函数
 * @param {[type]} context [description]
 */
function setDataFactory(context, self) {
  var _cached = false;
  var cacheData = void 0;

  return function () {
    var reaction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if ((0, _type.type)(reaction.schedule) !== 'Function') {
      return;
    }
    // 缓存reaction
    context.__cml_reaction__ = reaction;

    var properties = context.__cml_originOptions__[self.propsName];
    var propKeys = (0, _util.enumerableKeys)(properties);

    var obData = (0, _util.deleteProperties)(context.__cml_ob_data__, propKeys);

    // setData 的数据不包括 props
    var data = (0, _toJS2.default)(obData);

    var diffV = void 0;
    if (_cached) {
      diffV = (0, _diff2.default)(data, cacheData);

      // emit 'beforeUpdate' hook ，第一次不触发
      emit('beforeUpdate', context, data, cacheData, diffV);
    } else {
      _cached = true;
      diffV = data;
    }

    update(diffV);
    cacheData = _extends({}, data);
  };

  function update(diff) {
    if ((0, _type.type)(context.setData) === 'Function') {
      context.setData(diff, walkUpdatedCb(context));
    }
  }
}

function emit(name, context) {
  var cmlVM = context.__cml_originOptions__;

  if (typeof cmlVM[name] === 'function') {
    for (var _len = arguments.length, data = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      data[_key - 2] = arguments[_key];
    }

    cmlVM[name].apply(context, data);
  }
}

/**
 * 执行更新后回调列表
 * @param  {[type]} context [description]
 * @return {[type]}       [description]
 */
function walkUpdatedCb(context) {
  // emit 'updated' hook
  emit('updated', context);

  var cb = void 0;
  var pendingList = context.__cml_cbCollection__.slice(0);
  context.__cml_cbCollection__.length = 0;
  while (cb = pendingList.shift()) {
    typeof cb === 'function' && cb.apply(context);
  }
}

/**
 * forceUpdate 工厂函数
 * @param  {[type]} context [description]
 * @return {[type]}       [description]
 */
function forceUpdateFactory(context) {
  return function (data, cb) {

    var dataType = (0, _type.type)(data);
    if (dataType === 'Function') {
      cb = data;
      data = null;
    } else if (dataType === 'Object') {
      (0, _util.extend)(context.__cml_ob_data__, data);
    }

    (0, _type.type)(cb) === 'Function' && context.$collect(cb);

    context.__cml_reaction__.dependenciesState = 2;
    context.__cml_reaction__.schedule();
  };
}

/**
 * computed 属性mobx转换
 * @param  {Object} __cml_data__ 当前实例响应式数据
 * @param  {Object} context      上下文
 * @return {Object}              转换后computed
 */
function transformComputed(__cml_data__, context) {
  var options = context.__cml_originOptions__;

  var origComputed = (0, _util.extend)(options[KEY_COMPUTED], context[KEY_COMPUTED] || {});
  var origComputedKeys = origComputed ? (0, _util.enumerableKeys)(origComputed) : [];

  origComputedKeys.forEach(function (key) {

    if (key in __cml_data__) {
      console.error('【chameleon-runtime ERROR】', 'the computed key \u3010' + key + '\u3011 is duplicated, please check');
    }

    var getter = origComputed[key].get || origComputed[key];
    var setter = origComputed[key].set;

    (0, _proto.defineGetterSetter)(__cml_data__, key, getter, setter, context);
  });
}

/**
 * watch 属性转换
 * @param  {Object} context 上下文
 * @return {[type]}       [description]
 */
function initWatch(vm, watch) {
  if ((0, _type.type)(watch) !== 'Object') {
    return;
  }

  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      // mobx的reaction执行是倒序的，顾为保证watch正常次序，需倒序注册
      // 这里只解决了watch = {'a':[cb1,cb2]} 的倒序问题，对于$watch方式调用还是倒序
      // 需要改成mobx.observe的方案
      for (var i = handler.length - 1; i >= 0; i--) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if ((0, _type.isPlainObject)(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/proto/MiniVmAdapter.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseVmAdapter2 = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/BaseVmAdapter.js");

var _BaseVmAdapter3 = _interopRequireDefault(_BaseVmAdapter2);

var _util = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/util.js");

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _resolve = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/resolve.js");

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

var _KEY = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/KEY.js");

var _KEY2 = _interopRequireDefault(_KEY);

var _lifecycle = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/lifecycle.js");

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _clone = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/clone.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEY_COMPUTED = _KEY2.default.get('computed');

// 各种小程序options transform 基类

var MiniVmAdapter = function (_BaseVmAdapter) {
  _inherits(MiniVmAdapter, _BaseVmAdapter);

  function MiniVmAdapter(config) {
    _classCallCheck(this, MiniVmAdapter);

    //小程序特有
    var _this = _possibleConstructorReturn(this, (MiniVmAdapter.__proto__ || Object.getPrototypeOf(MiniVmAdapter)).call(this, config));

    _this.needPropsHandler = config.needPropsHandler;

    _this.needResolveAttrs = config.needResolveAttrs;
    _this.needTransformProperties = config.needTransformProperties;
    return _this;
  }

  _createClass(MiniVmAdapter, [{
    key: 'init',
    value: function init() {
      this.propsName = this.platform ? _KEY2.default.get(this.platform + '.props') : '';

      // 处理 CML hooks
      this.initHooks(this.options);

      this.initOptions(this.options);
      // 处理 mixins 
      this.initMixins(this.options);

      // 处理 生命周期多态
      this.extendPolyHooks();

      // init 顺序很重要、

      // 添加各种mixins
      // this.mergeInjectedMixins()
      this.mergeBuiltinMixins();
      // 处理 mixins
      this.resolveOptions();
      // 添加 生命周期代理
      this.transformHooks();
      // 处理 methods
      this.needResolveAttrs && this.resolveAttrs();
      // 处理 props 添加监听
      this.needTransformProperties && this.transformProperties();
    }

    /**
     * merge cml hooks from mixins
     * handle hooks include:
     * 1. cml hooks
     * 2. platforms hooks in resolveOptions function
     * @param {Object} options 
     */

  }, {
    key: 'initHooks',
    value: function initHooks(options) {
      if (!options.mixins) return;
      options.mixins = (0, _clone.deepClone)(options.mixins);

      var cmlHooks = _lifecycle2.default.get('cml.hooks');
      var mixins = options.mixins;

      var _loop = function _loop(i) {
        var mix = mixins[i];

        Object.keys(mix).forEach(function (key) {
          if (cmlHooks.indexOf(key) !== -1) {
            !Array.isArray(mix[key]) && (mix[key] = [mix[key]]);

            if ((0, _util.hasOwn)(options, key)) {
              !Array.isArray(options[key]) && (options[key] = [options[key]]);

              options[key] = mix[key].concat(options[key]);
            } else {
              options[key] = mix[key];
            }
            delete mix[key];
          }
        });
      };

      for (var i = mixins.length - 1; i >= 0; i--) {
        _loop(i);
      }
    }
  }, {
    key: 'initOptions',
    value: function initOptions(options) {
      // 处理 props
      this.needPropsHandler && this.handleProps(options);
      // 处理 生命周期映射
      (0, _util.transferLifecycle)(options, this.hooksMap);
      this.handleComputed(options);
    }

    /**
     * 处理组件props属性
     * @param  {Object} options 组件options
     * @return {[type]}     [description]
     */

  }, {
    key: 'handleProps',
    value: function handleProps(options) {
      var _this2 = this;

      if (!options['props']) return;

      Object.getOwnPropertyNames(options['props']).forEach(function (name) {
        var prop = options['props'][name];
        // Number: 0
        // Boolean: false
        // Array: false
        // String: ''
        // Object: null
        // null: null
        function make(type) {
          if (!knowType(type)) {
            return;
          }

          switch (type) {
            case Number:
              prop = options['props'][name] = {
                type: Number,
                default: 0
              };
              break;
            case Boolean:
              prop = options['props'][name] = {
                type: Boolean,
                default: false
              };
              break;
            case Array:
              prop = options['props'][name] = {
                type: Array,
                default: []
              };
              break;
            case String:
              prop = options['props'][name] = {
                type: String,
                default: ''
              };
              break;
            case Object:
              prop = options['props'][name] = {
                type: Object,
                default: null
              };
              break;
            case null:
              prop = options['props'][name] = {
                type: null,
                default: null
              };
              break;
            default:
              break;
          }
        }

        function knowType(type) {
          return type === Number || type === Boolean || type === Array || type === String || type === Object || type === null;
        }

        // 处理 props = { a: String, b: Boolean }
        make(prop);

        if ((0, _type.type)(prop) === 'Object') {
          if (_this2.platform === 'alipay') {
            if (!prop.hasOwnProperty('default')) {
              // alipay 处理 // 处理 props = { a: {type:String}, b: {type:Boolean} }
              make(prop.type);
            }

            options['props'][name] = prop['default'];
          } else {
            (0, _util.rename)(options['props'][name], 'default', 'value');
          }
        }
      });

      if (this.platform !== 'alipay') {
        (0, _util.rename)(options, 'props', 'properties');
      }

      function check(value, type) {

        if (typeof value === 'undefined') {
          console.error(prop + '\u9700\u8981\u4F20\u9ED8\u8BA4\u503C');
          return false;
        }
        // todo type 校验
      }
    }
  }, {
    key: 'handleComputed',
    value: function handleComputed(options) {
      options.computed = options.computed || {};
      // handle computed to $cmlComputed
      (0, _util.rename)(options, 'computed', KEY_COMPUTED);
    }
  }, {
    key: 'initMixins',
    value: function initMixins(options) {
      var _this3 = this;

      if (!options.mixins) return;

      var mixins = options.mixins;

      mixins.forEach(function (mix) {
        _this3.initOptions(mix);
      });
    }

    /**
     * 小程序端差异化生命周期 hooks mixins
     */

  }, {
    key: 'extendPolyHooks',
    value: function extendPolyHooks() {
      var _this4 = this;

      var methods = this.options.methods;

      if (!methods) {
        return;
      }

      this.polyHooks.forEach(function (hook) {
        if ((0, _type.type)(methods[hook]) === 'Function') {
          if ((0, _type.type)(_this4.options[hook]) === 'Array') {
            _this4.options[hook].push(methods[hook]);
          } else {
            _this4.options[hook] = [methods[hook]];
          }
          delete methods[hook];
        }
      });
    }
  }, {
    key: 'mergeInjectedMixins',
    value: function mergeInjectedMixins() {
      this.options.mixins = this.options.mixins ? this.options.mixins.concat(this.injectMixins) : this.injectMixins;
    }
  }, {
    key: 'mergeBuiltinMixins',
    value: function mergeBuiltinMixins() {
      var btMixin = [this.baseMixins, this.runtimeMixins].filter(function (item) {
        return item;
      });

      this.options.mixins = this.options.mixins ? btMixin.concat(this.options.mixins) : btMixin;
    }
  }, {
    key: 'resolveOptions',
    value: function resolveOptions() {
      var self = this;
      var extractMixins = function extractMixins(mOptions, options) {
        if (options.mixins) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = options.mixins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _mix = _step.value;

              extractMixins(mOptions, _mix);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        mergeMixins(mOptions, options);
      };

      var mergeMixins = function mergeMixins(parent, child) {
        for (var key in child) {
          if (self.hooks.indexOf(key) > -1) {
            (0, _resolve.mergeHooks)(parent, child, key);
          } else if (key === 'data') {
            (0, _resolve.mergeData)(parent, child, key);
          } else if (testProps(key)) {
            (0, _resolve.mergeSimpleProps)(parent, child, key);
          } else if (key === 'watch') {
            (0, _resolve.mergeWatch)(parent, child, key);
          } else if (key !== 'mixins') {
            (0, _resolve.mergeDefault)(parent, child, key);
          }
        }
      };

      var testProps = function testProps(key) {
        var regExp = new RegExp(KEY_COMPUTED + '|methods|proto|' + self.propsName);
        return regExp.test(key);
      };

      var newOptions = {};
      extractMixins(newOptions, this.options);
      this.options = newOptions;
    }
  }, {
    key: 'transformHooks',
    value: function transformHooks() {
      if (!this.hooks || !this.hooks.length) return;
      var self = this;
      this.hooks.forEach(function (key) {
        var hooksArr = self.options[key];
        hooksArr && (self.options[key] = function () {
          var result = void 0;
          var asyncQuene = [];

          // 多态生命周期需要统一回调参数
          // if (self.polyHooks.indexOf(key) > -1) {
          //   let res = args[0]
          //   if (type(res) !== 'Object') {
          //     res = {
          //       'detail': args[0]
          //     }
          //   }
          //   args = [res]
          // }

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if ((0, _type.type)(hooksArr) === 'Function') {
            result = hooksArr.apply(this, args);
          } else if ((0, _type.type)(hooksArr) === 'Array') {
            for (var i = 0; i < hooksArr.length; i++) {
              if ((0, _type.type)(hooksArr[i]) === 'Function') {

                result = hooksArr[i].apply(this, args);

                // if (result && result.enableAsync) {
                //   asyncQuene = hooksArr.slice(i + 1)
                //   break
                // }
              }
            }
            // Promise.resolve().then(() => {
            //   asyncQuene.forEach(fn => {
            //     fn.apply(this, args)
            //   })
            // })
          }
          return result;
        });
      });
    }
  }, {
    key: 'resolveAttrs',
    value: function resolveAttrs() {
      var _this5 = this;

      if (!this.needResolveAttrs.length) return;
      var keys = this.needResolveAttrs;
      if ((0, _type.type)(keys) === 'String') {
        keys = [keys];
      }

      keys.forEach(function (key) {
        var value = _this5.options[key];
        if ((0, _type.type)(value) !== 'Object') return;

        (0, _util.extendWithIgnore)(_this5.options, value, _this5.usedHooks);
        delete _this5.options[key];
      });
    }
  }, {
    key: 'transformProperties',
    value: function transformProperties() {
      var originProperties = this.options[this.propsName];
      var newProps = {};

      (0, _util.enumerableKeys)(originProperties).forEach(function (key) {
        var rawFiled = originProperties[key];

        var rawObserver = rawFiled.observer;
        var newFiled = null;
        if (typeof rawFiled === 'function') {
          newFiled = {
            type: rawFiled
          };
        } else {
          newFiled = (0, _util.extend)({}, rawFiled);
        }
        newFiled.observer = function (value, oldValue) {
          // 小程序内部数据使用了JSON.parse(JSON.stringify(x))的方式，导致每次引用都会变化
          if (_mobx.comparer.structural(value, oldValue)) return;
          this[key] = value;
          typeof rawObserver === 'function' && rawObserver.call(this, value, oldValue);
        };
        newProps[key] = newFiled;
      });

      this.options[this.propsName] = newProps;
    }
  }]);

  return MiniVmAdapter;
}(_BaseVmAdapter3.default);

exports.default = MiniVmAdapter;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/Event.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  事件管理中心，用于监听，派发事件
 */

function call(callback, args) {
  var fn = callback[0];
  var context = callback[1];
  args = callback[2].concat(args);
  try {
    return fn.apply(context, args);
  } catch (e) {
    setTimeout(function () {
      throw e;
    }, 0);
  }
}

function arrayClone(arr, len) {
  var copy = new Array(len);
  while (len--) {
    copy[len] = arr[len];
  }
  return copy;
}

function _emit(type) {
  var listenerList = this._listenerMap[type];
  if (!listenerList) {
    return true;
  }
  var len = listenerList.cbs.length;
  var cbs = arrayClone(listenerList.cbs, len);
  var ret = true;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var index = 0; index < len; index++) {
    if (!cbs[index]) {
      continue;
    }
    ret = call(cbs[index], args) !== false && ret;
  }
  return !!ret;
}

var Event = function () {
  function Event() {
    _classCallCheck(this, Event);

    this._listenerMap = {};
  }

  _createClass(Event, [{
    key: "on",
    value: function on(type, fn, context) {
      var listenerList = this._listenerMap[type];
      if (!listenerList) {
        this._listenerMap[type] = listenerList = {
          args: null,
          cbs: []
        };
      }

      for (var _len2 = arguments.length, rest = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        rest[_key2 - 3] = arguments[_key2];
      }

      var callback = [fn, context, rest];
      var args = listenerList.args;
      if (args) {
        call(callback, args);
      } else {
        listenerList.cbs.push(callback);
      }
    }
  }, {
    key: "once",
    value: function once(type, fn, context) {
      for (var _len3 = arguments.length, rest = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        rest[_key3 - 3] = arguments[_key3];
      }

      var fired = false;
      function magic() {
        this.un(type, magic);

        if (!fired) {
          fired = true;

          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          fn.apply(context, args.concat(rest));
        }
      }

      this.on(type, magic, this);
    }
  }, {
    key: "un",
    value: function un(type, fn) {
      var listenerList = this._listenerMap[type];
      if (!listenerList) {
        return true;
      }
      if (arguments.length === 1) {
        listenerList.cbs = [];
      } else {
        var cbs = listenerList.cbs;
        var count = cbs.length;
        while (count--) {
          if (cbs[count] && cbs[count][0] === fn) {
            cbs.splice(count, 1);
          }
        }
      }
    }
  }, {
    key: "emit",
    value: function emit(type, args) {
      return _emit.apply(this, arguments);
    }
  }, {
    key: "done",
    value: function done(type) {
      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      var listenerList = this._listenerMap[type];
      if (!listenerList) {
        this._listenerMap[type] = listenerList = {
          args: args,
          cbs: []
        };
      }
      var cbs = listenerList.cbs;
      var count = cbs.length;
      _emit.apply(this, arguments);

      listenerList.args = args;
      listenerList.cbs = cbs.slice(count);
    }
  }, {
    key: "undo",
    value: function undo(type) {
      var listenerList = this._listenerMap[type];
      if (!listenerList) {
        return false;
      }
      listenerList.args = null;
    }
  }]);

  return Event;
}();

exports.default = Event;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/EventBus.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/Event.js");

var _Event2 = _interopRequireDefault(_Event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventBus = new _Event2.default();

exports.default = EventBus;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/KEY.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/config.js");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEY = {
  computed: '_cmlComputed',
  wx: {
    props: 'properties'
  },
  alipay: {
    props: 'props'
  },
  baidu: {
    props: 'properties'
  },
  qq: {
    props: 'properties'
  }
};

exports.default = new _config2.default(KEY);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/clone.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.deepClone = deepClone;

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find(list, f) {
  return list.filter(f)[0];
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
function deepClone(obj) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // just return if obj is immutable value
  if ((0, _type.type)(obj) !== 'Object' && (0, _type.type)(obj) !== 'Array') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) {
    return c.original === obj;
  });
  if (hit) {
    return hit.copy;
  }

  var copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepClone
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepClone(obj[key], cache);
  });

  return copy;
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/config.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config(data) {
    _classCallCheck(this, Config);

    this.data = data;
  }

  _createClass(Config, [{
    key: 'get',
    value: function get() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var def = arguments[1];

      var result = this.data;
      path.split('.').forEach(function (key) {
        if (key && typeof result !== 'undefined') {
          result = result[key];
        }
      });
      if (typeof result !== 'undefined') {
        return result;
      } else {
        return def;
      }
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      if (typeof value === 'undefined') {
        this.data = path;
      } else {
        path = String(path || '').trim();
        if (path) {
          var paths = path.split('.');
          var last = paths.pop();
          var data = this.data || {};
          paths.forEach(function (key) {
            var type = data[key];
            if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
              data = data[key];
            } else if (typeof type === 'undefined') {
              data = data[key] = {};
            } else {
              throw new Error('forbidden to set property[' + key + '] of [' + type + '] data');
            }
          });
          data[last] = value;
        }
      }
    }
  }]);

  return Config;
}();

exports.default = Config;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/debug.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tip = exports.warn = undefined;

var _util = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/util.js");

var warn = exports.warn = _util.noop;
var tip = exports.tip = _util.noop;

if (true) {
  var hasConsole = typeof console !== 'undefined';

  exports.warn = warn = function warn(msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (hasConsole) {
      console.error('[CML warn]: ' + msg + trace);
    }
  };

  exports.tip = tip = function tip(msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (hasConsole) {
      console.error('[CML tip]: ' + msg + trace);
    }
  };
}

function generateComponentTrace(vm) {
  return '';
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/diff.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diff;

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

function diff(current, old) {
  var out = {};
  prefill(current, old);
  iDiff(current, old, '', out);

  if (Object.keys(out).length === 1 && out[''] !== undefined) {
    out = out[''];
  }

  // console.log('diff------:', out)
  return out;
}

function prefill(current, old) {
  if (_mobx.comparer.structural(current, old)) return;

  if ((0, _type.type)(current) === 'Object' && (0, _type.type)(old) === 'Object') {
    var curLength = Object.keys(current).length;
    var oldLength = Object.keys(old).length;

    if (curLength >= oldLength) {
      for (var key in old) {
        var curVal = current[key];
        if (curVal === undefined) {
          current[key] = '';
        } else {
          prefill(curVal, old[key]);
        }
      }
    }
  } else if ((0, _type.type)(current) === 'Array' && (0, _type.type)(old) === 'Array') {
    if (current.length >= old.length) {
      old.forEach(function (item, index) {
        prefill(current[index], item);
      });
    }
  }
}

function iDiff(current, old, path, result) {
  if (_mobx.comparer.structural(current, old)) return;

  if ((0, _type.type)(current) === 'Object' && (0, _type.type)(old) === 'Object') {
    var curLength = Object.keys(current).length;
    var oldLength = Object.keys(old).length;

    if (curLength >= oldLength) {
      for (var key in current) {
        var curVal = current[key];
        var oldVal = old[key];

        iDiff(curVal, oldVal, getPath(path, key), result);
      }
    } else {
      update(current, path, result);
    }
  } else if ((0, _type.type)(current) === 'Array' && (0, _type.type)(old) === 'Array' && current.length >= old.length) {
    current.forEach(function (item, index) {
      iDiff(item, old[index], getPath(path, index, 'array'), result);
    });
  } else {
    update(current, path, result);
  }
}

function update(item, path, collection) {
  if (item !== undefined) {
    collection[path] = item;
  }
}

function getPath(pathStr, key, type) {
  if (type === 'array') {
    return pathStr + '[' + key + ']';
  }

  return pathStr ? pathStr + '.' + key : key;
}

function isNaN(value) {
  var n = Number(value);
  return n !== n;
}

function isNum(value) {
  return !isNaN(Number(value));
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/lifecycle.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/config.js");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIFECYCLE = {
  web: {
    hooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch', 'beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate'],
    usedHooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed'],
    hooksMap: {
      // 'onShow': 'beforeRouteEnter',
      // 'onHide': 'beforeRouteLeave'
    },
    polyHooks: ['activated', 'deactivated', 'errorCaptured', 'serverPrefetch', 'beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate']
  },
  weex: {
    hooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'],
    usedHooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed'],
    hooksMap: {},
    polyHooks: ['viewappear', 'viewdisappear']
  },
  wx: {
    app: {
      hooks: ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'],
      hooksMap: {
        'beforeCreate': 'onLaunch',
        'created': 'onLaunch',
        'beforeMount': 'onLaunch',
        'mounted': 'onShow',
        'beforeDestroy': 'onHide',
        'destroyed': 'onHide'
      },
      usedHooks: ['onLaunch', 'onShow', 'onHide'],
      polyHooks: ['onError', 'onPageNotFound']
    },
    page: {
      hooks: ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'],
      hooksMap: {
        'beforeCreate': 'onLoad',
        'created': 'onLoad',
        'beforeMount': 'onLoad',
        'mounted': 'onReady',
        'beforeDestroy': 'onUnload',
        'destroyed': 'onUnload',
        'onShow': 'onShow',
        'onHide': 'onHide'
      },
      usedHooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'],
      polyHooks: ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap']
    },
    component: {
      hooks: ['created', 'attached', 'ready', 'detached', 'moved'],
      hooksMap: {
        'beforeCreate': 'created',
        'created': 'attached',
        'beforeMount': 'attached',
        'mounted': 'ready',
        'beforeDestroy': 'detached',
        'destroyed': 'detached'
      },
      usedHooks: ['created', 'attached', 'ready', 'detached'],
      polyHooks: ['moved']
    }
  },
  alipay: {
    app: {
      hooks: ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'],
      hooksMap: {
        'beforeCreate': 'onLaunch',
        'created': 'onLaunch',
        'beforeMount': 'onLaunch',
        'mounted': 'onShow',
        'beforeDestroy': 'onHide',
        'destroyed': 'onHide'
      },
      usedHooks: ['onLaunch', 'onShow', 'onHide'],
      polyHooks: ['onError', 'onPageNotFound']
    },
    page: {
      hooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onTitleClick', 'onPageScroll', 'onTabItemTap', 'onOptionMenuClick', 'onPopMenuClick', 'onPullIntercept'],
      hooksMap: {
        'beforeCreate': 'onLoad',
        'created': 'onLoad',
        'beforeMount': 'onLoad',
        'mounted': 'onReady',
        'beforeDestroy': 'onUnload',
        'destroyed': 'onUnload',
        'onShow': 'onShow',
        'onHide': 'onHide'
      },
      usedHooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'],
      polyHooks: ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onTitleClick', 'onPageScroll', 'onTabItemTap', 'onOptionMenuClick', 'onPopMenuClick', 'onPullIntercept']
    },
    component: {
      hooks: ['didMount', 'didUnmount'],
      hooksMap: {
        'beforeCreate': 'didMount',
        'created': 'didMount',
        'beforeMount': 'didMount',
        'mounted': 'didMount',
        'beforeDestroy': 'didUnmount',
        'destroyed': 'didUnmount'
      },
      usedHooks: ['didMount', 'didUnmount'],
      polyHooks: []
    }
  },
  baidu: {
    app: {
      hooks: ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'],
      hooksMap: {
        'beforeCreate': 'onLaunch',
        'created': 'onLaunch',
        'beforeMount': 'onLaunch',
        'mounted': 'onShow',
        'beforeDestroy': 'onHide',
        'destroyed': 'onHide'
      },
      usedHooks: ['onLaunch', 'onShow', 'onHide'],
      polyHooks: ['onError', 'onPageNotFound']
    },
    page: {
      hooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onForceReLaunch', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap'],
      hooksMap: {
        'beforeCreate': 'onLoad',
        'created': 'onLoad',
        'beforeMount': 'onLoad',
        'mounted': 'onReady',
        'beforeDestroy': 'onUnload',
        'destroyed': 'onUnload',
        'onShow': 'onShow',
        'onHide': 'onHide'
      },
      usedHooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'],
      polyHooks: ['onForceReLaunch', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']
    },
    component: {
      hooks: ['created', 'attached', 'ready', 'detached'],
      hooksMap: {
        'beforeCreate': 'created',
        'created': 'attached',
        'beforeMount': 'attached',
        'mounted': 'ready',
        'beforeDestroy': 'detached',
        'destroyed': 'detached'
      },
      usedHooks: ['created', 'attached', 'ready', 'detached'],
      polyHooks: []
    }
  },
  qq: {
    app: {
      hooks: ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'],
      hooksMap: {
        'beforeCreate': 'onLaunch',
        'created': 'onLaunch',
        'beforeMount': 'onLaunch',
        'mounted': 'onShow',
        'beforeDestroy': 'onHide',
        'destroyed': 'onHide'
      },
      usedHooks: ['onLaunch', 'onShow', 'onHide'],
      polyHooks: ['onError', 'onPageNotFound']
    },
    page: {
      hooks: ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'],
      hooksMap: {
        'beforeCreate': 'onLoad',
        'created': 'onLoad',
        'beforeMount': 'onLoad',
        'mounted': 'onReady',
        'beforeDestroy': 'onUnload',
        'destroyed': 'onUnload',
        'onShow': 'onShow',
        'onHide': 'onHide'
      },
      usedHooks: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'],
      polyHooks: ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap']
    },
    component: {
      hooks: ['created', 'attached', 'ready', 'detached', 'moved'],
      hooksMap: {
        'beforeCreate': 'created',
        'created': 'attached',
        'beforeMount': 'attached',
        'mounted': 'ready',
        'beforeDestroy': 'detached',
        'destroyed': 'detached'
      },
      usedHooks: ['created', 'attached', 'ready', 'detached'],
      polyHooks: ['moved']
    }
  },
  cml: {
    hooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'onShow', 'onHide']
  }
};

exports.default = new _config2.default(LIFECYCLE);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/proto.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyProtoProperty = copyProtoProperty;
exports.defineGetterSetter = defineGetterSetter;
/**
 * 原型上的方法放到对象上
 * @param  {Object} obj   待添加属性对象
 * @param  {Object} proto 差异方法
 * @return {Object}       修改后值
 */
function copyProtoProperty() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var EXPORT_OBJ = obj;
  var EXPORT_PROTO = EXPORT_OBJ.__proto__;

  if (EXPORT_PROTO.constructor !== Object) {
    Object.getOwnPropertyNames(EXPORT_PROTO).forEach(function (key) {
      if (!/constructor|prototype|length/ig.test(key)) {
        //原型上有自身没有的属性 放到自身上
        if (!EXPORT_OBJ.hasOwnProperty(key)) {
          EXPORT_OBJ[key] = EXPORT_PROTO[key];
        }
      }
    });
  }

  return EXPORT_OBJ;
}

function defineGetterSetter(target, key, getValue, setValue, context) {
  var get = void 0;
  var set = void 0;
  if (typeof getValue === 'function') {
    get = context ? getValue.bind(context) : getValue;
  } else {
    get = function get() {
      return getValue;
    };
  }
  if (typeof setValue === 'function') {
    set = context ? setValue.bind(context) : setValue;
  }
  var descriptor = {
    get: get,
    configurable: true,
    enumerable: true
  };
  if (set) descriptor.set = set;
  Object.defineProperty(target, key, descriptor);
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/resolve.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDefault = mergeDefault;
exports.mergeHooks = mergeHooks;
exports.mergeSimpleProps = mergeSimpleProps;
exports.mergeData = mergeData;
exports.mergeWatch = mergeWatch;

var _util = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/util.js");

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

function mergeDefault(parent, child, key) {
  parent[key] = child[key];
}

function mergeHooks(parent, child, key) {

  var hasKeyParent = parent.hasOwnProperty(key);
  var isArrayChild = (0, _type.type)(child[key]) === 'Array';

  if (!hasKeyParent && !isArrayChild) {
    parent[key] = [child[key]];
  } else if (!hasKeyParent && isArrayChild) {
    parent[key] = child[key];
  } else if (hasKeyParent && !isArrayChild) {
    parent[key].push(child[key]);
  } else if (hasKeyParent && isArrayChild) {
    parent[key] = parent[key].concat(child[key]);
  }
}

function mergeSimpleProps(parent, child, key) {
  var parentVal = parent[key];
  var childVal = child[key];
  if (!parentVal) {
    parent[key] = parentVal = {};
  }
  (0, _util.extend)(parentVal, childVal);
}

function mergeData(parent, child, key) {
  var childVal = child[key];
  if (!parent[key]) {
    parent[key] = {};
  }
  (0, _util.merge)(parent[key], childVal);
}

function mergeWatch(parent, child, key) {
  var parentVal = parent[key];
  var childVal = child[key];
  var ret = [];
  if (!parentVal) {
    parent[key] = parentVal = {};
  }
  Object.keys(childVal).forEach(function (key) {
    if (key in parentVal) {
      parentVal[key] = (0, _type.type)(parentVal[key]) !== 'Array' ? [parentVal[key], childVal[key]] : parentVal[key].concat([childVal[key]]);
    } else {
      parentVal[key] = childVal[key];
    }
  });
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/style.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.styleHandle = styleHandle;
exports.pxTransform = pxTransform;

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

function styleHandle(source) {
  var detectCycles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var __alreadySeen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  function cache(value) {
    if (detectCycles) {
      __alreadySeen.push([source, value]);
    }
    return value;
  }

  if (detectCycles && __alreadySeen === null) {
    __alreadySeen = [];
  }

  if (detectCycles && source !== null && (typeof source === 'undefined' ? 'undefined' : _typeof(source)) === "object") {
    for (var i = 0, l = __alreadySeen.length; i < l; i++) {
      if (__alreadySeen[i][0] === source) {
        return __alreadySeen[i][1];
      }
    }
  }

  if ((0, _type.type)(source) === 'Array') {
    var res = cache([]);
    var toAdd = source.map(function (value) {
      return styleHandle(value, detectCycles, __alreadySeen);
    });

    res.length = toAdd.length;
    for (var _i = 0, _l = toAdd.length; _i < _l; _i++) {
      res[_i] = toAdd[_i];
    }

    return res;
  } else if ((0, _type.type)(source) === 'Object') {
    var _res = cache({});
    for (var key in source) {
      _res[key] = styleHandle(source[key], detectCycles, __alreadySeen);
    }
    return _res;
  } else if ((0, _type.type)(source) === 'String') {
    return pxTransform(source);
  } else {
    return source;
  }
}

function pxTransform(s) {
  if (!~s.indexOf('cpx')) {
    return s;
  }

  return s.replace(/(([\s:(]|^)-?)(\d*\.?\d+)cpx/ig, function (m) {
    return m.replace('cpx', 'rpx');
  });
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/toJS.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = toJS;

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _style = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/style.js");

function toJS(source) {
  var detectCycles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var __alreadySeen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var needPxTransfer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  function cache(value) {
    if (detectCycles) {
      __alreadySeen.push([source, value]);
    }
    return value;
  }

  if (detectCycles && __alreadySeen === null) {
    __alreadySeen = [];
  }

  if (detectCycles && source !== null && (typeof source === 'undefined' ? 'undefined' : _typeof(source)) === "object") {
    for (var _i = 0, _l = __alreadySeen.length; _i < _l; _i++) {
      if (__alreadySeen[_i][0] === source) {
        return __alreadySeen[_i][1];
      }
    }
  }

  if ((0, _mobx.isObservable)(source)) {
    if ((0, _mobx.isObservableArray)(source)) {
      var res = cache([]);
      var toAdd = source.map(function (value) {
        return toJS(value, detectCycles, __alreadySeen);
      });
      res.length = toAdd.length;
      for (var i = 0, l = toAdd.length; i < l; i++) {
        res[i] = toAdd[i];
      }return res;
    }
    if ((0, _mobx.isObservableObject)(source)) {
      var res = cache({});
      for (var key in source) {
        res[key] = toJS(source[key], detectCycles, __alreadySeen);
      }return res;
    }
    if ((0, _mobx.isObservableMap)(source)) {
      var res_1 = cache({});
      source.forEach(function (value, key) {
        return res_1[key] = toJS(value, detectCycles, __alreadySeen);
      });
      return res_1;
    }
    if ((0, _mobx.isBoxedObservable)(source)) return toJS(source.get(), detectCycles, __alreadySeen);
  } else {
    if ((0, _type.type)(source) === 'Array') {
      var _res = cache([]);
      var _toAdd = source.map(function (value) {
        return toJS(value, detectCycles, __alreadySeen);
      });

      _res.length = _toAdd.length;
      for (var _i2 = 0, _l2 = _toAdd.length; _i2 < _l2; _i2++) {
        _res[_i2] = _toAdd[_i2];
      }

      return _res;
    } else if ((0, _type.type)(source) === 'Object') {
      var _res2 = cache({});
      for (var _key in source) {
        _res2[_key] = toJS(source[_key], detectCycles, __alreadySeen);
      }
      return _res2;
    } else if ((0, _type.type)(source) === 'String') {
      // cpx to rpx
      return needPxTransfer ? (0, _style.pxTransform)(source) : source;
    } else {
      return source;
    }
  }
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/type.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.type = type;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isDef = isDef;
exports.isPromise = isPromise;

var toString = Object.prototype.toString;

function type(n) {
  return toString.call(n).slice(8, -1);
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return type(obj) === 'Object';
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isPromise(v) {
  return isDef(v) && typeof v.then === 'function' && typeof v.catch === 'function';
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/util.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.hasOwn = hasOwn;
exports.noop = noop;
exports.propToFn = propToFn;
exports.transferLifecycle = transferLifecycle;
exports.rename = rename;
exports.normalizeMap = normalizeMap;
exports.merge = merge;
exports.extend = extend;
exports.extendWithIgnore = extendWithIgnore;
exports.isExistAttr = isExistAttr;
exports.parsePath = parsePath;
exports.getByPath = getByPath;
exports.enumerable = enumerable;
exports.proxy = proxy;
exports.deleteProperties = deleteProperties;
exports.enumerableKeys = enumerableKeys;

var _type = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/type.js");

var _clone = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/clone.js");

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

// transfer 对象的`${name}`属性值 to function
function propToFn(obj, name) {
  if (obj && (0, _type.isObject)(obj[name])) {
    var _temp = obj[name];

    obj[name] = function () {
      return (0, _clone.deepClone)(_temp);
    };
  }
}

/**
 * 生命周期映射
 * @param  {Object} options options
 * @param  {Object} hooksMap 映射表
 * @return {Object}     修改后值
 */
function transferLifecycle(options, hooksMap) {
  if (!hooksMap) {
    return;
  }

  var _hooksTemp = [];
  var _mapTemp = {};
  // 将生命周期 键名 处理成 [`$_${key}`]
  Object.keys(hooksMap).forEach(function (key) {
    var uniKey = '$_' + key;
    _hooksTemp.push(uniKey);
    _mapTemp[uniKey] = hooksMap[key];

    if (hasOwn(options, key)) {
      options[uniKey] = options[key];
      delete options[key];
    }
  });

  _hooksTemp.forEach(function (uniKey) {
    var mapKey = _mapTemp[uniKey];
    var hook = options[uniKey];
    !Array.isArray(hook) && (hook = [hook]);

    if (hasOwn(options, uniKey) && mapKey && hook) {
      if (hasOwn(options, mapKey)) {
        !Array.isArray(options[mapKey]) && (options[mapKey] = [options[mapKey]]);

        options[mapKey] = options[mapKey].concat(hook);
      } else {
        options[mapKey] = hook;
      }
      delete options[uniKey];
    }
  });
}

/**
 * 对象键名重定义
 * @param  {Object} obj     对象
 * @param  {String} oldKey    原键名
 * @param  {String} newKey 新键名
 * @return {Object}         新对象
 */
function rename(obj, oldKey, newKey) {
  Object.getOwnPropertyNames(obj).forEach(function (key) {
    if (key === oldKey) {
      obj[newKey] = obj[key];
      delete obj[key];
      return obj;
    }
  });
  return obj;
}

function normalizeMap(arr) {
  if ((0, _type.type)(arr) === 'Array') {
    var map = {};
    arr.forEach(function (value) {
      map[value] = value;
    });
    return map;
  }
  return arr;
}

function merge(to, from) {
  if (!from) return to;
  var key = void 0,
      toVal = void 0,
      fromVal = void 0;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if ((0, _type.type)(toVal) === 'Object' && (0, _type.type)(fromVal) === 'Object') {
      merge(toVal, fromVal);
    } else {
      to[key] = fromVal;
    }
  }
  return to;
}

function extend() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  for (var _len = arguments.length, froms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    froms[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = froms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var from = _step.value;

      if ((0, _type.type)(from) === 'Object') {
        // for in 能遍历原型链上的属性
        for (var key in from) {
          target[key] = from[key];
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return target;
}

function extendWithIgnore(target, from) {
  var ignore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if ((0, _type.type)(from) === 'Object') {
    // for in 能遍历原型链上的属性
    for (var key in from) {
      if (!~ignore.indexOf(key)) {
        target[key] = from[key];
      }
    }
  }
  return target;
}

function isExistAttr(obj, attr) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  var isNullOrUndefined = obj === null || obj === undefined;
  if (isNullOrUndefined) {
    return false;
  } else if (type === 'object' || type === 'function') {
    return attr in obj;
  } else {
    return obj[attr] !== undefined;
  }
}

function parsePath(path) {
  return function (obj) {
    return getByPath(obj, path);
  };
}

function getByPath(data, path, notExistOutput) {
  if (!path) return data;
  var segments = path.split('.');
  var notExist = false;
  var value = data;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      if (isExistAttr(value, key)) {
        value = value[key];
      } else {
        value = undefined;
        notExist = true;
        break;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (notExistOutput) {
    return notExist ? notExistOutput : value;
  } else {
    // 小程序setData时不允许undefined数据
    return value === undefined ? '' : value;
  }
}

function enumerable(target, keys) {
  keys.forEach(function (key) {
    var descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (!descriptor.enumerable) {
      descriptor.enumerable = true;
      Object.defineProperty(target, key, descriptor);
    }
  });
  return target;
}

function proxy(target, source, mapKeys, readonly) {
  if (typeof mapKeys === 'boolean') {
    readonly = mapKeys;
    mapKeys = null;
  }
  enumerableKeys(source).forEach(function (key, index) {
    var descriptor = {
      get: function get() {
        return source[key];
      },

      configurable: true,
      enumerable: true
    };
    !readonly && (descriptor.set = function (val) {
      source[key] = val;
    });
    Object.defineProperty(target, mapKeys ? mapKeys[index] : key, descriptor);
  });
  return target;
}

function deleteProperties(source) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!props.length) return source;
  var sourceKeys = Object.keys(source);
  var newData = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = sourceKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      if (props.indexOf(key) < 0) {
        newData[key] = source[key];
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return newData;
}

function enumerableKeys(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/common/util/warn.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fail = fail;
exports.invariant = invariant;
exports.deprecated = deprecated;
var OBFUSCATED_ERROR = exports.OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is an production build.";

function fail(message) {
    invariant(false, message);
    throw "X"; // unreachable
}

function invariant(check, message) {
    if (!check) throw new Error("[chameleon-runtime] " + (message || OBFUSCATED_ERROR));
}

/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */
var deprecatedMessages = [];

function deprecated(msg, thing) {
    if (false) return false;
    if (thing) {
        return deprecated("'" + msg + "', use '" + thing + "' instead.");
    }
    if (deprecatedMessages.indexOf(msg) !== -1) return false;
    deprecatedMessages.push(msg);
    console.error("[chameleon-runtime] Deprecated: " + msg);
    return true;
}

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/core/VmAdapter.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MiniVmAdapter2 = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/MiniVmAdapter.js");

var _MiniVmAdapter3 = _interopRequireDefault(_MiniVmAdapter2);

var _wxMixins = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/chameleon-mixins/wx-mixins.js");

var _wxMixins2 = _interopRequireDefault(_wxMixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VmAdapter = function (_MiniVmAdapter) {
  _inherits(VmAdapter, _MiniVmAdapter);

  function VmAdapter(config) {
    _classCallCheck(this, VmAdapter);

    var _this = _possibleConstructorReturn(this, (VmAdapter.__proto__ || Object.getPrototypeOf(VmAdapter)).call(this, config));

    _this.platform = 'qq';
    // 样式、事件代理 mixins
    _this.baseMixins = _wxMixins2.default.mixins;
    _this.init();
    return _this;
  }

  return VmAdapter;
}(_MiniVmAdapter3.default);

exports.default = VmAdapter;

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/instance/index.js");

Object.defineProperty(exports, 'App', {
  enumerable: true,
  get: function get() {
    return _instance.App;
  }
});
Object.defineProperty(exports, 'Page', {
  enumerable: true,
  get: function get() {
    return _instance.Page;
  }
});
Object.defineProperty(exports, 'Component', {
  enumerable: true,
  get: function get() {
    return _instance.Component;
  }
});

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/instance/app.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

var _BaseCtor2 = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/BaseCtor.js");

var _BaseCtor3 = _interopRequireDefault(_BaseCtor2);

var _lifecycle = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/lifecycle.js");

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _VmAdapter = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/core/VmAdapter.js");

var _VmAdapter2 = _interopRequireDefault(_VmAdapter);

var _MiniRuntimeCore = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/MiniRuntimeCore.js");

var _MiniRuntimeCore2 = _interopRequireDefault(_MiniRuntimeCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = exports.App = function (_BaseCtor) {
  _inherits(App, _BaseCtor);

  function App(options) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, options));

    _this.cmlType = 'qq';

    var runtimeCore = new _MiniRuntimeCore2.default({
      polyHooks: _lifecycle2.default.get('qq.app.polyHooks'),
      platform: _this.cmlType,
      options: _this.options
    });

    _this.initVmAdapter(_VmAdapter2.default, {
      type: 'app',
      runtimeMixins: {
        onLaunch: function onLaunch() {
          // 初始化
          runtimeCore.setContext(this).init().start('app-view-render');
        }
      },
      needResolveAttrs: ['methods'],
      hooks: _lifecycle2.default.get('qq.app.hooks'),
      hooksMap: _lifecycle2.default.get('qq.app.hooksMap'),
      polyHooks: _lifecycle2.default.get('qq.app.polyHooks'),
      usedHooks: _lifecycle2.default.get('qq.app.usedHooks')
    });

    runtimeCore.setOptions(_this.options);

    __CML__GLOBAL.App(_this.options);
    return _this;
  }

  return App;
}(_BaseCtor3.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/instance/component.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _BaseCtor2 = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/BaseCtor.js");

var _BaseCtor3 = _interopRequireDefault(_BaseCtor2);

var _lifecycle = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/lifecycle.js");

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _VmAdapter = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/core/VmAdapter.js");

var _VmAdapter2 = _interopRequireDefault(_VmAdapter);

var _MiniRuntimeCore = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/MiniRuntimeCore.js");

var _MiniRuntimeCore2 = _interopRequireDefault(_MiniRuntimeCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = exports.Component = function (_BaseCtor) {
  _inherits(Component, _BaseCtor);

  function Component(options) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, options));

    _this.cmlType = 'qq';

    var runtimeCore = new _MiniRuntimeCore2.default({
      polyHooks: _lifecycle2.default.get('qq.component.polyHooks'),
      platform: _this.cmlType,
      options: _this.options
    });

    _this.initVmAdapter(_VmAdapter2.default, {
      type: 'component',
      runtimeMixins: {
        created: function created() {
          // 初始化
          runtimeCore.setContext(this).init();
        },
        attached: function attached() {
          runtimeCore.setContext(this).start('component-view-render');
        },
        ready: function ready() {},
        detached: function detached() {
          // stop
          runtimeCore.setContext(this).destory();
        }
      },
      hooks: _lifecycle2.default.get('qq.component.hooks'),
      hooksMap: _lifecycle2.default.get('qq.component.hooksMap'),
      polyHooks: _lifecycle2.default.get('qq.component.polyHooks'),
      usedHooks: _lifecycle2.default.get('qq.component.usedHooks'),
      needPropsHandler: true,
      needTransformProperties: true
    });

    _this.options['options'] = {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    };

    runtimeCore.setOptions(_this.options);

    __CML__GLOBAL.Component(_this.options);
    return _this;
  }

  return Component;
}(_BaseCtor3.default);

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/instance/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/instance/app.js");

Object.defineProperty(exports, 'App', {
  enumerable: true,
  get: function get() {
    return _app.App;
  }
});

var _page = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/instance/page.js");

Object.defineProperty(exports, 'Page', {
  enumerable: true,
  get: function get() {
    return _page.Page;
  }
});

var _component = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/instance/component.js");

Object.defineProperty(exports, 'Component', {
  enumerable: true,
  get: function get() {
    return _component.Component;
  }
});

/***/ }),

/***/ "./node_modules/chameleon-runtime/src/platform/qq/instance/page.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = undefined;

var _BaseCtor2 = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/BaseCtor.js");

var _BaseCtor3 = _interopRequireDefault(_BaseCtor2);

var _lifecycle = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/util/lifecycle.js");

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _VmAdapter = __webpack_require__("./node_modules/chameleon-runtime/src/platform/qq/core/VmAdapter.js");

var _VmAdapter2 = _interopRequireDefault(_VmAdapter);

var _MiniRuntimeCore = __webpack_require__("./node_modules/chameleon-runtime/src/platform/common/proto/MiniRuntimeCore.js");

var _MiniRuntimeCore2 = _interopRequireDefault(_MiniRuntimeCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Page = exports.Page = function (_BaseCtor) {
  _inherits(Page, _BaseCtor);

  function Page(options) {
    _classCallCheck(this, Page);

    var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, options));

    _this.cmlType = 'qq';

    var runtimeCore = new _MiniRuntimeCore2.default({
      polyHooks: _lifecycle2.default.get('qq.page.polyHooks'),
      platform: _this.cmlType,
      options: _this.options
    });

    _this.initVmAdapter(_VmAdapter2.default, {
      options: _this.options,
      type: 'page',
      runtimeMixins: {
        onLoad: function onLoad() {
          // 初始化
          runtimeCore.setContext(this).init().start('page-view-render');
        },
        onUnload: function onUnload() {
          // stop
          runtimeCore.setContext(this).destory();
        },
        onPullDownRefresh: function onPullDownRefresh() {
          var path = this.route;

          this.$cmlEventBus.emit(path + '_onPullDownRefresh', {
            path: path
          });
        },
        onReachBottom: function onReachBottom() {
          var path = this.route;

          this.$cmlEventBus.emit(path + '_onReachBottom', {
            path: path
          });
        }
      },
      needResolveAttrs: ['methods'],
      hooks: _lifecycle2.default.get('qq.page.hooks'),
      hooksMap: _lifecycle2.default.get('qq.page.hooksMap'),
      polyHooks: _lifecycle2.default.get('qq.page.polyHooks'),
      usedHooks: _lifecycle2.default.get('qq.page.usedHooks')
    });

    runtimeCore.setOptions(_this.options);

    __CML__GLOBAL.Page(_this.options);
    return _this;
  }

  return Page;
}(_BaseCtor3.default);

/***/ }),

/***/ "./node_modules/chameleon-store/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__("./node_modules/chameleon-store/src/interfaces/createStore/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _index2.default;

/***/ }),

/***/ "./node_modules/chameleon-store/src/interfaces/createStore/index.interface":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qq = __webpack_require__("./node_modules/chameleon-store/src/platform/qq/index.js");

var _qq2 = _interopRequireDefault(_qq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __INTERFACE__FILEPATH = "/Users/gongzhen/workspace/_umeng/web/quick-app-sdk/demo/chameleon/node_modules/chameleon-store/src/interfaces/createStore/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {},
  "interfaces": {
    "createStoreInterface": {
      "createStore": {
        "input": ["CMLObject"],
        "output": "CMLObject"
      }
    }
  },
  "classes": {
    "Method": ["createStoreInterface"]
  }
};
var __OBJECT__WRAPPER__ = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/checkWrapper.js");
// 定义模块的interface

var Method = function () {
  function Method() {
    _classCallCheck(this, Method);
  }

  _createClass(Method, [{
    key: "createStore",
    value: function createStore(options) {
      return (0, _qq2.default)(options);
    }
  }]);

  return Method;
}();

exports.default = __OBJECT__WRAPPER__(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


var copyProtoProperty = __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/mvvm-interface-parser/runtime/copyProto.js");
copyProtoProperty(exports.default);

/***/ }),

/***/ "./node_modules/chameleon-store/src/interfaces/createStore/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _index = __webpack_require__("./node_modules/chameleon-store/src/interfaces/createStore/index.interface");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStore(options) {
  return _index2.default.createStore(options);
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/common/mini/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

var _util = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/util.js");

var _mapStore = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/mapStore.js");

var _mapStore2 = _interopRequireDefault(_mapStore);

var _transform = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/transform.js");

var _merge = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/merge.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Store(options) {
  options = (0, _merge.mergeDeps)(options);
  this.getters = {};
  this.mutations = {};
  this.actions = {};
  this.state = this.registerModule('', options).state;
  Object.assign(this, (0, _mapStore2.default)(this));
}

Store.prototype.dispatch = function (type) {
  var action = (0, _util.getByPath)(this.actions, type);
  if (!action) {
    return Promise.reject(new Error('unknown action type: ' + type));
  } else {
    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      payload[_key - 1] = arguments[_key];
    }

    return action.apply(undefined, payload);
  }
};

Store.prototype.commit = function (type) {
  var mutation = (0, _util.getByPath)(this.mutations, type);
  if (!mutation) {
    console.warn(new Error('unknown mutation type: ' + type));
  } else {
    for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      payload[_key2 - 1] = arguments[_key2];
    }

    return mutation.apply(undefined, payload);
  }
};

Store.prototype.registerModule = function (path, module) {
  var _this = this;

  var reactiveModuleOption = {
    state: module.state || {}
  };
  var reactiveModule = (0, _mobx.observable)(reactiveModuleOption);
  if (module.getters) {
    (0, _mobx.extendObservable)(reactiveModule, {
      getters: (0, _transform.transformGetters)(module.getters, reactiveModule, this)
    });
    // 使用proxy，保证store.getters的属性是可观察的
    (0, _util.proxy)(this.getters, reactiveModule.getters, Object.keys(module.getters), true);
  }
  if (module.mutations) {
    Object.assign(this.mutations, (0, _transform.transformMutations)(module.mutations, reactiveModule, this));
  }
  if (module.actions) {
    Object.assign(this.actions, (0, _transform.transformActions)(module.actions, reactiveModule, this));
  }
  if (module.modules) {
    var childs = module.modules;
    Object.keys(childs).forEach(function (key) {
      (0, _mobx.extendObservable)(reactiveModule.state, _defineProperty({}, key, _this.registerModule('', childs[key]).state));
    });
  }
  return reactiveModule;
};

function createStore() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(Store, [null].concat(args)))();
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/common/mini/mapStore.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store) {
  return {
    mapGetters: mapFactory('getters', store),
    mapMutations: mapFactory('mutations', store),
    mapActions: mapFactory('actions', store),
    mapState: function mapState(maps) {
      maps = (0, _util.normalizeMap)(maps);
      var result = {};
      Object.keys(maps).forEach(function (key) {
        var value = maps[key];
        result[key] = function () {
          if (typeof value === 'function') {
            return value.call(this, store.state, store.getters);
          } else if (typeof value === 'string') {
            return (0, _util.getByPath)(store.state, value);
          }
        };
      });
      return result;
    }
  };
};

var _util = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/util.js");

function mapFactory(type, store) {
  return function (maps) {
    maps = (0, _util.normalizeMap)(maps);
    var result = {};

    var _loop = function _loop(key) {
      result[key] = function (payload) {
        var value = maps[key];
        if (type === 'mutations') {
          return store.commit(value, payload);
        } else if (type === 'actions') {
          return store.dispatch(value, payload);
        } else {
          var getterVal = (0, _util.getByPath)(store.getters, value, '__NOTFOUND__');
          if (getterVal === '__NOTFOUND__') {
            console.warn(new Error('not found getter named [' + value + ']'));
            return '';
          } else {
            return getterVal === undefined ? '' : getterVal;
          }
        }
      };
    };

    for (var key in maps) {
      _loop(key);
    }
    return result;
  };
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/common/mini/merge.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDeps = mergeDeps;
function mergeDeps(options) {
  var stores = options.deps;
  if (!stores) return options;
  var mergeProps = ['state', 'getters', 'mutations', 'actions'];
  Object.keys(stores).forEach(function (key) {
    var store = stores[key];
    mergeProps.forEach(function (prop) {
      if (options[prop] && key in options[prop]) {
        console.warn(new Error('deps\'s name: [' + key + '] conflicts with ' + prop + '\'s key in current options'));
      } else {
        options[prop] = options[prop] || {};
        options[prop][key] = store[prop];
      }
    });
  });
  delete options.deps;
  return options;
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/common/mini/transform.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformGetters = transformGetters;
exports.transformMutations = transformMutations;
exports.transformActions = transformActions;

var _mobx = __webpack_require__("./node_modules/mobx/lib/mobx.module.js");

var _util = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/util.js");

function transformGetters(getters, module, store) {
  var newGetters = {};

  var _loop = function _loop(key) {
    if (key in store.getters) {
      console.warn('【chameleon-store ERROR】', new Error('duplicate getter type: ' + key));
    }

    (0, _util.defineGetterSetter)(newGetters, key, function () {
      if (store.withThis) {
        return getters[key].call({
          state: module.state,
          getters: module.getters,
          rootState: store.state
        });
      }
      return getters[key](module.state, store.getters, store.state);
    });
  };

  for (var key in getters) {
    _loop(key);
  }
  return newGetters;
}

function transformMutations(mutations, module, store) {
  var newMutations = {};

  var _loop2 = function _loop2(key) {
    if (store.mutations[key]) {
      console.warn(new Error('duplicate mutation type: ' + key));
    }
    newMutations[key] = typeof mutations[key] === 'function' ? (0, _mobx.action)(function () {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      return mutations[key].apply(mutations, [module.state].concat(payload));
    }) : mutations[key];
  };

  for (var key in mutations) {
    _loop2(key);
  }
  return newMutations;
}

function transformActions(actions, module, store) {
  var newActions = {};

  var _loop3 = function _loop3(key) {
    if (store.actions[key]) {
      console.warn(new Error('duplicate action type: ' + key));
    }
    newActions[key] = typeof actions[key] === 'function' ? function () {
      for (var _len2 = arguments.length, payload = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        payload[_key2] = arguments[_key2];
      }

      return Promise.resolve().then(function () {
        return actions[key].apply(actions, [{
          rootState: store.state,
          state: module.state,
          getters: store.getters,
          dispatch: store.dispatch.bind(store),
          commit: store.commit.bind(store)
        }].concat(payload));
      });
    } : actions[key];
  };

  for (var key in actions) {
    _loop3(key);
  }
  return newActions;
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/common/mini/util.js":
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.type = type;
exports.normalizeMap = normalizeMap;
exports.isExistAttr = isExistAttr;
exports.getByPath = getByPath;
exports.proxy = proxy;
exports.defineGetterSetter = defineGetterSetter;
function type(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}

function normalizeMap(arr) {
  if (type(arr) === 'Array') {
    var map = {};
    arr.forEach(function (value) {
      map[value] = value;
    });
    return map;
  }
  return arr;
}

function isExistAttr(obj, attr) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  var isNullOrUndefined = obj === null || obj === undefined;
  if (isNullOrUndefined) {
    return false;
  } else if (type === 'object' || type === 'function') {
    return attr in obj;
  } else {
    return obj[attr] !== undefined;
  }
}

function getByPath(data, pathStr, notExistOutput) {
  if (!pathStr) return data;
  var path = pathStr.split('.');
  var notExist = false;
  var value = data;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (isExistAttr(value, key)) {
        value = value[key];
      } else {
        value = undefined;
        notExist = true;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (notExistOutput) {
    return notExist ? notExistOutput : value;
  } else {
    // 小程序setData时不允许undefined数据
    return value === undefined ? '' : value;
  }
}

function proxy(target, source, keys, mapKeys, readonly) {
  if (typeof mapKeys === 'boolean') {
    readonly = mapKeys;
    mapKeys = null;
  }
  keys.forEach(function (key, index) {
    var descriptor = {
      get: function get() {
        return source[key];
      },

      configurable: true,
      enumerable: true
    };
    !readonly && (descriptor.set = function (val) {
      source[key] = val;
    });
    Object.defineProperty(target, mapKeys ? mapKeys[index] : key, descriptor);
  });
  return target;
}

function defineGetterSetter(target, key, getValue, setValue, context) {
  var get = void 0;
  var set = void 0;
  if (typeof getValue === 'function') {
    get = context ? getValue.bind(context) : getValue;
  } else {
    get = function get() {
      return getValue;
    };
  }
  if (typeof setValue === 'function') {
    set = context ? setValue.bind(context) : setValue;
  }
  var descriptor = {
    get: get,
    configurable: true,
    enumerable: true
  };
  if (set) descriptor.set = set;
  Object.defineProperty(target, key, descriptor);
}

/***/ }),

/***/ "./node_modules/chameleon-store/src/platform/qq/index.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mini = __webpack_require__("./node_modules/chameleon-store/src/platform/common/mini/index.js");

var _mini2 = _interopRequireDefault(_mini);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _mini2.default;

/***/ }),

/***/ "./node_modules/mobx/lib/mobx.module.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** MobX - (c) Michel Weststrate 2015, 2016 - MIT Licensed */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
    d.__proto__ = b;
} || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++) {
        ar = ar.concat(__read(arguments[i]));
    }return ar;
}

var enumerableDescriptorCache = {};
var nonEnumerableDescriptorCache = {};
function createPropertyInitializerDescriptor(prop, enumerable) {
    var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
    return cache[prop] || (cache[prop] = {
        configurable: true,
        enumerable: enumerable,
        get: function get() {
            initializeInstance(this);
            return this[prop];
        },
        set: function set(value) {
            initializeInstance(this);
            this[prop] = value;
        }
    });
}
function initializeInstance(target) {
    if (target.__mobxDidRunLazyInitializers === true) return;
    var decorators = target.__mobxDecorators;
    if (decorators) {
        addHiddenProp(target, "__mobxDidRunLazyInitializers", true);
        for (var key in decorators) {
            var d = decorators[key];
            d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
        }
    }
}
function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
    return function decoratorFactory() {
        var decoratorArguments;
        var decorator = function decorate(target, prop, descriptor, applyImmediately
        // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
        // as the instance to apply the decorator to equals the target
        ) {
            if (applyImmediately === true) {
                propertyCreator(target, prop, descriptor, target, decoratorArguments);
                return null;
            }
            if ("development" !== "production" && !quacksLikeADecorator(arguments)) fail$1("This function is a decorator, but it wasn't invoked like a decorator");
            if (!Object.prototype.hasOwnProperty.call(target, "__mobxDecorators")) {
                var inheritedDecorators = target.__mobxDecorators;
                addHiddenProp(target, "__mobxDecorators", __assign({}, inheritedDecorators));
            }
            target.__mobxDecorators[prop] = {
                prop: prop,
                propertyCreator: propertyCreator,
                descriptor: descriptor,
                decoratorTarget: target,
                decoratorArguments: decoratorArguments
            };
            return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
        };
        if (quacksLikeADecorator(arguments)) {
            // @decorator
            decoratorArguments = EMPTY_ARRAY;
            return decorator.apply(null, arguments);
        } else {
            // @decorator(args)
            decoratorArguments = Array.prototype.slice.call(arguments);
            return decorator;
        }
    };
}
function quacksLikeADecorator(args) {
    return (args.length === 2 || args.length === 3) && typeof args[1] === "string" || args.length === 4 && args[3] === true;
}

function isSpyEnabled() {
    return !!globalState.spyListeners.length;
}
function spyReport(event) {
    if (!globalState.spyListeners.length) return;
    var listeners = globalState.spyListeners;
    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](event);
    }
}
function spyReportStart(event) {
    var change = __assign({}, event, { spyReportStart: true });
    spyReport(change);
}
var END_EVENT = { spyReportEnd: true };
function spyReportEnd(change) {
    if (change) spyReport(__assign({}, change, { spyReportEnd: true }));else spyReport(END_EVENT);
}
function spy(listener) {
    globalState.spyListeners.push(listener);
    return once(function () {
        globalState.spyListeners = globalState.spyListeners.filter(function (l) {
            return l !== listener;
        });
    });
}

function createAction(actionName, fn) {
    if (true) {
        invariant(typeof fn === "function", "`action` can only be invoked on functions");
        if (typeof actionName !== "string" || !actionName) fail$1("actions should have valid names, got: '" + actionName + "'");
    }
    var res = function res() {
        return executeAction(actionName, fn, this, arguments);
    };
    res.isMobxAction = true;
    return res;
}
function executeAction(actionName, fn, scope, args) {
    var runInfo = startAction(actionName, fn, scope, args);
    try {
        return fn.apply(scope, args);
    } finally {
        endAction(runInfo);
    }
}
function startAction(actionName, fn, scope, args) {
    var notifySpy = isSpyEnabled() && !!actionName;
    var startTime = 0;
    if (notifySpy) {
        startTime = Date.now();
        var l = args && args.length || 0;
        var flattendArgs = new Array(l);
        if (l > 0) for (var i = 0; i < l; i++) {
            flattendArgs[i] = args[i];
        }spyReportStart({
            type: "action",
            name: actionName,
            object: scope,
            arguments: flattendArgs
        });
    }
    var prevDerivation = untrackedStart();
    startBatch();
    var prevAllowStateChanges = allowStateChangesStart(true);
    return {
        prevDerivation: prevDerivation,
        prevAllowStateChanges: prevAllowStateChanges,
        notifySpy: notifySpy,
        startTime: startTime
    };
}
function endAction(runInfo) {
    allowStateChangesEnd(runInfo.prevAllowStateChanges);
    endBatch();
    untrackedEnd(runInfo.prevDerivation);
    if (runInfo.notifySpy) spyReportEnd({ time: Date.now() - runInfo.startTime });
}
function allowStateChanges(allowStateChanges, func) {
    var prev = allowStateChangesStart(allowStateChanges);
    var res;
    try {
        res = func();
    } finally {
        allowStateChangesEnd(prev);
    }
    return res;
}
function allowStateChangesStart(allowStateChanges) {
    var prev = globalState.allowStateChanges;
    globalState.allowStateChanges = allowStateChanges;
    return prev;
}
function allowStateChangesEnd(prev) {
    globalState.allowStateChanges = prev;
}
function allowStateChangesInsideComputed(func) {
    var prev = globalState.computationDepth;
    globalState.computationDepth = 0;
    var res;
    try {
        res = func();
    } finally {
        globalState.computationDepth = prev;
    }
    return res;
}

function dontReassignFields() {
    fail$1("development" !== "production" && "@action fields are not reassignable");
}
function namedActionDecorator(name) {
    return function (target, prop, descriptor) {
        if (descriptor) {
            if ("development" !== "production" && descriptor.get !== undefined) {
                return fail$1("@action cannot be used with getters");
            }
            // babel / typescript
            // @action method() { }
            if (descriptor.value) {
                // typescript
                return {
                    value: createAction(name, descriptor.value),
                    enumerable: false,
                    configurable: true,
                    writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
                };
            }
            // babel only: @action method = () => {}
            var initializer_1 = descriptor.initializer;
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer: function initializer() {
                    // N.B: we can't immediately invoke initializer; this would be wrong
                    return createAction(name, initializer_1.call(this));
                }
            };
        }
        // bound instance methods
        return actionFieldDecorator(name).apply(this, arguments);
    };
}
function actionFieldDecorator(name) {
    // Simple property that writes on first invocation to the current instance
    return function (target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            configurable: true,
            enumerable: false,
            get: function get() {
                return undefined;
            },
            set: function set(value) {
                addHiddenProp(this, prop, action(name, value));
            }
        });
    };
}
function boundActionDecorator(target, propertyName, descriptor, applyToInstance) {
    if (applyToInstance === true) {
        defineBoundAction(target, propertyName, descriptor.value);
        return null;
    }
    if (descriptor) {
        // if (descriptor.value)
        // Typescript / Babel: @action.bound method() { }
        // also: babel @action.bound method = () => {}
        return {
            configurable: true,
            enumerable: false,
            get: function get() {
                defineBoundAction(this, propertyName, descriptor.value || descriptor.initializer.call(this));
                return this[propertyName];
            },
            set: dontReassignFields
        };
    }
    // field decorator Typescript @action.bound method = () => {}
    return {
        enumerable: false,
        configurable: true,
        set: function set(v) {
            defineBoundAction(this, propertyName, v);
        },
        get: function get() {
            return undefined;
        }
    };
}

var action = function action(arg1, arg2, arg3, arg4) {
    // action(fn() {})
    if (arguments.length === 1 && typeof arg1 === "function") return createAction(arg1.name || "<unnamed action>", arg1);
    // action("name", fn() {})
    if (arguments.length === 2 && typeof arg2 === "function") return createAction(arg1, arg2);
    // @action("name") fn() {}
    if (arguments.length === 1 && typeof arg1 === "string") return namedActionDecorator(arg1);
    // @action fn() {}
    if (arg4 === true) {
        // apply to instance immediately
        arg1[arg2] = createAction(arg1.name || arg2, arg3.value);
    } else {
        return namedActionDecorator(arg2).apply(null, arguments);
    }
};
action.bound = boundActionDecorator;
function runInAction(arg1, arg2) {
    // TODO: deprecate?
    var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
    var fn = typeof arg1 === "function" ? arg1 : arg2;
    if (true) {
        invariant(typeof fn === "function" && fn.length === 0, "`runInAction` expects a function without arguments");
        if (typeof actionName !== "string" || !actionName) fail$1("actions should have valid names, got: '" + actionName + "'");
    }
    return executeAction(actionName, fn, this, undefined);
}
function isAction(thing) {
    return typeof thing === "function" && thing.isMobxAction === true;
}
function defineBoundAction(target, propertyName, fn) {
    addHiddenProp(target, propertyName, createAction(propertyName, fn.bind(target)));
}

var toString = Object.prototype.toString;
function deepEqual(a, b) {
    return eq(a, b);
}
// Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a === "undefined" ? "undefined" : _typeof(a);
    if (type !== "function" && type !== "object" && (typeof b === "undefined" ? "undefined" : _typeof(b)) != "object") return false;
    return deepEq(a, b, aStack, bStack);
}
// Internal recursive comparison function for `isEqual`.
function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    a = unwrap(a);
    b = unwrap(b);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case "[object RegExp]":
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case "[object String]":
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return "" + a === "" + b;
        case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case "[object Symbol]":
            return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);
    }
    var areArrays = className === "[object Array]";
    if (!areArrays) {
        if ((typeof a === "undefined" ? "undefined" : _typeof(a)) != "object" || (typeof b === "undefined" ? "undefined" : _typeof(b)) != "object") return false;
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor,
            bCtor = b.constructor;
        if (aCtor !== bCtor && !(typeof aCtor === "function" && aCtor instanceof aCtor && typeof bCtor === "function" && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var keys$$1 = Object.keys(a),
            key;
        length = keys$$1.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (Object.keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = keys$$1[length];
            if (!(has$$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}
function unwrap(a) {
    if (isObservableArray(a)) return a.peek();
    if (isES6Map(a) || isObservableMap(a)) return iteratorToArray(a.entries());
    return a;
}
function has$$1(a, key) {
    return Object.prototype.hasOwnProperty.call(a, key);
}

function identityComparer(a, b) {
    return a === b;
}
function structuralComparer(a, b) {
    return deepEqual(a, b);
}
function defaultComparer(a, b) {
    return areBothNaN(a, b) || identityComparer(a, b);
}
var comparer = {
    identity: identityComparer,
    structural: structuralComparer,
    default: defaultComparer
};

/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
function autorun(view, opts) {
    if (opts === void 0) {
        opts = EMPTY_OBJECT;
    }
    if (true) {
        invariant(typeof view === "function", "Autorun expects a function as first argument");
        invariant(isAction(view) === false, "Autorun does not accept actions since actions are untrackable");
    }
    var name = opts && opts.name || view.name || "Autorun@" + getNextId();
    var runSync = !opts.scheduler && !opts.delay;
    var reaction;
    if (runSync) {
        // normal autorun
        reaction = new Reaction(name, function () {
            this.track(reactionRunner);
        }, opts.onError);
    } else {
        var scheduler_1 = createSchedulerFromOptions(opts);
        // debounced autorun
        var isScheduled_1 = false;
        reaction = new Reaction(name, function () {
            if (!isScheduled_1) {
                isScheduled_1 = true;
                scheduler_1(function () {
                    isScheduled_1 = false;
                    if (!reaction.isDisposed) reaction.track(reactionRunner);
                });
            }
        }, opts.onError);
    }
    function reactionRunner() {
        view(reaction);
    }
    reaction.schedule();
    return reaction.getDisposer();
}
var run = function run(f) {
    return f();
};
function createSchedulerFromOptions(opts) {
    return opts.scheduler ? opts.scheduler : opts.delay ? function (f) {
        return setTimeout(f, opts.delay);
    } : run;
}
function reaction(expression, effect, opts) {
    if (opts === void 0) {
        opts = EMPTY_OBJECT;
    }
    if (typeof opts === "boolean") {
        opts = { fireImmediately: opts };
        deprecated("Using fireImmediately as argument is deprecated. Use '{ fireImmediately: true }' instead");
    }
    if (true) {
        invariant(typeof expression === "function", "First argument to reaction should be a function");
        invariant((typeof opts === "undefined" ? "undefined" : _typeof(opts)) === "object", "Third argument of reactions should be an object");
    }
    var name = opts.name || "Reaction@" + getNextId();
    var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
    var runSync = !opts.scheduler && !opts.delay;
    var scheduler = createSchedulerFromOptions(opts);
    var firstTime = true;
    var isScheduled = false;
    var value;
    var equals = opts.compareStructural ? comparer.structural : opts.equals || comparer.default;
    var r = new Reaction(name, function () {
        if (firstTime || runSync) {
            reactionRunner();
        } else if (!isScheduled) {
            isScheduled = true;
            scheduler(reactionRunner);
        }
    }, opts.onError);
    function reactionRunner() {
        isScheduled = false; // Q: move into reaction runner?
        if (r.isDisposed) return;
        var changed = false;
        r.track(function () {
            var nextValue = expression(r);
            changed = firstTime || !equals(value, nextValue);
            value = nextValue;
        });
        if (firstTime && opts.fireImmediately) effectAction(value, r);
        if (!firstTime && changed === true) effectAction(value, r);
        if (firstTime) firstTime = false;
    }
    r.schedule();
    return r.getDisposer();
}
function wrapErrorHandler(errorHandler, baseFn) {
    return function () {
        try {
            return baseFn.apply(this, arguments);
        } catch (e) {
            errorHandler.call(this, e);
        }
    };
}

/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */
var ComputedValue = /** @class */function () {
    /**
     * Create a new computed value based on a function expression.
     *
     * The `name` property is for debug purposes only.
     *
     * The `equals` property specifies the comparer function to use to determine if a newly produced
     * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
     * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
     * Structural comparison can be convenient if you always produce a new aggregated object and
     * don't want to notify observers if it is structurally the same.
     * This is useful for working with vectors, mouse coordinates etc.
     */
    function ComputedValue(options) {
        this.dependenciesState = IDerivationState.NOT_TRACKING;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = null; // during tracking it's an array with new observed observers
        this.isBeingObserved = false;
        this.isPendingUnobservation = false;
        this.observers = [];
        this.observersIndexes = {};
        this.diffValue = 0;
        this.runId = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = IDerivationState.UP_TO_DATE;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.value = new CaughtException(null);
        this.isComputing = false; // to check for cycles
        this.isRunningSetter = false;
        this.isTracing = TraceMode.NONE;
        if ("development" !== "production" && !options.get) return fail$1("missing option for computed: get");
        this.derivation = options.get;
        this.name = options.name || "ComputedValue@" + getNextId();
        if (options.set) this.setter = createAction(this.name + "-setter", options.set);
        this.equals = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer.default);
        this.scope = options.context;
        this.requiresReaction = !!options.requiresReaction;
        this.keepAlive = !!options.keepAlive;
    }
    ComputedValue.prototype.onBecomeStale = function () {
        propagateMaybeChanged(this);
    };
    ComputedValue.prototype.onBecomeUnobserved = function () {};
    ComputedValue.prototype.onBecomeObserved = function () {};
    /**
     * Returns the current value of this computed value.
     * Will evaluate its computation first if needed.
     */
    ComputedValue.prototype.get = function () {
        if (this.isComputing) fail$1("Cycle detected in computation " + this.name + ": " + this.derivation);
        if (globalState.inBatch === 0 && this.observers.length === 0 && !this.keepAlive) {
            if (shouldCompute(this)) {
                this.warnAboutUntrackedRead();
                startBatch(); // See perf test 'computed memoization'
                this.value = this.computeValue(false);
                endBatch();
            }
        } else {
            reportObserved(this);
            if (shouldCompute(this)) if (this.trackAndCompute()) propagateChangeConfirmed(this);
        }
        var result = this.value;
        if (isCaughtException(result)) throw result.cause;
        return result;
    };
    ComputedValue.prototype.peek = function () {
        var res = this.computeValue(false);
        if (isCaughtException(res)) throw res.cause;
        return res;
    };
    ComputedValue.prototype.set = function (value) {
        if (this.setter) {
            invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
            this.isRunningSetter = true;
            try {
                this.setter.call(this.scope, value);
            } finally {
                this.isRunningSetter = false;
            }
        } else invariant(false, "development" !== "production" && "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
    };
    ComputedValue.prototype.trackAndCompute = function () {
        if (isSpyEnabled()) {
            spyReport({
                object: this.scope,
                type: "compute",
                name: this.name
            });
        }
        var oldValue = this.value;
        var wasSuspended =
        /* see #1208 */this.dependenciesState === IDerivationState.NOT_TRACKING;
        var newValue = this.computeValue(true);
        var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals(oldValue, newValue);
        if (changed) {
            this.value = newValue;
        }
        return changed;
    };
    ComputedValue.prototype.computeValue = function (track) {
        this.isComputing = true;
        globalState.computationDepth++;
        var res;
        if (track) {
            res = trackDerivedFunction(this, this.derivation, this.scope);
        } else {
            if (globalState.disableErrorBoundaries === true) {
                res = this.derivation.call(this.scope);
            } else {
                try {
                    res = this.derivation.call(this.scope);
                } catch (e) {
                    res = new CaughtException(e);
                }
            }
        }
        globalState.computationDepth--;
        this.isComputing = false;
        return res;
    };
    ComputedValue.prototype.suspend = function () {
        if (!this.keepAlive) {
            clearObserving(this);
            this.value = undefined; // don't hold on to computed value!
        }
    };
    ComputedValue.prototype.observe = function (listener, fireImmediately) {
        var _this = this;
        var firstTime = true;
        var prevValue = undefined;
        return autorun(function () {
            var newValue = _this.get();
            if (!firstTime || fireImmediately) {
                var prevU = untrackedStart();
                listener({
                    type: "update",
                    object: _this,
                    newValue: newValue,
                    oldValue: prevValue
                });
                untrackedEnd(prevU);
            }
            firstTime = false;
            prevValue = newValue;
        });
    };
    ComputedValue.prototype.warnAboutUntrackedRead = function () {
        if (false) return;
        if (this.requiresReaction === true) {
            fail$1("[mobx] Computed value " + this.name + " is read outside a reactive context");
        }
        if (this.isTracing !== TraceMode.NONE) {
            console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
        }
        if (globalState.computedRequiresReaction) {
            console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
        }
    };
    ComputedValue.prototype.toJSON = function () {
        return this.get();
    };
    ComputedValue.prototype.toString = function () {
        return this.name + "[" + this.derivation.toString() + "]";
    };
    ComputedValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    return ComputedValue;
}();
ComputedValue.prototype[primitiveSymbol()] = ComputedValue.prototype.valueOf;
var isComputedValue = createInstanceofPredicate("ComputedValue", ComputedValue);

function hasInterceptors(interceptable) {
    return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
}
function registerInterceptor(interceptable, handler) {
    var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
    interceptors.push(handler);
    return once(function () {
        var idx = interceptors.indexOf(handler);
        if (idx !== -1) interceptors.splice(idx, 1);
    });
}
function interceptChange(interceptable, change) {
    var prevU = untrackedStart();
    try {
        var interceptors = interceptable.interceptors;
        if (interceptors) for (var i = 0, l = interceptors.length; i < l; i++) {
            change = interceptors[i](change);
            invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
            if (!change) break;
        }
        return change;
    } finally {
        untrackedEnd(prevU);
    }
}

function hasListeners(listenable) {
    return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
}
function registerListener(listenable, handler) {
    var listeners = listenable.changeListeners || (listenable.changeListeners = []);
    listeners.push(handler);
    return once(function () {
        var idx = listeners.indexOf(handler);
        if (idx !== -1) listeners.splice(idx, 1);
    });
}
function notifyListeners(listenable, change) {
    var prevU = untrackedStart();
    var listeners = listenable.changeListeners;
    if (!listeners) return;
    listeners = listeners.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](change);
    }
    untrackedEnd(prevU);
}

declareAtom();
var ObservableValue = /** @class */function (_super) {
    __extends(ObservableValue, _super);
    function ObservableValue(value, enhancer, name, notifySpy) {
        if (name === void 0) {
            name = "ObservableValue@" + getNextId();
        }
        if (notifySpy === void 0) {
            notifySpy = true;
        }
        var _this = _super.call(this, name) || this;
        _this.enhancer = enhancer;
        _this.hasUnreportedChange = false;
        _this.value = enhancer(value, undefined, name);
        if (notifySpy && isSpyEnabled()) {
            // only notify spy if this is a stand-alone observable
            spyReport({ type: "create", name: _this.name, newValue: "" + _this.value });
        }
        return _this;
    }
    ObservableValue.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) return this.dehancer(value);
        return value;
    };
    ObservableValue.prototype.set = function (newValue) {
        var oldValue = this.value;
        newValue = this.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            if (notifySpy) {
                spyReportStart({
                    type: "update",
                    name: this.name,
                    newValue: newValue,
                    oldValue: oldValue
                });
            }
            this.setNewValue(newValue);
            if (notifySpy) spyReportEnd();
        }
    };
    ObservableValue.prototype.prepareNewValue = function (newValue) {
        checkIfStateModificationsAreAllowed(this);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this,
                type: "update",
                newValue: newValue
            });
            if (!change) return globalState.UNCHANGED;
            newValue = change.newValue;
        }
        // apply modifier
        newValue = this.enhancer(newValue, this.value, this.name);
        return this.value !== newValue ? newValue : globalState.UNCHANGED;
    };
    ObservableValue.prototype.setNewValue = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        this.reportChanged();
        if (hasListeners(this)) {
            notifyListeners(this, {
                type: "update",
                object: this,
                newValue: newValue,
                oldValue: oldValue
            });
        }
    };
    ObservableValue.prototype.get = function () {
        this.reportObserved();
        return this.dehanceValue(this.value);
    };
    ObservableValue.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableValue.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately) listener({
            object: this,
            type: "update",
            newValue: this.value,
            oldValue: undefined
        });
        return registerListener(this, listener);
    };
    ObservableValue.prototype.toJSON = function () {
        return this.get();
    };
    ObservableValue.prototype.toString = function () {
        return this.name + "[" + this.value + "]";
    };
    ObservableValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    return ObservableValue;
}(Atom);
ObservableValue.prototype[primitiveSymbol()] = ObservableValue.prototype.valueOf;
var isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);

var ObservableObjectAdministration = /** @class */function () {
    function ObservableObjectAdministration(target, name, defaultEnhancer) {
        this.target = target;
        this.name = name;
        this.defaultEnhancer = defaultEnhancer;
        this.values = {};
    }
    ObservableObjectAdministration.prototype.read = function (owner, key) {
        if (false) {
            this.illegalAccess(owner, key);
            if (!this.values[key]) return undefined;
        }
        return this.values[key].get();
    };
    ObservableObjectAdministration.prototype.write = function (owner, key, newValue) {
        var instance = this.target;
        if (false) {
            this.illegalAccess(owner, key);
        }
        var observable = this.values[key];
        if (observable instanceof ComputedValue) {
            observable.set(newValue);
            return;
        }
        // intercept
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "update",
                object: instance,
                name: key,
                newValue: newValue
            });
            if (!change) return;
            newValue = change.newValue;
        }
        newValue = observable.prepareNewValue(newValue);
        // notify spy & observers
        if (newValue !== globalState.UNCHANGED) {
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var change = notify || notifySpy ? {
                type: "update",
                object: instance,
                oldValue: observable.value,
                name: key,
                newValue: newValue
            } : null;
            if (notifySpy) spyReportStart(__assign({}, change, { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify) notifyListeners(this, change);
            if (notifySpy) spyReportEnd();
        }
    };
    ObservableObjectAdministration.prototype.remove = function (key) {
        if (!this.values[key]) return;
        var target = this.target;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: target,
                name: key,
                type: "remove"
            });
            if (!change) return;
        }
        try {
            startBatch();
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var oldValue = this.values[key].get();
            if (this.keys) this.keys.remove(key);
            delete this.values[key];
            delete this.target[key];
            var change = notify || notifySpy ? {
                type: "remove",
                object: target,
                oldValue: oldValue,
                name: key
            } : null;
            if (notifySpy) spyReportStart(__assign({}, change, { name: this.name, key: key }));
            if (notify) notifyListeners(this, change);
            if (notifySpy) spyReportEnd();
        } finally {
            endBatch();
        }
    };
    ObservableObjectAdministration.prototype.illegalAccess = function (owner, propName) {
        /**
         * This happens if a property is accessed through the prototype chain, but the property was
         * declared directly as own property on the prototype.
         *
         * E.g.:
         * class A {
         * }
         * extendObservable(A.prototype, { x: 1 })
         *
         * classB extens A {
         * }
         * console.log(new B().x)
         *
         * It is unclear whether the property should be considered 'static' or inherited.
         * Either use `console.log(A.x)`
         * or: decorate(A, { x: observable })
         *
         * When using decorate, the property will always be redeclared as own property on the actual instance
         */
        console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
        "development" !== "production" && invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
        return registerListener(this, callback);
    };
    ObservableObjectAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableObjectAdministration.prototype.getKeys = function () {
        var _this = this;
        if (this.keys === undefined) {
            this.keys = new ObservableArray(Object.keys(this.values).filter(function (key) {
                return _this.values[key] instanceof ObservableValue;
            }), referenceEnhancer, "keys(" + this.name + ")", true);
        }
        return this.keys.slice();
    };
    return ObservableObjectAdministration;
}();
function asObservableObject(target, name, defaultEnhancer) {
    if (name === void 0) {
        name = "";
    }
    if (defaultEnhancer === void 0) {
        defaultEnhancer = deepEnhancer;
    }
    var adm = target.$mobx;
    if (adm) return adm;
    "development" !== "production" && invariant(Object.isExtensible(target), "Cannot make the designated object observable; it is not extensible");
    if (!isPlainObject(target)) name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
    if (!name) name = "ObservableObject@" + getNextId();
    adm = new ObservableObjectAdministration(target, name, defaultEnhancer);
    addHiddenFinalProp(target, "$mobx", adm);
    return adm;
}
function defineObservableProperty(target, propName, newValue, enhancer) {
    var adm = asObservableObject(target);
    assertPropertyConfigurable(target, propName);
    if (hasInterceptors(adm)) {
        var change = interceptChange(adm, {
            object: target,
            name: propName,
            type: "add",
            newValue: newValue
        });
        if (!change) return;
        newValue = change.newValue;
    }
    var observable = adm.values[propName] = new ObservableValue(newValue, enhancer, adm.name + "." + propName, false);
    newValue = observable.value; // observableValue might have changed it
    Object.defineProperty(target, propName, generateObservablePropConfig(propName));
    if (adm.keys) adm.keys.push(propName);
    notifyPropertyAddition(adm, target, propName, newValue);
}
function defineComputedProperty(target, // which objects holds the observable and provides `this` context?
propName, options) {
    var adm = asObservableObject(target);
    options.name = adm.name + "." + propName;
    options.context = target;
    adm.values[propName] = new ComputedValue(options);
    Object.defineProperty(target, propName, generateComputedPropConfig(propName));
}
var observablePropertyConfigs = Object.create(null);
var computedPropertyConfigs = Object.create(null);
function generateObservablePropConfig(propName) {
    return observablePropertyConfigs[propName] || (observablePropertyConfigs[propName] = {
        configurable: true,
        enumerable: true,
        get: function get() {
            return this.$mobx.read(this, propName);
        },
        set: function set(v) {
            this.$mobx.write(this, propName, v);
        }
    });
}
function getAdministrationForComputedPropOwner(owner) {
    var adm = owner.$mobx;
    if (!adm) {
        // because computed props are declared on proty,
        // the current instance might not have been initialized yet
        initializeInstance(owner);
        return owner.$mobx;
    }
    return adm;
}
function generateComputedPropConfig(propName) {
    return computedPropertyConfigs[propName] || (computedPropertyConfigs[propName] = {
        configurable: true,
        enumerable: false,
        get: function get() {
            return getAdministrationForComputedPropOwner(this).read(this, propName);
        },
        set: function set(v) {
            getAdministrationForComputedPropOwner(this).write(this, propName, v);
        }
    });
}
function notifyPropertyAddition(adm, object, key, newValue) {
    var notify = hasListeners(adm);
    var notifySpy = isSpyEnabled();
    var change = notify || notifySpy ? {
        type: "add",
        object: object,
        name: key,
        newValue: newValue
    } : null;
    if (notifySpy) spyReportStart(__assign({}, change, { name: adm.name, key: key }));
    if (notify) notifyListeners(adm, change);
    if (notifySpy) spyReportEnd();
}
var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
function isObservableObject(thing) {
    if (isObject(thing)) {
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        return isObservableObjectAdministration(thing.$mobx);
    }
    return false;
}

function createDecoratorForEnhancer(enhancer) {
    var decorator = createPropDecorator(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
        if (true) {
            invariant(!descriptor || !descriptor.get, "@observable cannot be used on getter (property \"" + propertyName + "\"), use @computed instead.");
        }
        var initialValue = descriptor ? descriptor.initializer ? descriptor.initializer.call(target) : descriptor.value : undefined;
        defineObservableProperty(target, propertyName, initialValue, enhancer);
    });
    var res =
    // Extra process checks, as this happens during module initialization
    typeof process !== "undefined" && process.env && "development" !== "production" ? function observableDecorator() {
        // This wrapper function is just to detect illegal decorator invocations, deprecate in a next version
        // and simply return the created prop decorator
        if (arguments.length < 2) return fail$1("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
        return decorator.apply(null, arguments);
    } : decorator;
    res.enhancer = enhancer;
    return res;
}

function _isObservable(value, property) {
    if (value === null || value === undefined) return false;
    if (property !== undefined) {
        if ("development" !== "production" && (isObservableMap(value) || isObservableArray(value))) return fail$1("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
        if (isObservableObject(value)) {
            var o = value.$mobx;
            return o.values && !!o.values[property];
        }
        return false;
    }
    // For first check, see #701
    return isObservableObject(value) || !!value.$mobx || isAtom(value) || isReaction(value) || isComputedValue(value);
}
function isObservable(value) {
    if (arguments.length !== 1) fail$1("development" !== "production" && "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isObservable(value);
}
function isObservableProp(value, propName) {
    if (typeof propName !== "string") return fail$1("development" !== "production" && "expected a property name as second argument");
    return _isObservable(value, propName);
}

function _isComputed(value, property) {
    if (value === null || value === undefined) return false;
    if (property !== undefined) {
        if (isObservableObject(value) === false) return false;
        if (!value.$mobx.values[property]) return false;
        var atom = getAtom(value, property);
        return isComputedValue(atom);
    }
    return isComputedValue(value);
}
function isComputed(value) {
    if (arguments.length > 1) return fail$1("development" !== "production" && "isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isComputed(value);
}
function isComputedProp(value, propName) {
    if (typeof propName !== "string") return fail$1("development" !== "production" && "isComputed expected a property name as second argument");
    return _isComputed(value, propName);
}

var computedDecorator = createPropDecorator(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
    var get = descriptor.get,
        set = descriptor.set; // initialValue is the descriptor for get / set props
    // Optimization: faster on decorator target or instance? Assuming target
    // Optimization: find out if declaring on instance isn't just faster. (also makes the property descriptor simpler). But, more memory usage..
    // Forcing instance now, fixes hot reloadig issues on React Native:
    var options = decoratorArgs[0] || {};
    defineComputedProperty(instance, propertyName, __assign({ get: get, set: set }, options));
});
var computedStructDecorator = computedDecorator({ equals: comparer.structural });
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
var computed = function computed(arg1, arg2, arg3) {
    if (typeof arg2 === "string") {
        // @computed
        return computedDecorator.apply(null, arguments);
    }
    if (arg1 !== null && (typeof arg1 === "undefined" ? "undefined" : _typeof(arg1)) === "object" && arguments.length === 1) {
        // @computed({ options })
        return computedDecorator.apply(null, arguments);
    }
    // computed(expr, options?)
    if (true) {
        invariant(typeof arg1 === "function", "First argument to `computed` should be an expression.");
        invariant(arguments.length < 3, "Computed takes one or two arguments if used as function");
    }
    var opts = (typeof arg2 === "undefined" ? "undefined" : _typeof(arg2)) === "object" ? arg2 : {};
    opts.get = arg1;
    opts.set = typeof arg2 === "function" ? arg2 : opts.set;
    opts.name = opts.name || arg1.name || ""; /* for generated name */
    return new ComputedValue(opts);
};
computed.struct = computedStructDecorator;

function extendShallowObservable(target, properties, decorators) {
    deprecated("'extendShallowObservable' is deprecated, use 'extendObservable(target, props, { deep: false })' instead");
    return extendObservable(target, properties, decorators, shallowCreateObservableOptions);
}
function extendObservable(target, properties, decorators, options) {
    if (true) {
        invariant(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments");
        invariant((typeof target === "undefined" ? "undefined" : _typeof(target)) === "object", "'extendObservable' expects an object as first argument");
        invariant(!isObservableMap(target), "'extendObservable' should not be used on maps, use map.merge instead");
        invariant(!isObservable(properties), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540");
        if (decorators) for (var key in decorators) {
            if (!(key in properties)) fail$1("Trying to declare a decorator for unspecified property '" + key + "'");
        }
    }
    options = asCreateObservableOptions(options);
    var defaultDecorator = options.defaultDecorator || (options.deep === false ? refDecorator : deepDecorator);
    initializeInstance(target);
    asObservableObject(target, options.name, defaultDecorator.enhancer); // make sure object is observable, even without initial props
    startBatch();
    try {
        for (var key in properties) {
            var descriptor = Object.getOwnPropertyDescriptor(properties, key);
            if (true) {
                if (Object.getOwnPropertyDescriptor(target, key)) fail$1("'extendObservable' can only be used to introduce new properties. Use 'set' or 'decorate' instead. The property '" + key + "' already exists on '" + target + "'");
                if (isComputed(descriptor.value)) fail$1("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead");
            }
            var decorator = decorators && key in decorators ? decorators[key] : descriptor.get ? computedDecorator : defaultDecorator;
            if ("development" !== "production" && typeof decorator !== "function") return fail$1("Not a valid decorator for '" + key + "', got: " + decorator);
            var resultDescriptor = decorator(target, key, descriptor, true);
            if (resultDescriptor // otherwise, assume already applied, due to `applyToInstance`
            ) Object.defineProperty(target, key, resultDescriptor);
        }
    } finally {
        endBatch();
    }
    return target;
}

// Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases
var defaultCreateObservableOptions = {
    deep: true,
    name: undefined,
    defaultDecorator: undefined
};
var shallowCreateObservableOptions = {
    deep: false,
    name: undefined,
    defaultDecorator: undefined
};
Object.freeze(defaultCreateObservableOptions);
Object.freeze(shallowCreateObservableOptions);
function assertValidOption(key) {
    if (!/^(deep|name|defaultDecorator)$/.test(key)) fail$1("invalid option for (extend)observable: " + key);
}
function asCreateObservableOptions(thing) {
    if (thing === null || thing === undefined) return defaultCreateObservableOptions;
    if (typeof thing === "string") return { name: thing, deep: true };
    if (true) {
        if ((typeof thing === "undefined" ? "undefined" : _typeof(thing)) !== "object") return fail$1("expected options object");
        Object.keys(thing).forEach(assertValidOption);
    }
    return thing;
}
function getEnhancerFromOptions(options) {
    return options.defaultDecorator ? options.defaultDecorator.enhancer : options.deep === false ? referenceEnhancer : deepEnhancer;
}
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */
function createObservable(v, arg2, arg3) {
    // @observable someProp;
    if (typeof arguments[1] === "string") {
        return deepDecorator.apply(null, arguments);
    }
    // it is an observable already, done
    if (isObservable(v)) return v;
    // something that can be converted and mutated?
    var res = isPlainObject(v) ? observable.object(v, arg2, arg3) : Array.isArray(v) ? observable.array(v, arg2) : isES6Map(v) ? observable.map(v, arg2) : v;
    // this value could be converted to a new observable data structure, return it
    if (res !== v) return res;
    // otherwise, just box it
    fail$1("development" !== "production" && "The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
}
var observableFactories = {
    box: function box(value, options) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("box");
        var o = asCreateObservableOptions(options);
        return new ObservableValue(value, getEnhancerFromOptions(o), o.name);
    },
    shallowBox: function shallowBox(value, name) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowBox");
        deprecated("observable.shallowBox", "observable.box(value, { deep: false })");
        return observable.box(value, { name: name, deep: false });
    },
    array: function array(initialValues, options) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("array");
        var o = asCreateObservableOptions(options);
        return new ObservableArray(initialValues, getEnhancerFromOptions(o), o.name);
    },
    shallowArray: function shallowArray(initialValues, name) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowArray");
        deprecated("observable.shallowArray", "observable.array(values, { deep: false })");
        return observable.array(initialValues, { name: name, deep: false });
    },
    map: function map(initialValues, options) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("map");
        var o = asCreateObservableOptions(options);
        return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
    },
    shallowMap: function shallowMap(initialValues, name) {
        if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowMap");
        deprecated("observable.shallowMap", "observable.map(values, { deep: false })");
        return observable.map(initialValues, { name: name, deep: false });
    },
    object: function object(props, decorators, options) {
        if (typeof arguments[1] === "string") incorrectlyUsedAsDecorator("object");
        var o = asCreateObservableOptions(options);
        return extendObservable({}, props, decorators, o);
    },
    shallowObject: function shallowObject(props, name) {
        if (typeof arguments[1] === "string") incorrectlyUsedAsDecorator("shallowObject");
        deprecated("observable.shallowObject", "observable.object(values, {}, { deep: false })");
        return observable.object(props, {}, { name: name, deep: false });
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator
};
var observable = createObservable;
// weird trick to keep our typings nicely with our funcs, and still extend the observable function
Object.keys(observableFactories).forEach(function (name) {
    return observable[name] = observableFactories[name];
});
function incorrectlyUsedAsDecorator(methodName) {
    fail$1(
    // process.env.NODE_ENV !== "production" &&
    "Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}

function deepEnhancer(v, _, name) {
    // it is an observable already, done
    if (isObservable(v)) return v;
    // something that can be converted and mutated?
    if (Array.isArray(v)) return observable.array(v, { name: name });
    if (isPlainObject(v)) return observable.object(v, undefined, { name: name });
    if (isES6Map(v)) return observable.map(v, { name: name });
    return v;
}
function shallowEnhancer(v, _, name) {
    if (v === undefined || v === null) return v;
    if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v)) return v;
    if (Array.isArray(v)) return observable.array(v, { name: name, deep: false });
    if (isPlainObject(v)) return observable.object(v, undefined, { name: name, deep: false });
    if (isES6Map(v)) return observable.map(v, { name: name, deep: false });
    return fail$1("development" !== "production" && "The shallow modifier / decorator can only used in combination with arrays, objects and maps");
}
function referenceEnhancer(newValue) {
    // never turn into an observable
    return newValue;
}
function refStructEnhancer(v, oldValue, name) {
    if ("development" !== "production" && isObservable(v)) throw "observable.struct should not be used with observable values";
    if (deepEqual(v, oldValue)) return oldValue;
    return v;
}

function iteratorSymbol() {
    return typeof Symbol === "function" && Symbol.iterator || "@@iterator";
}

function declareIterator(prototType, iteratorFactory) {
    addHiddenFinalProp(prototType, iteratorSymbol(), iteratorFactory);
}
function makeIterable(iterator) {
    iterator[iteratorSymbol()] = self;
    return iterator;
}
function self() {
    return this;
}

/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */
function transaction(action, thisArg) {
    if (thisArg === void 0) {
        thisArg = undefined;
    }
    startBatch();
    try {
        return action.apply(thisArg);
    } finally {
        endBatch();
    }
}

var ObservableMapMarker = {};
var ObservableMap = /** @class */function () {
    function ObservableMap(initialData, enhancer, name) {
        if (enhancer === void 0) {
            enhancer = deepEnhancer;
        }
        if (name === void 0) {
            name = "ObservableMap@" + getNextId();
        }
        this.enhancer = enhancer;
        this.name = name;
        this.$mobx = ObservableMapMarker;
        this._keys = new ObservableArray(undefined, referenceEnhancer, this.name + ".keys()", true);
        if (typeof Map !== "function") {
            throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
        }
        this._data = new Map();
        this._hasMap = new Map();
        this.merge(initialData);
    }
    ObservableMap.prototype._has = function (key) {
        return this._data.has(key);
    };
    ObservableMap.prototype.has = function (key) {
        if (this._hasMap.has(key)) return this._hasMap.get(key).get();
        return this._updateHasMapEntry(key, false).get();
    };
    ObservableMap.prototype.set = function (key, value) {
        var hasKey = this._has(key);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: hasKey ? "update" : "add",
                object: this,
                newValue: value,
                name: key
            });
            if (!change) return this;
            value = change.newValue;
        }
        if (hasKey) {
            this._updateValue(key, value);
        } else {
            this._addValue(key, value);
        }
        return this;
    };
    ObservableMap.prototype.delete = function (key) {
        var _this = this;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                name: key
            });
            if (!change) return false;
        }
        if (this._has(key)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy ? {
                type: "delete",
                object: this,
                oldValue: this._data.get(key).value,
                name: key
            } : null;
            if (notifySpy) spyReportStart(__assign({}, change, { name: this.name, key: key }));
            transaction(function () {
                _this._keys.remove(key);
                _this._updateHasMapEntry(key, false);
                var observable = _this._data.get(key);
                observable.setNewValue(undefined);
                _this._data.delete(key);
            });
            if (notify) notifyListeners(this, change);
            if (notifySpy) spyReportEnd();
            return true;
        }
        return false;
    };
    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
        // optimization; don't fill the hasMap if we are not observing, or remove entry if there are no observers anymore
        var entry = this._hasMap.get(key);
        if (entry) {
            entry.setNewValue(value);
        } else {
            entry = new ObservableValue(value, referenceEnhancer, this.name + "." + key + "?", false);
            this._hasMap.set(key, entry);
        }
        return entry;
    };
    ObservableMap.prototype._updateValue = function (key, newValue) {
        var observable = this._data.get(key);
        newValue = observable.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy ? {
                type: "update",
                object: this,
                oldValue: observable.value,
                name: key,
                newValue: newValue
            } : null;
            if (notifySpy) spyReportStart(__assign({}, change, { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify) notifyListeners(this, change);
            if (notifySpy) spyReportEnd();
        }
    };
    ObservableMap.prototype._addValue = function (key, newValue) {
        var _this = this;
        transaction(function () {
            var observable = new ObservableValue(newValue, _this.enhancer, _this.name + "." + key, false);
            _this._data.set(key, observable);
            newValue = observable.value; // value might have been changed
            _this._updateHasMapEntry(key, true);
            _this._keys.push(key);
        });
        var notifySpy = isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
            type: "add",
            object: this,
            name: key,
            newValue: newValue
        } : null;
        if (notifySpy) spyReportStart(__assign({}, change, { name: this.name, key: key }));
        if (notify) notifyListeners(this, change);
        if (notifySpy) spyReportEnd();
    };
    ObservableMap.prototype.get = function (key) {
        if (this.has(key)) return this.dehanceValue(this._data.get(key).get());
        return this.dehanceValue(undefined);
    };
    ObservableMap.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableMap.prototype.keys = function () {
        return this._keys[iteratorSymbol()]();
    };
    ObservableMap.prototype.values = function () {
        var self = this;
        var nextIndex = 0;
        return makeIterable({
            next: function next() {
                return nextIndex < self._keys.length ? { value: self.get(self._keys[nextIndex++]), done: false } : { value: undefined, done: true };
            }
        });
    };
    ObservableMap.prototype.entries = function () {
        var self = this;
        var nextIndex = 0;
        return makeIterable({
            next: function next() {
                if (nextIndex < self._keys.length) {
                    var key = self._keys[nextIndex++];
                    return {
                        value: [key, self.get(key)],
                        done: false
                    };
                }
                return { done: true };
            }
        });
    };
    ObservableMap.prototype.forEach = function (callback, thisArg) {
        var _this = this;
        this._keys.forEach(function (key) {
            return callback.call(thisArg, _this.get(key), key, _this);
        });
    };
    /** Merge another object into this object, returns this. */
    ObservableMap.prototype.merge = function (other) {
        var _this = this;
        if (isObservableMap(other)) {
            other = other.toJS();
        }
        transaction(function () {
            if (isPlainObject(other)) Object.keys(other).forEach(function (key) {
                return _this.set(key, other[key]);
            });else if (Array.isArray(other)) other.forEach(function (_a) {
                var _b = __read(_a, 2),
                    key = _b[0],
                    value = _b[1];
                return _this.set(key, value);
            });else if (isES6Map(other)) other.forEach(function (value, key) {
                return _this.set(key, value);
            });else if (other !== null && other !== undefined) fail$1("Cannot initialize map from " + other);
        });
        return this;
    };
    ObservableMap.prototype.clear = function () {
        var _this = this;
        transaction(function () {
            untracked(function () {
                _this._keys.slice().forEach(function (key) {
                    return _this.delete(key);
                });
            });
        });
    };
    ObservableMap.prototype.replace = function (values) {
        var _this = this;
        transaction(function () {
            // grab all the keys that are present in the new map but not present in the current map
            // and delete them from the map, then merge the new map
            // this will cause reactions only on changed values
            var newKeys = getMapLikeKeys(values);
            var oldKeys = _this._keys;
            var missingKeys = oldKeys.filter(function (k) {
                return newKeys.indexOf(k) === -1;
            });
            missingKeys.forEach(function (k) {
                return _this.delete(k);
            });
            _this.merge(values);
        });
        return this;
    };
    Object.defineProperty(ObservableMap.prototype, "size", {
        get: function get() {
            return this._keys.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    ObservableMap.prototype.toPOJO = function () {
        var _this = this;
        var res = {};
        this._keys.forEach(function (key) {
            return res["" + key] = _this.get(key);
        });
        return res;
    };
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    ObservableMap.prototype.toJS = function () {
        var _this = this;
        var res = new Map();
        this._keys.forEach(function (key) {
            return res.set(key, _this.get(key));
        });
        return res;
    };
    ObservableMap.prototype.toJSON = function () {
        // Used by JSON.stringify
        return this.toPOJO();
    };
    ObservableMap.prototype.toString = function () {
        var _this = this;
        return this.name + "[{ " + this._keys.map(function (key) {
            return key + ": " + ("" + _this.get(key));
        }).join(", ") + " }]";
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableMap.prototype.observe = function (listener, fireImmediately) {
        "development" !== "production" && invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with maps.");
        return registerListener(this, listener);
    };
    ObservableMap.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    return ObservableMap;
}();
declareIterator(ObservableMap.prototype, function () {
    return this.entries();
});
addHiddenFinalProp(ObservableMap.prototype, typeof Symbol !== "undefined" ? Symbol.toStringTag : "@@toStringTag", "Map");
/* 'var' fixes small-build issue */
var isObservableMap = createInstanceofPredicate("ObservableMap", ObservableMap);

function getAtom(thing, property) {
    if ((typeof thing === "undefined" ? "undefined" : _typeof(thing)) === "object" && thing !== null) {
        if (isObservableArray(thing)) {
            if (property !== undefined) fail$1("development" !== "production" && "It is not possible to get index atoms from arrays");
            return thing.$mobx.atom;
        }
        if (isObservableMap(thing)) {
            var anyThing = thing;
            if (property === undefined) return getAtom(anyThing._keys);
            var observable = anyThing._data.get(property) || anyThing._hasMap.get(property);
            if (!observable) fail$1("development" !== "production" && "the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
            return observable;
        }
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        if (property && !thing.$mobx) thing[property]; // See #1072
        if (isObservableObject(thing)) {
            if (!property) return fail$1("development" !== "production" && "please specify a property");
            var observable = thing.$mobx.values[property];
            if (!observable) fail$1("development" !== "production" && "no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
            return observable;
        }
        if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
            return thing;
        }
    } else if (typeof thing === "function") {
        if (isReaction(thing.$mobx)) {
            // disposer function
            return thing.$mobx;
        }
    }
    return fail$1("development" !== "production" && "Cannot obtain atom from " + thing);
}
function getAdministration(thing, property) {
    if (!thing) fail$1("Expecting some object");
    if (property !== undefined) return getAdministration(getAtom(thing, property));
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) return thing;
    if (isObservableMap(thing)) return thing;
    // Initializers run lazily when transpiling to babel, so make sure they are run...
    initializeInstance(thing);
    if (thing.$mobx) return thing.$mobx;
    fail$1("development" !== "production" && "Cannot obtain administration from " + thing);
}
function getDebugName(thing, property) {
    var named;
    if (property !== undefined) named = getAtom(thing, property);else if (isObservableObject(thing) || isObservableMap(thing)) named = getAdministration(thing);else named = getAtom(thing); // valid for arrays as well
    return named.name;
}

function onBecomeObserved(thing, arg2, arg3) {
    return interceptHook("onBecomeObserved", thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
    return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
    var atom = typeof arg2 === "string" ? getAtom(thing, arg2) : getAtom(thing);
    var cb = typeof arg2 === "string" ? arg3 : arg2;
    var orig = atom[hook];
    if (typeof orig !== "function") return fail$1("development" !== "production" && "Not an atom that can be (un)observed");
    atom[hook] = function () {
        orig.call(this);
        cb.call(this);
    };
    return function () {
        atom[hook] = orig;
    };
}

/**
 * Anything that can be used to _store_ state is an Atom in mobx. Atoms have two important jobs
 *
 * 1) detect when they are being _used_ and report this (using reportObserved). This allows mobx to make the connection between running functions and the data they used
 * 2) they should notify mobx whenever they have _changed_. This way mobx can re-run any functions (derivations) that are using this atom.
 */
var Atom;
var isAtom;
function declareAtom() {
    if (Atom) return;
    Atom = /** @class */function () {
        /**
         * Create a new atom. For debugging purposes it is recommended to give it a name.
         * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
         */
        function AtomImpl(name) {
            if (name === void 0) {
                name = "Atom@" + getNextId();
            }
            this.name = name;
            this.isPendingUnobservation = false; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed
            this.isBeingObserved = false;
            this.observers = [];
            this.observersIndexes = {};
            this.diffValue = 0;
            this.lastAccessedBy = 0;
            this.lowestObserverState = IDerivationState.NOT_TRACKING;
        }
        AtomImpl.prototype.onBecomeUnobserved = function () {
            // noop
        };
        AtomImpl.prototype.onBecomeObserved = function () {
            /* noop */
        };
        /**
        * Invoke this method to notify mobx that your atom has been used somehow.
        * Returns true if there is currently a reactive context.
        */
        AtomImpl.prototype.reportObserved = function () {
            return reportObserved(this);
        };
        /**
        * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
        */
        AtomImpl.prototype.reportChanged = function () {
            startBatch();
            propagateChanged(this);
            endBatch();
        };
        AtomImpl.prototype.toString = function () {
            return this.name;
        };
        return AtomImpl;
    }();
    isAtom = createInstanceofPredicate("Atom", Atom);
}
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
    if (onBecomeObservedHandler === void 0) {
        onBecomeObservedHandler = noop;
    }
    if (onBecomeUnobservedHandler === void 0) {
        onBecomeUnobservedHandler = noop;
    }
    var atom = new Atom(name);
    onBecomeObserved(atom, onBecomeObservedHandler);
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
    return atom;
}

var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
// Detects bug in safari 9.1.1 (or iOS 9 safari mobile). See #364
var safariPrototypeSetterInheritanceBug = function () {
    var v = false;
    var p = {};
    Object.defineProperty(p, "0", {
        set: function set() {
            v = true;
        }
    });
    Object.create(p)["0"] = 1;
    return v === false;
}();
/**
 * This array buffer contains two lists of properties, so that all arrays
 * can recycle their property definitions, which significantly improves performance of creating
 * properties on the fly.
 */
var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
// Typescript workaround to make sure ObservableArray extends Array
var StubArray = /** @class */function () {
    function StubArray() {}
    return StubArray;
}();
function inherit(ctor, proto) {
    if (typeof Object["setPrototypeOf"] !== "undefined") {
        Object["setPrototypeOf"](ctor.prototype, proto);
    } else if (typeof ctor.prototype.__proto__ !== "undefined") {
        ctor.prototype.__proto__ = proto;
    } else {
        ctor["prototype"] = proto;
    }
}
inherit(StubArray, Array.prototype);
// Weex freeze Array.prototype
// Make them writeable and configurable in prototype chain
// https://github.com/alibaba/weex/pull/1529
if (Object.isFrozen(Array)) {

    ["constructor", "push", "shift", "concat", "pop", "unshift", "replace", "find", "findIndex", "splice", "reverse", "sort"].forEach(function (key) {
        Object.defineProperty(StubArray.prototype, key, {
            configurable: true,
            writable: true,
            value: Array.prototype[key]
        });
    });
}
var ObservableArrayAdministration = /** @class */function () {
    function ObservableArrayAdministration(name, enhancer, array, owned) {
        this.array = array;
        this.owned = owned;
        this.values = [];
        this.lastKnownLength = 0;
        this.atom = new Atom(name || "ObservableArray@" + getNextId());
        this.enhancer = function (newV, oldV) {
            return enhancer(newV, oldV, name + "[..]");
        };
    }
    ObservableArrayAdministration.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) return this.dehancer(value);
        return value;
    };
    ObservableArrayAdministration.prototype.dehanceValues = function (values) {
        if (this.dehancer !== undefined && values.length > 0) return values.map(this.dehancer);
        return values;
    };
    ObservableArrayAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately === void 0) {
            fireImmediately = false;
        }
        if (fireImmediately) {
            listener({
                object: this.array,
                type: "splice",
                index: 0,
                added: this.values.slice(),
                addedCount: this.values.length,
                removed: [],
                removedCount: 0
            });
        }
        return registerListener(this, listener);
    };
    ObservableArrayAdministration.prototype.getArrayLength = function () {
        this.atom.reportObserved();
        return this.values.length;
    };
    ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
        if (typeof newLength !== "number" || newLength < 0) throw new Error("[mobx.array] Out of range: " + newLength);
        var currentLength = this.values.length;
        if (newLength === currentLength) return;else if (newLength > currentLength) {
            var newItems = new Array(newLength - currentLength);
            for (var i = 0; i < newLength - currentLength; i++) {
                newItems[i] = undefined;
            } // No Array.fill everywhere...
            this.spliceWithArray(currentLength, 0, newItems);
        } else this.spliceWithArray(newLength, currentLength - newLength);
    };
    // adds / removes the necessary numeric properties to this object
    ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
        if (oldLength !== this.lastKnownLength) throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed. Did you use peek() to change it?");
        this.lastKnownLength += delta;
        if (delta > 0 && oldLength + delta + 1 > OBSERVABLE_ARRAY_BUFFER_SIZE) reserveArrayBuffer(oldLength + delta + 1);
    };
    ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this.atom);
        var length = this.values.length;
        if (index === undefined) index = 0;else if (index > length) index = length;else if (index < 0) index = Math.max(0, length + index);
        if (arguments.length === 1) deleteCount = length - index;else if (deleteCount === undefined || deleteCount === null) deleteCount = 0;else deleteCount = Math.max(0, Math.min(deleteCount, length - index));
        if (newItems === undefined) newItems = EMPTY_ARRAY;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.array,
                type: "splice",
                index: index,
                removedCount: deleteCount,
                added: newItems
            });
            if (!change) return EMPTY_ARRAY;
            deleteCount = change.removedCount;
            newItems = change.added;
        }
        newItems = newItems.length === 0 ? newItems : newItems.map(function (v) {
            return _this.enhancer(v, undefined);
        });
        var lengthDelta = newItems.length - deleteCount;
        this.updateArrayLength(length, lengthDelta); // create or remove new entries
        var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
        if (deleteCount !== 0 || newItems.length !== 0) this.notifyArraySplice(index, newItems, res);
        return this.dehanceValues(res);
    };
    ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
        var _a;
        if (newItems.length < MAX_SPLICE_SIZE) {
            return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
        } else {
            var res = this.values.slice(index, index + deleteCount);
            this.values = this.values.slice(0, index).concat(newItems, this.values.slice(index + deleteCount));
            return res;
        }
    };
    ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
            object: this.array,
            type: "update",
            index: index,
            newValue: newValue,
            oldValue: oldValue
        } : null;
        if (notifySpy) spyReportStart(__assign({}, change, { name: this.atom.name }));
        this.atom.reportChanged();
        if (notify) notifyListeners(this, change);
        if (notifySpy) spyReportEnd();
    };
    ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
            object: this.array,
            type: "splice",
            index: index,
            removed: removed,
            added: added,
            removedCount: removed.length,
            addedCount: added.length
        } : null;
        if (notifySpy) spyReportStart(__assign({}, change, { name: this.atom.name }));
        this.atom.reportChanged();
        // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
        if (notify) notifyListeners(this, change);
        if (notifySpy) spyReportEnd();
    };
    return ObservableArrayAdministration;
}();
var ObservableArray = /** @class */function (_super) {
    __extends(ObservableArray, _super);
    function ObservableArray(initialValues, enhancer, name, owned) {
        if (name === void 0) {
            name = "ObservableArray@" + getNextId();
        }
        if (owned === void 0) {
            owned = false;
        }
        var _this = _super.call(this) || this;
        var adm = new ObservableArrayAdministration(name, enhancer, _this, owned);
        addHiddenFinalProp(_this, "$mobx", adm);
        if (initialValues && initialValues.length) {
            var prev = allowStateChangesStart(true);
            _this.spliceWithArray(0, 0, initialValues);
            allowStateChangesEnd(prev);
        }
        if (safariPrototypeSetterInheritanceBug) {
            // Seems that Safari won't use numeric prototype setter untill any * numeric property is
            // defined on the instance. After that it works fine, even if this property is deleted.
            Object.defineProperty(adm.array, "0", ENTRY_0);
        }
        return _this;
    }
    ObservableArray.prototype.intercept = function (handler) {
        return this.$mobx.intercept(handler);
    };
    ObservableArray.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately === void 0) {
            fireImmediately = false;
        }
        return this.$mobx.observe(listener, fireImmediately);
    };
    ObservableArray.prototype.clear = function () {
        return this.splice(0);
    };
    ObservableArray.prototype.concat = function () {
        var arrays = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrays[_i] = arguments[_i];
        }
        this.$mobx.atom.reportObserved();
        return Array.prototype.concat.apply(this.peek(), arrays.map(function (a) {
            return isObservableArray(a) ? a.peek() : a;
        }));
    };
    ObservableArray.prototype.replace = function (newItems) {
        return this.$mobx.spliceWithArray(0, this.$mobx.values.length, newItems);
    };
    /**
     * Converts this array back to a (shallow) javascript structure.
     * For a deep clone use mobx.toJS
     */
    ObservableArray.prototype.toJS = function () {
        return this.slice();
    };
    ObservableArray.prototype.toJSON = function () {
        // Used by JSON.stringify
        return this.toJS();
    };
    ObservableArray.prototype.peek = function () {
        this.$mobx.atom.reportObserved();
        return this.$mobx.dehanceValues(this.$mobx.values);
    };
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    ObservableArray.prototype.find = function (predicate, thisArg, fromIndex) {
        if (fromIndex === void 0) {
            fromIndex = 0;
        }
        if (arguments.length === 3) deprecated("The array.find fromIndex argument to find will not be supported anymore in the next major");
        var idx = this.findIndex.apply(this, arguments);
        return idx === -1 ? undefined : this.get(idx);
    };
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
    ObservableArray.prototype.findIndex = function (predicate, thisArg, fromIndex) {
        if (fromIndex === void 0) {
            fromIndex = 0;
        }
        if (arguments.length === 3) deprecated("The array.findIndex fromIndex argument to find will not be supported anymore in the next major");
        var items = this.peek(),
            l = items.length;
        for (var i = fromIndex; i < l; i++) {
            if (predicate.call(thisArg, items[i], i, this)) return i;
        }return -1;
    };
    /*
     * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
     * since these functions alter the inner structure of the array, the have side effects.
     * Because the have side effects, they should not be used in computed function,
     * and for that reason the do not call dependencyState.notifyObserved
     */
    ObservableArray.prototype.splice = function (index, deleteCount) {
        var newItems = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            newItems[_i - 2] = arguments[_i];
        }
        switch (arguments.length) {
            case 0:
                return [];
            case 1:
                return this.$mobx.spliceWithArray(index);
            case 2:
                return this.$mobx.spliceWithArray(index, deleteCount);
        }
        return this.$mobx.spliceWithArray(index, deleteCount, newItems);
    };
    ObservableArray.prototype.spliceWithArray = function (index, deleteCount, newItems) {
        return this.$mobx.spliceWithArray(index, deleteCount, newItems);
    };
    ObservableArray.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this.$mobx;
        adm.spliceWithArray(adm.values.length, 0, items);
        return adm.values.length;
    };
    ObservableArray.prototype.pop = function () {
        return this.splice(Math.max(this.$mobx.values.length - 1, 0), 1)[0];
    };
    ObservableArray.prototype.shift = function () {
        return this.splice(0, 1)[0];
    };
    ObservableArray.prototype.unshift = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this.$mobx;
        adm.spliceWithArray(0, 0, items);
        return adm.values.length;
    };
    ObservableArray.prototype.reverse = function () {
        // reverse by default mutates in place before returning the result
        // which makes it both a 'derivation' and a 'mutation'.
        // so we deviate from the default and just make it an dervitation
        var clone = this.slice();
        return clone.reverse.apply(clone, arguments);
    };
    ObservableArray.prototype.sort = function (compareFn) {
        // sort by default mutates in place before returning the result
        // which goes against all good practices. Let's not change the array in place!
        var clone = this.slice();
        return clone.sort.apply(clone, arguments);
    };
    ObservableArray.prototype.remove = function (value) {
        var idx = this.$mobx.dehanceValues(this.$mobx.values).indexOf(value);
        if (idx > -1) {
            this.splice(idx, 1);
            return true;
        }
        return false;
    };
    ObservableArray.prototype.move = function (fromIndex, toIndex) {
        deprecated("observableArray.move is deprecated, use .slice() & .replace() instead");
        function checkIndex(index) {
            if (index < 0) {
                throw new Error("[mobx.array] Index out of bounds: " + index + " is negative");
            }
            var length = this.$mobx.values.length;
            if (index >= length) {
                throw new Error("[mobx.array] Index out of bounds: " + index + " is not smaller than " + length);
            }
        }
        checkIndex.call(this, fromIndex);
        checkIndex.call(this, toIndex);
        if (fromIndex === toIndex) {
            return;
        }
        var oldItems = this.$mobx.values;
        var newItems;
        if (fromIndex < toIndex) {
            newItems = __spread(oldItems.slice(0, fromIndex), oldItems.slice(fromIndex + 1, toIndex + 1), [oldItems[fromIndex]], oldItems.slice(toIndex + 1));
        } else {
            // toIndex < fromIndex
            newItems = __spread(oldItems.slice(0, toIndex), [oldItems[fromIndex]], oldItems.slice(toIndex, fromIndex), oldItems.slice(fromIndex + 1));
        }
        this.replace(newItems);
    };
    // See #734, in case property accessors are unreliable...
    ObservableArray.prototype.get = function (index) {
        var impl = this.$mobx;
        if (impl) {
            if (index < impl.values.length) {
                impl.atom.reportObserved();
                return impl.dehanceValue(impl.values[index]);
            }
            console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + impl.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
        }
        return undefined;
    };
    // See #734, in case property accessors are unreliable...
    ObservableArray.prototype.set = function (index, newValue) {
        var adm = this.$mobx;
        var values = adm.values;
        if (index < values.length) {
            // update at index in range
            checkIfStateModificationsAreAllowed(adm.atom);
            var oldValue = values[index];
            if (hasInterceptors(adm)) {
                var change = interceptChange(adm, {
                    type: "update",
                    object: this,
                    index: index,
                    newValue: newValue
                });
                if (!change) return;
                newValue = change.newValue;
            }
            newValue = adm.enhancer(newValue, oldValue);
            var changed = newValue !== oldValue;
            if (changed) {
                values[index] = newValue;
                adm.notifyArrayChildUpdate(index, newValue, oldValue);
            }
        } else if (index === values.length) {
            // add a new item
            adm.spliceWithArray(index, 0, [newValue]);
        } else {
            // out of bounds
            throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
        }
    };
    return ObservableArray;
}(StubArray);
declareIterator(ObservableArray.prototype, function () {

    this.$mobx.atom.reportObserved();
    var self = this;
    var nextIndex = 0;
    return makeIterable({
        next: function next() {
            return nextIndex < self.length ? { value: self[nextIndex++], done: false } : { done: true, value: undefined };
        }
    });
});
Object.defineProperty(ObservableArray.prototype, "length", {
    enumerable: false,
    configurable: true,
    get: function get() {
        return this.$mobx.getArrayLength();
    },
    set: function set(newLength) {
        this.$mobx.setArrayLength(newLength);
    }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    addHiddenProp(ObservableArray.prototype, typeof Symbol !== "undefined" ? Symbol.toStringTag : "@@toStringTag", "Array");
}
// Internet Explorer on desktop doesn't support this.....
// So, let's don't do this to avoid different semantics
// See #1395
// addHiddenProp(
//     ObservableArray.prototype,
//     typeof Symbol !== "undefined" ? Symbol.isConcatSpreadable as any : "@@isConcatSpreadable",
//     {
//         enumerable: false,
//         configurable: true,
//         value: true
//     }
// )
/**
 * Wrap function from prototype
 */

["every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "reduce", "reduceRight", "slice", "some", "toString", "toLocaleString"].forEach(function (funcName) {
    var baseFunc = Array.prototype[funcName];
    invariant(typeof baseFunc === "function", "Base function not defined on Array prototype: '" + funcName + "'");
    addHiddenProp(ObservableArray.prototype, funcName, function () {
        return baseFunc.apply(this.peek(), arguments);
    });
});
/**
 * We don't want those to show up in `for (const key in ar)` ...
 */
makeNonEnumerable(ObservableArray.prototype, ["constructor", "intercept", "observe", "clear", "concat", "get", "replace", "toJS", "toJSON", "peek", "find", "findIndex", "splice", "spliceWithArray", "push", "pop", "set", "shift", "unshift", "reverse", "sort", "remove", "move", "toString", "toLocaleString"]);
// See #364
var ENTRY_0 = createArrayEntryDescriptor(0);
function createArrayEntryDescriptor(index) {
    return {
        enumerable: false,
        configurable: false,
        get: function get() {
            return this.get(index);
        },
        set: function set(value) {
            this.set(index, value);
        }
    };
}
function createArrayBufferItem(index) {
    Object.defineProperty(ObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}
function reserveArrayBuffer(max) {
    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max; index++) {
        createArrayBufferItem(index);
    }OBSERVABLE_ARRAY_BUFFER_SIZE = max;
}
reserveArrayBuffer(1000);
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
    return isObject(thing) && isObservableArrayAdministration(thing.$mobx);
}

var OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is an production build.";
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
function getGlobal() {
    return typeof window !== "undefined" ? window : global;
}
function getNextId() {
    return ++globalState.mobxGuid;
}
function fail$1(message) {
    invariant(false, message);
    throw "X"; // unreachable
}
function invariant(check, message) {
    if (!check) throw new Error("[mobx] " + (message || OBFUSCATED_ERROR));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */
var deprecatedMessages = [];
function deprecated(msg, thing) {
    if (false) return false;
    if (thing) {
        return deprecated("'" + msg + "', use '" + thing + "' instead.");
    }
    if (deprecatedMessages.indexOf(msg) !== -1) return false;
    deprecatedMessages.push(msg);
    console.error("[mobx] Deprecated: " + msg);
    return true;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */
function once(func) {
    var invoked = false;
    return function () {
        if (invoked) return;
        invoked = true;
        return func.apply(this, arguments);
    };
}
var noop = function noop() {};
function unique(list) {
    var res = [];
    list.forEach(function (item) {
        if (res.indexOf(item) === -1) res.push(item);
    });
    return res;
}
function isObject(value) {
    return value !== null && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object";
}
function isPlainObject(value) {
    if (value === null || (typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function makeNonEnumerable(object, propNames) {
    for (var i = 0; i < propNames.length; i++) {
        addHiddenProp(object, propNames[i], object[propNames[i]]);
    }
}
function addHiddenProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: value
    });
}
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
function isPropertyConfigurable(object, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
    return !descriptor || descriptor.configurable !== false && descriptor.writable !== false;
}
function assertPropertyConfigurable(object, prop) {
    if ("development" !== "production" && !isPropertyConfigurable(object, prop)) fail$1("Cannot make property '" + prop + "' observable, it is not configurable and writable in the target object");
}
function createInstanceofPredicate(name, clazz) {
    var propName = "isMobX" + name;
    clazz.prototype[propName] = true;
    return function (x) {
        return isObject(x) && x[propName] === true;
    };
}
function areBothNaN(a, b) {
    return typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
}
/**
 * Returns whether the argument is an array, disregarding observability.
 */
function isArrayLike(x) {
    return Array.isArray(x) || isObservableArray(x);
}
function isES6Map(thing) {
    if (getGlobal().Map !== undefined && thing instanceof getGlobal().Map) return true;
    return false;
}
function getMapLikeKeys(map) {
    if (isPlainObject(map)) return Object.keys(map);
    if (Array.isArray(map)) return map.map(function (_a) {
        var _b = __read(_a, 1),
            key = _b[0];
        return key;
    });
    if (isES6Map(map) || isObservableMap(map)) return iteratorToArray(map.keys());
    return fail$1("Cannot get keys from '" + map + "'");
}
// use Array.from in Mobx 5
function iteratorToArray(it) {
    var res = [];
    while (true) {
        var r = it.next();
        if (r.done) break;
        res.push(r.value);
    }
    return res;
}
function primitiveSymbol() {
    return typeof Symbol === "function" && Symbol.toPrimitive || "@@toPrimitive";
}
function toPrimitive(value) {
    return value === null ? null : (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" ? "" + value : value;
}

/**
 * These values will persist if global state is reset
 */
var persistentKeys = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "disableErrorBoundaries", "runId", "UNCHANGED"];
var MobXGlobals = /** @class */function () {
    function MobXGlobals() {
        /**
         * MobXGlobals version.
         * MobX compatiblity with other versions loaded in memory as long as this version matches.
         * It indicates that the global state still stores similar information
         *
         * N.B: this version is unrelated to the package version of MobX, and is only the version of the
         * internal state storage of MobX, and can be the same across many different package versions
         */
        this.version = 5;
        /**
         * globally unique token to signal unchanged
         */
        this.UNCHANGED = {};
        /**
         * Currently running derivation
         */
        this.trackingDerivation = null;
        /**
         * Are we running a computation currently? (not a reaction)
         */
        this.computationDepth = 0;
        /**
         * Each time a derivation is tracked, it is assigned a unique run-id
         */
        this.runId = 0;
        /**
         * 'guid' for general purpose. Will be persisted amongst resets.
         */
        this.mobxGuid = 0;
        /**
         * Are we in a batch block? (and how many of them)
         */
        this.inBatch = 0;
        /**
         * Observables that don't have observers anymore, and are about to be
         * suspended, unless somebody else accesses it in the same batch
         *
         * @type {IObservable[]}
         */
        this.pendingUnobservations = [];
        /**
         * List of scheduled, not yet executed, reactions.
         */
        this.pendingReactions = [];
        /**
         * Are we currently processing reactions?
         */
        this.isRunningReactions = false;
        /**
         * Is it allowed to change observables at this point?
         * In general, MobX doesn't allow that when running computations and React.render.
         * To ensure that those functions stay pure.
         */
        this.allowStateChanges = true;
        /**
         * If strict mode is enabled, state changes are by default not allowed
         */
        this.enforceActions = false;
        /**
         * Spy callbacks
         */
        this.spyListeners = [];
        /**
         * Globally attached error handlers that react specifically to errors in reactions
         */
        this.globalReactionErrorHandlers = [];
        /**
         * Warn if computed values are accessed outside a reactive context
         */
        this.computedRequiresReaction = false;
        /*
         * Don't catch and rethrow exceptions. This is useful for inspecting the state of
         * the stack when an exception occurs while debugging.
         */
        this.disableErrorBoundaries = false;
    }
    return MobXGlobals;
}();
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = function () {
    var global = getGlobal();
    if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals) canMergeGlobalState = false;
    if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version) canMergeGlobalState = false;
    if (!canMergeGlobalState) {
        setTimeout(function () {
            if (!isolateCalled) {
                fail$1("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
            }
        }, 1);
        return new MobXGlobals();
    } else if (global.__mobxGlobals) {
        global.__mobxInstanceCount += 1;
        if (!global.__mobxGlobals.UNCHANGED) global.__mobxGlobals.UNCHANGED = {}; // make merge backward compatible
        return global.__mobxGlobals;
    } else {
        global.__mobxInstanceCount = 1;
        return global.__mobxGlobals = new MobXGlobals();
    }
}();
function isolateGlobalState() {
    if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) fail$1("isolateGlobalState should be called before MobX is running any reactions");
    isolateCalled = true;
    if (canMergeGlobalState) {
        if (--getGlobal().__mobxInstanceCount === 0) getGlobal().__mobxGlobals = undefined;
        globalState = new MobXGlobals();
    }
}
function getGlobalState() {
    return globalState;
}
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */
function resetGlobalState() {
    var defaultGlobals = new MobXGlobals();
    for (var key in defaultGlobals) {
        if (persistentKeys.indexOf(key) === -1) globalState[key] = defaultGlobals[key];
    }globalState.allowStateChanges = !globalState.enforceActions;
}

function getDependencyTree(thing, property) {
    return nodeToDependencyTree(getAtom(thing, property));
}
function nodeToDependencyTree(node) {
    var result = {
        name: node.name
    };
    if (node.observing && node.observing.length > 0) result.dependencies = unique(node.observing).map(nodeToDependencyTree);
    return result;
}
function getObserverTree(thing, property) {
    return nodeToObserverTree(getAtom(thing, property));
}
function nodeToObserverTree(node) {
    var result = {
        name: node.name
    };
    if (hasObservers(node)) result.observers = getObservers(node).map(nodeToObserverTree);
    return result;
}

function hasObservers(observable) {
    return observable.observers && observable.observers.length > 0;
}
function getObservers(observable) {
    return observable.observers;
}
// function invariantObservers(observable: IObservable) {
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }
function addObserver(observable, node) {
    // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
    // invariantObservers(observable);
    var l = observable.observers.length;
    if (l) {
        // because object assignment is relatively expensive, let's not store data about index 0.
        observable.observersIndexes[node.__mapid] = l;
    }
    observable.observers[l] = node;
    if (observable.lowestObserverState > node.dependenciesState) observable.lowestObserverState = node.dependenciesState;
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}
function removeObserver(observable, node) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
    // invariantObservers(observable);
    if (observable.observers.length === 1) {
        // deleting last observer
        observable.observers.length = 0;
        queueForUnobservation(observable);
    } else {
        // deleting from _observersIndexes is straight forward, to delete from _observers, let's swap `node` with last element
        var list = observable.observers;
        var map = observable.observersIndexes;
        var filler = list.pop(); // get last element, which should fill the place of `node`, so the array doesn't have holes
        if (filler !== node) {
            // otherwise node was the last element, which already got removed from array
            var index = map[node.__mapid] || 0; // getting index of `node`. this is the only place we actually use map.
            if (index) {
                // map store all indexes but 0, see comment in `addObserver`
                map[filler.__mapid] = index;
            } else {
                delete map[filler.__mapid];
            }
            list[index] = filler;
        }
        delete map[node.__mapid];
    }
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");
}
function queueForUnobservation(observable) {
    if (observable.isPendingUnobservation === false) {
        // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
        observable.isPendingUnobservation = true;
        globalState.pendingUnobservations.push(observable);
    }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */
function startBatch() {
    globalState.inBatch++;
}
function endBatch() {
    if (--globalState.inBatch === 0) {
        runReactions();
        // the batch is actually about to finish, all unobserving should happen here.
        var list = globalState.pendingUnobservations;
        for (var i = 0; i < list.length; i++) {
            var observable = list[i];
            observable.isPendingUnobservation = false;
            if (observable.observers.length === 0) {
                if (observable.isBeingObserved) {
                    // if this observable had reactive observers, trigger the hooks
                    observable.isBeingObserved = false;
                    observable.onBecomeUnobserved();
                }
                if (observable instanceof ComputedValue) {
                    // computed values are automatically teared down when the last observer leaves
                    // this process happens recursively, this computed might be the last observabe of another, etc..
                    observable.suspend();
                }
            }
        }
        globalState.pendingUnobservations = [];
    }
}
function reportObserved(observable) {
    var derivation = globalState.trackingDerivation;
    if (derivation !== null) {
        /**
         * Simple optimization, give each derivation run an unique id (runId)
         * Check if last time this observable was accessed the same runId is used
         * if this is the case, the relation is already known
         */
        if (derivation.runId !== observable.lastAccessedBy) {
            observable.lastAccessedBy = derivation.runId;
            derivation.newObserving[derivation.unboundDepsCount++] = observable;
            if (!observable.isBeingObserved) {
                observable.isBeingObserved = true;
                observable.onBecomeObserved();
            }
        }
        return true;
    } else if (observable.observers.length === 0 && globalState.inBatch > 0) {
        queueForUnobservation(observable);
    }
    return false;
}
// function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }
/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes
function propagateChanged(observable) {
    // invariantLOS(observable, "changed start");
    if (observable.lowestObserverState === IDerivationState.STALE) return;
    observable.lowestObserverState = IDerivationState.STALE;
    var observers = observable.observers;
    var i = observers.length;
    while (i--) {
        var d = observers[i];
        if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
        d.dependenciesState = IDerivationState.STALE;
    }
    // invariantLOS(observable, "changed end");
}
// Called by ComputedValue when it recalculate and its value changed
function propagateChangeConfirmed(observable) {
    // invariantLOS(observable, "confirmed start");
    if (observable.lowestObserverState === IDerivationState.STALE) return;
    observable.lowestObserverState = IDerivationState.STALE;
    var observers = observable.observers;
    var i = observers.length;
    while (i--) {
        var d = observers[i];
        if (d.dependenciesState === IDerivationState.POSSIBLY_STALE) d.dependenciesState = IDerivationState.STALE;else if (d.dependenciesState === IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
        ) observable.lowestObserverState = IDerivationState.UP_TO_DATE;
    }
    // invariantLOS(observable, "confirmed end");
}
// Used by computed when its dependency changed, but we don't wan't to immediately recompute.
function propagateMaybeChanged(observable) {
    // invariantLOS(observable, "maybe start");
    if (observable.lowestObserverState !== IDerivationState.UP_TO_DATE) return;
    observable.lowestObserverState = IDerivationState.POSSIBLY_STALE;
    var observers = observable.observers;
    var i = observers.length;
    while (i--) {
        var d = observers[i];
        if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
            d.dependenciesState = IDerivationState.POSSIBLY_STALE;
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
    }
    // invariantLOS(observable, "maybe end");
}
function logTraceInfo(derivation, observable) {
    console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable.name + "'");
    if (derivation.isTracing === TraceMode.BREAK) {
        var lines = [];
        printDepTree(getDependencyTree(derivation), lines, 1);
        // prettier-ignore
        new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString() : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
    }
}
function printDepTree(tree, lines, depth) {
    if (lines.length >= 1000) {
        lines.push("(and many more)");
        return;
    }
    lines.push("" + new Array(depth).join("\t") + tree.name); // MWE: not the fastest, but the easiest way :)
    if (tree.dependencies) tree.dependencies.forEach(function (child) {
        return printDepTree(child, lines, depth + 1);
    });
}

var IDerivationState;
(function (IDerivationState) {
    // before being run or (outside batch and not being observed)
    // at this point derivation is not holding any data about dependency tree
    IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING";
    // no shallow dependency changed since last computation
    // won't recalculate derivation
    // this is what makes mobx fast
    IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE";
    // some deep dependency changed, but don't know if shallow dependency changed
    // will require to check first if UP_TO_DATE or POSSIBLY_STALE
    // currently only ComputedValue will propagate POSSIBLY_STALE
    //
    // having this state is second big optimization:
    // don't have to recompute on every dependency change, but only when it's needed
    IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE";
    // A shallow dependency has changed since last computation and the derivation
    // will need to recompute when it's needed next.
    IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(IDerivationState || (exports.IDerivationState = IDerivationState = {}));
var TraceMode;
(function (TraceMode) {
    TraceMode[TraceMode["NONE"] = 0] = "NONE";
    TraceMode[TraceMode["LOG"] = 1] = "LOG";
    TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));
var CaughtException = /** @class */function () {
    function CaughtException(cause) {
        this.cause = cause;
        // Empty
    }
    return CaughtException;
}();
function isCaughtException(e) {
    return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */
function shouldCompute(derivation) {
    switch (derivation.dependenciesState) {
        case IDerivationState.UP_TO_DATE:
            return false;
        case IDerivationState.NOT_TRACKING:
        case IDerivationState.STALE:
            return true;
        case IDerivationState.POSSIBLY_STALE:
            {
                var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.
                var obs = derivation.observing,
                    l = obs.length;
                for (var i = 0; i < l; i++) {
                    var obj = obs[i];
                    if (isComputedValue(obj)) {
                        if (globalState.disableErrorBoundaries) {
                            obj.get();
                        } else {
                            try {
                                obj.get();
                            } catch (e) {
                                // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                                untrackedEnd(prevUntracked);
                                return true;
                            }
                        }
                        // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
                        // and `derivation` is an observer of `obj`
                        // invariantShouldCompute(derivation)
                        if (derivation.dependenciesState === IDerivationState.STALE) {
                            untrackedEnd(prevUntracked);
                            return true;
                        }
                    }
                }
                changeDependenciesStateTo0(derivation);
                untrackedEnd(prevUntracked);
                return false;
            }
    }
}
// function invariantShouldCompute(derivation: IDerivation) {
//     const newDepState = (derivation as any).dependenciesState
//     if (
//         process.env.NODE_ENV === "production" &&
//         (newDepState === IDerivationState.POSSIBLY_STALE ||
//             newDepState === IDerivationState.NOT_TRACKING)
//     )
//         fail("Illegal dependency state")
// }
function isComputingDerivation() {
    return globalState.trackingDerivation !== null; // filter out actions inside computations
}
function checkIfStateModificationsAreAllowed(atom) {
    var hasObservers$$1 = atom.observers.length > 0;
    // Should never be possible to change an observed observable from inside computed, see #798
    if (globalState.computationDepth > 0 && hasObservers$$1) fail$1("development" !== "production" && "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + atom.name);
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers$$1 || globalState.enforceActions === "strict")) fail$1("development" !== "production" && (globalState.enforceActions ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") + atom.name);
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */
function trackDerivedFunction(derivation, f, context) {
    // pre allocate array allocation + room for variation in deps
    // array will be trimmed by bindDependencies
    changeDependenciesStateTo0(derivation);
    derivation.newObserving = new Array(derivation.observing.length + 100);
    derivation.unboundDepsCount = 0;
    derivation.runId = ++globalState.runId;
    var prevTracking = globalState.trackingDerivation;
    globalState.trackingDerivation = derivation;
    var result;
    if (globalState.disableErrorBoundaries === true) {
        result = f.call(context);
    } else {
        try {
            result = f.call(context);
        } catch (e) {
            result = new CaughtException(e);
        }
    }
    globalState.trackingDerivation = prevTracking;
    bindDependencies(derivation);
    return result;
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */
function bindDependencies(derivation) {
    // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
    var prevObserving = derivation.observing;
    var observing = derivation.observing = derivation.newObserving;
    var lowestNewObservingDerivationState = IDerivationState.UP_TO_DATE;
    // Go through all new observables and check diffValue: (this list can contain duplicates):
    //   0: first occurrence, change to 1 and keep it
    //   1: extra occurrence, drop it
    var i0 = 0,
        l = derivation.unboundDepsCount;
    for (var i = 0; i < l; i++) {
        var dep = observing[i];
        if (dep.diffValue === 0) {
            dep.diffValue = 1;
            if (i0 !== i) observing[i0] = dep;
            i0++;
        }
        // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
        // not hitting the condition
        if (dep.dependenciesState > lowestNewObservingDerivationState) {
            lowestNewObservingDerivationState = dep.dependenciesState;
        }
    }
    observing.length = i0;
    derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
    // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
    //   0: it's not in new observables, unobserve it
    //   1: it keeps being observed, don't want to notify it. change to 0
    l = prevObserving.length;
    while (l--) {
        var dep = prevObserving[l];
        if (dep.diffValue === 0) {
            removeObserver(dep, derivation);
        }
        dep.diffValue = 0;
    }
    // Go through all new observables and check diffValue: (now it should be unique)
    //   0: it was set to 0 in last loop. don't need to do anything.
    //   1: it wasn't observed, let's observe it. set back to 0
    while (i0--) {
        var dep = observing[i0];
        if (dep.diffValue === 1) {
            dep.diffValue = 0;
            addObserver(dep, derivation);
        }
    }
    // Some new observed derivations may become stale during this derivation computation
    // so they have had no chance to propagate staleness (#916)
    if (lowestNewObservingDerivationState !== IDerivationState.UP_TO_DATE) {
        derivation.dependenciesState = lowestNewObservingDerivationState;
        derivation.onBecomeStale();
    }
}
function clearObserving(derivation) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
    var obs = derivation.observing;
    derivation.observing = [];
    var i = obs.length;
    while (i--) {
        removeObserver(obs[i], derivation);
    }derivation.dependenciesState = IDerivationState.NOT_TRACKING;
}
function untracked(action) {
    var prev = untrackedStart();
    var res = action();
    untrackedEnd(prev);
    return res;
}
function untrackedStart() {
    var prev = globalState.trackingDerivation;
    globalState.trackingDerivation = null;
    return prev;
}
function untrackedEnd(prev) {
    globalState.trackingDerivation = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */
function changeDependenciesStateTo0(derivation) {
    if (derivation.dependenciesState === IDerivationState.UP_TO_DATE) return;
    derivation.dependenciesState = IDerivationState.UP_TO_DATE;
    var obs = derivation.observing;
    var i = obs.length;
    while (i--) {
        obs[i].lowestObserverState = IDerivationState.UP_TO_DATE;
    }
}

function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var enterBreakPoint = false;
    if (typeof args[args.length - 1] === "boolean") enterBreakPoint = args.pop();
    var derivation = getAtomFromArgs(args);
    if (!derivation) {
        return fail$1("development" !== "production" && "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    }
    if (derivation.isTracing === TraceMode.NONE) {
        console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
    }
    derivation.isTracing = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}
function getAtomFromArgs(args) {
    switch (args.length) {
        case 0:
            return globalState.trackingDerivation;
        case 1:
            return getAtom(args[0]);
        case 2:
            return getAtom(args[0], args[1]);
    }
}

var Reaction = /** @class */function () {
    function Reaction(name, onInvalidate, errorHandler) {
        if (name === void 0) {
            name = "Reaction@" + getNextId();
        }
        this.name = name;
        this.onInvalidate = onInvalidate;
        this.errorHandler = errorHandler;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = [];
        this.dependenciesState = IDerivationState.NOT_TRACKING;
        this.diffValue = 0;
        this.runId = 0;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.isDisposed = false;
        this._isScheduled = false;
        this._isTrackPending = false;
        this._isRunning = false;
        this.isTracing = TraceMode.NONE;
    }
    Reaction.prototype.onBecomeStale = function () {
        this.schedule();
    };
    Reaction.prototype.schedule = function () {
        if (!this._isScheduled) {
            this._isScheduled = true;
            globalState.pendingReactions.push(this);
            runReactions();
        }
    };
    Reaction.prototype.isScheduled = function () {
        return this._isScheduled;
    };
    /**
     * internal, use schedule() if you intend to kick off a reaction
     */
    Reaction.prototype.runReaction = function () {
        if (!this.isDisposed) {
            startBatch();
            this._isScheduled = false;
            if (shouldCompute(this)) {
                this._isTrackPending = true;
                try {
                    this.onInvalidate();
                    if (this._isTrackPending && isSpyEnabled()) {
                        // onInvalidate didn't trigger track right away..
                        spyReport({
                            name: this.name,
                            type: "scheduled-reaction"
                        });
                    }
                } catch (e) {
                    this.reportExceptionInDerivation(e);
                }
            }
            endBatch();
        }
    };
    Reaction.prototype.track = function (fn) {
        startBatch();
        var notify = isSpyEnabled();
        var startTime;
        if (notify) {
            startTime = Date.now();
            spyReportStart({
                name: this.name,
                type: "reaction"
            });
        }
        this._isRunning = true;
        var result = trackDerivedFunction(this, fn, undefined);
        this._isRunning = false;
        this._isTrackPending = false;
        if (this.isDisposed) {
            // disposed during last run. Clean up everything that was bound after the dispose call.
            clearObserving(this);
        }
        if (isCaughtException(result)) this.reportExceptionInDerivation(result.cause);
        if (notify) {
            spyReportEnd({
                time: Date.now() - startTime
            });
        }
        endBatch();
    };
    Reaction.prototype.reportExceptionInDerivation = function (error) {
        var _this = this;
        if (this.errorHandler) {
            this.errorHandler(error, this);
            return;
        }
        if (globalState.disableErrorBoundaries) throw error;
        var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this;
        console.error(message, error);
        /** If debugging brought you here, please, read the above message :-). Tnx! */
        if (isSpyEnabled()) {
            spyReport({
                type: "error",
                name: this.name,
                message: message,
                error: "" + error
            });
        }
        globalState.globalReactionErrorHandlers.forEach(function (f) {
            return f(error, _this);
        });
    };
    Reaction.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            if (!this._isRunning) {
                // if disposed while running, clean up later. Maybe not optimal, but rare case
                startBatch();
                clearObserving(this);
                endBatch();
            }
        }
    };
    Reaction.prototype.getDisposer = function () {
        var r = this.dispose.bind(this);
        r.$mobx = this;
        return r;
    };
    Reaction.prototype.toString = function () {
        return "Reaction[" + this.name + "]";
    };
    Reaction.prototype.trace = function (enterBreakPoint) {
        if (enterBreakPoint === void 0) {
            enterBreakPoint = false;
        }
        trace(this, enterBreakPoint);
    };
    return Reaction;
}();
function onReactionError(handler) {
    globalState.globalReactionErrorHandlers.push(handler);
    return function () {
        var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
        if (idx >= 0) globalState.globalReactionErrorHandlers.splice(idx, 1);
    };
}
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */
var MAX_REACTION_ITERATIONS = 100;
var reactionScheduler = function reactionScheduler(f) {
    return f();
};
function runReactions() {
    // Trampolining, if runReactions are already running, new reactions will be picked up
    if (globalState.inBatch > 0 || globalState.isRunningReactions) return;
    reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
    globalState.isRunningReactions = true;
    var allReactions = globalState.pendingReactions;
    var iterations = 0;
    // While running reactions, new reactions might be triggered.
    // Hence we work with two variables and check whether
    // we converge to no remaining reactions after a while.
    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]));
            allReactions.splice(0); // clear reactions
        }
        var remainingReactions = allReactions.splice(0);
        for (var i = 0, l = remainingReactions.length; i < l; i++) {
            remainingReactions[i].runReaction();
        }
    }
    globalState.isRunningReactions = false;
}
var isReaction = createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
    var baseScheduler = reactionScheduler;
    reactionScheduler = function reactionScheduler(f) {
        return fn(function () {
            return baseScheduler(f);
        });
    };
}

function observe(thing, propOrCb, cbOrFire, fireImmediately) {
    if (typeof cbOrFire === "function") return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);else return observeObservable(thing, propOrCb, cbOrFire);
}
function observeObservable(thing, listener, fireImmediately) {
    return getAdministration(thing).observe(listener, fireImmediately);
}
function observeObservableProperty(thing, property, listener, fireImmediately) {
    return getAdministration(thing, property).observe(listener, fireImmediately);
}

function intercept(thing, propOrHandler, handler) {
    if (typeof handler === "function") return interceptProperty(thing, propOrHandler, handler);else return interceptInterceptable(thing, propOrHandler);
}
function interceptInterceptable(thing, handler) {
    return getAdministration(thing).intercept(handler);
}
function interceptProperty(thing, property, handler) {
    return getAdministration(thing, property).intercept(handler);
}

function when(predicate, arg1, arg2) {
    if (arguments.length === 1 || arg1 && (typeof arg1 === "undefined" ? "undefined" : _typeof(arg1)) === "object") return whenPromise(predicate, arg1);
    return _when(predicate, arg1, arg2 || {});
}
function _when(predicate, effect, opts) {
    var timeoutHandle;
    if (typeof opts.timeout === "number") {
        timeoutHandle = setTimeout(function () {
            if (!disposer.$mobx.isDisposed) {
                disposer();
                var error = new Error("WHEN_TIMEOUT");
                if (opts.onError) opts.onError(error);else throw error;
            }
        }, opts.timeout);
    }
    opts.name = opts.name || "When@" + getNextId();
    var effectAction = createAction(opts.name + "-effect", effect);
    var disposer = autorun(function (r) {
        if (predicate()) {
            r.dispose();
            if (timeoutHandle) clearTimeout(timeoutHandle);
            effectAction();
        }
    }, opts);
    return disposer;
}
function whenPromise(predicate, opts) {
    if ("development" !== "production" && opts && opts.onError) return fail$1("the options 'onError' and 'promise' cannot be combined");
    var cancel;
    var res = new Promise(function (resolve, reject) {
        var disposer = _when(predicate, resolve, __assign({}, opts, { onError: reject }));
        cancel = function cancel() {
            disposer();
            reject("WHEN_CANCELLED");
        };
    });
    res.cancel = cancel;
    return res;
}

function keys(obj) {
    if (isObservableObject(obj)) {
        return obj.$mobx.getKeys();
    }
    if (isObservableMap(obj)) {
        return obj._keys.slice();
    }
    if (isObservableArray(obj)) {
        return obj.map(function (_, index) {
            return index;
        });
    }
    return fail$1("development" !== "production" && "'keys()' can only be used on observable objects, arrays and maps");
}
function values(obj) {
    if (isObservableObject(obj)) {
        return keys(obj).map(function (key) {
            return obj[key];
        });
    }
    if (isObservableMap(obj)) {
        return keys(obj).map(function (key) {
            return obj.get(key);
        });
    }
    if (isObservableArray(obj)) {
        return obj.slice();
    }
    return fail$1("development" !== "production" && "'values()' can only be used on observable objects, arrays and maps");
}
function entries(obj) {
    if (isObservableObject(obj)) {
        return keys(obj).map(function (key) {
            return [key, obj[key]];
        });
    }
    if (isObservableMap(obj)) {
        return keys(obj).map(function (key) {
            return [key, obj.get(key)];
        });
    }
    if (isObservableArray(obj)) {
        return obj.map(function (key, index) {
            return [index, key];
        });
    }
    return fail$1("development" !== "production" && "'entries()' can only be used on observable objects, arrays and maps");
}
function set(obj, key, value) {
    if (arguments.length === 2) {
        startBatch();
        var values_1 = key;
        try {
            for (var key_1 in values_1) {
                set(obj, key_1, values_1[key_1]);
            }
        } finally {
            endBatch();
        }
        return;
    }
    if (isObservableObject(obj)) {
        var adm = obj.$mobx;
        var existingObservable = adm.values[key];
        if (existingObservable) {
            adm.write(obj, key, value);
        } else {
            defineObservableProperty(obj, key, value, adm.defaultEnhancer);
        }
    } else if (isObservableMap(obj)) {
        obj.set(key, value);
    } else if (isObservableArray(obj)) {
        if (typeof key !== "number") key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        startBatch();
        if (key >= obj.length) obj.length = key + 1;
        obj[key] = value;
        endBatch();
    } else {
        return fail$1("development" !== "production" && "'set()' can only be used on observable objects, arrays and maps");
    }
}
function remove(obj, key) {
    if (isObservableObject(obj)) {

        obj.$mobx.remove(key);
    } else if (isObservableMap(obj)) {
        obj.delete(key);
    } else if (isObservableArray(obj)) {
        if (typeof key !== "number") key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        obj.splice(key, 1);
    } else {
        return fail$1("development" !== "production" && "'remove()' can only be used on observable objects, arrays and maps");
    }
}
function has$1(obj, key) {
    if (isObservableObject(obj)) {
        // return keys(obj).indexOf(key) >= 0
        var adm = getAdministration(obj);
        adm.getKeys(); // make sure we get notified of key changes, but for performance, use the values map to look up existence
        return !!adm.values[key];
    } else if (isObservableMap(obj)) {
        return obj.has(key);
    } else if (isObservableArray(obj)) {
        return key >= 0 && key < obj.length;
    } else {
        return fail$1("development" !== "production" && "'has()' can only be used on observable objects, arrays and maps");
    }
}
function get(obj, key) {
    if (!has$1(obj, key)) return undefined;
    if (isObservableObject(obj)) {
        return obj[key];
    } else if (isObservableMap(obj)) {
        return obj.get(key);
    } else if (isObservableArray(obj)) {
        return obj[key];
    } else {
        return fail$1("development" !== "production" && "'get()' can only be used on observable objects, arrays and maps");
    }
}

function decorate(thing, decorators) {
    "development" !== "production" && invariant(isPlainObject(decorators), "Decorators should be a key value map");
    var target = typeof thing === "function" ? thing.prototype : thing;
    var _loop_1 = function _loop_1(prop) {
        var propertyDecorators = decorators[prop];
        if (!Array.isArray(propertyDecorators)) {
            propertyDecorators = [propertyDecorators];
        }
        "development" !== "production" && invariant(propertyDecorators.every(function (decorator) {
            return typeof decorator === "function";
        }), "Decorate: expected a decorator function or array of decorator functions for '" + prop + "'");
        var descriptor = Object.getOwnPropertyDescriptor(target, prop);
        var newDescriptor = propertyDecorators.reduce(function (accDescriptor, decorator) {
            return decorator(target, prop, accDescriptor);
        }, descriptor);
        if (newDescriptor) Object.defineProperty(target, prop, newDescriptor);
    };
    for (var prop in decorators) {
        _loop_1(prop);
    }
    return thing;
}

function configure(options) {
    var enforceActions = options.enforceActions,
        computedRequiresReaction = options.computedRequiresReaction,
        disableErrorBoundaries = options.disableErrorBoundaries,
        arrayBuffer = options.arrayBuffer,
        reactionScheduler = options.reactionScheduler;
    if (enforceActions !== undefined) {
        if (typeof enforceActions === "boolean" || enforceActions === "strict") deprecated("Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead");
        var ea = void 0;
        switch (enforceActions) {
            case true:
            case "observed":
                ea = true;
                break;
            case false:
            case "never":
                ea = false;
                break;
            case "strict":
            case "always":
                ea = "strict";
                break;
            default:
                fail("Invalid value for 'enforceActions': '" + enforceActions + "', expected 'never', 'always' or 'observed'");
        }
        globalState.enforceActions = ea;
        globalState.allowStateChanges = ea === true || ea === "strict" ? false : true;
    }
    if (computedRequiresReaction !== undefined) {
        globalState.computedRequiresReaction = !!computedRequiresReaction;
    }
    if (options.isolateGlobalState === true) {
        isolateGlobalState();
    }
    if (disableErrorBoundaries !== undefined) {
        if (disableErrorBoundaries === true) console.warn("WARNING: Debug feature only. MobX will NOT recover from errors if this is on.");
        globalState.disableErrorBoundaries = !!disableErrorBoundaries;
    }
    if (typeof arrayBuffer === "number") {
        reserveArrayBuffer(arrayBuffer);
    }
    if (reactionScheduler) {
        setReactionScheduler(reactionScheduler);
    }
}

var generatorId = 0;
function flow(generator) {
    if (arguments.length !== 1) fail$1("development" && "Flow expects one 1 argument and cannot be used as decorator");
    var name = generator.name || "<unnamed flow>";
    // Implementation based on https://github.com/tj/co/blob/master/index.js
    return function () {
        var ctx = this;
        var args = arguments;
        var runId = ++generatorId;
        var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
        var rejector;
        var pendingPromise = undefined;
        var res = new Promise(function (resolve, reject) {
            var stepId = 0;
            rejector = reject;
            function onFulfilled(res) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
                } catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function onRejected(err) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.throw).call(gen, err);
                } catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function next(ret) {
                if (ret && typeof ret.then === "function") {
                    // an async iterator
                    ret.then(next, reject);
                    return;
                }
                if (ret.done) return resolve(ret.value);
                pendingPromise = Promise.resolve(ret.value);
                return pendingPromise.then(onFulfilled, onRejected);
            }
            onFulfilled(undefined); // kick off the process
        });
        res.cancel = action(name + " - runid: " + runId + " - cancel", function () {
            try {
                if (pendingPromise) cancelPromise(pendingPromise);
                // Finally block can return (or yield) stuff..
                var res_1 = gen.return();
                // eat anything that promise would do, it's cancelled!
                var yieldedPromise = Promise.resolve(res_1.value);
                yieldedPromise.then(noop, noop);
                cancelPromise(yieldedPromise); // maybe it can be cancelled :)
                // reject our original promise
                rejector(new Error("FLOW_CANCELLED"));
            } catch (e) {
                rejector(e); // there could be a throwing finally block
            }
        });
        return res;
    };
}
function cancelPromise(promise) {
    if (typeof promise.cancel === "function") promise.cancel();
}

var defaultOptions = {
    detectCycles: true,
    exportMapsAsObjects: true,
    recurseEverything: false
};
function cache(map, key, value, options) {
    if (options.detectCycles) map.set(key, value);
    return value;
}
function toJSHelper(source, options, __alreadySeen) {
    if (!options.recurseEverything && !isObservable(source)) return source;
    if ((typeof source === "undefined" ? "undefined" : _typeof(source)) !== "object") return source;
    // Directly return null if source is null
    if (source === null) return null;
    // Directly return the Date object itself if contained in the observable
    if (source instanceof Date) return source;
    if (isObservableValue(source)) return toJSHelper(source.get(), options, __alreadySeen);
    // make sure we track the keys of the object
    if (isObservable(source)) keys(source);
    var detectCycles = options.detectCycles === true;
    if (detectCycles && source !== null && __alreadySeen.has(source)) {
        return __alreadySeen.get(source);
    }
    if (isObservableArray(source) || Array.isArray(source)) {
        var res_1 = cache(__alreadySeen, source, [], options);
        var toAdd = source.map(function (value) {
            return toJSHelper(value, options, __alreadySeen);
        });
        res_1.length = toAdd.length;
        for (var i = 0, l = toAdd.length; i < l; i++) {
            res_1[i] = toAdd[i];
        }return res_1;
    }
    if (isObservableMap(source) || Object.getPrototypeOf(source) === Map.prototype) {
        if (options.exportMapsAsObjects === false) {
            var res_2 = cache(__alreadySeen, source, new Map(), options);
            source.forEach(function (value, key) {
                res_2.set(key, toJSHelper(value, options, __alreadySeen));
            });
            return res_2;
        } else {
            var res_3 = cache(__alreadySeen, source, {}, options);
            source.forEach(function (value, key) {
                res_3[key] = toJSHelper(value, options, __alreadySeen);
            });
            return res_3;
        }
    }
    // Fallback to the situation that source is an ObservableObject or a plain object
    var res = cache(__alreadySeen, source, {}, options);
    for (var key in source) {
        res[key] = toJSHelper(source[key], options, __alreadySeen);
    }
    return res;
}
function toJS(source, options) {
    // backward compatibility
    if (typeof options === "boolean") options = { detectCycles: options };
    if (!options) options = defaultOptions;
    options.detectCycles = options.detectCycles === undefined ? options.recurseEverything === true : options.detectCycles === true;
    var __alreadySeen;
    if (options.detectCycles) __alreadySeen = new Map();
    return toJSHelper(source, options, __alreadySeen);
}

function interceptReads(thing, propOrHandler, handler) {
    var target;
    if (isObservableMap(thing) || isObservableArray(thing) || isObservableValue(thing)) {
        target = getAdministration(thing);
    } else if (isObservableObject(thing)) {
        if (typeof propOrHandler !== "string") return fail$1("development" !== "production" && "InterceptReads can only be used with a specific property, not with an object in general");
        target = getAdministration(thing, propOrHandler);
    } else {
        return fail$1("development" !== "production" && "Expected observable map, object or array as first array");
    }
    if (target.dehancer !== undefined) return fail$1("development" !== "production" && "An intercept reader was already established");
    target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
    return function () {
        target.dehancer = undefined;
    };
}

/**
 * (c) Michel Weststrate 2015 - 2016
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
try {
    // define process.env if needed
    // if this is not a production build in the first place
    // (in which case the expression below would be substituted with 'production')
    "development";
} catch (e) {
    var g = typeof window !== "undefined" ? window : global;
    if (typeof process === "undefined") g.process = {};
    g.process.env = {};
}

// This line should come after all the imports as well, for the same reason
// as noted above. I will file a bug with rollupjs - @rossipedia
// Devtools support
if ((typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ? "undefined" : _typeof(__MOBX_DEVTOOLS_GLOBAL_HOOK__)) === "object") {
    // See: https://github.com/andykog/mobx-devtools/
    __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy: spy,
        extras: {
            getDebugName: getDebugName
        }
    });
}
// TODO: remove in some future build
if ("development" !== "production" && typeof module !== "undefined" && typeof module.exports !== "undefined") {
    var warnedAboutDefaultExport_1 = false;
    Object.defineProperty(module.exports, "default", {
        enumerable: false,
        get: function get() {
            if (!warnedAboutDefaultExport_1) {
                warnedAboutDefaultExport_1 = true;
                console.warn("The MobX package does not have a default export. Use 'import { thing } from \"mobx\"' (recommended) or 'import * as mobx from \"mobx\"' instead.\"");
            }
            return undefined;
        }
    });
    ["extras", "Atom", "BaseAtom", "asFlat", "asMap", "asReference", "asStructure", "autorunAsync", "createTranformer", "expr", "isModifierDescriptor", "isStrictModeEnabled", "map", "useStrict", "whyRun"].forEach(function (prop) {
        Object.defineProperty(module.exports, prop, {
            enumerable: false,
            get: function get() {
                fail$1("'" + prop + "' is no longer part of the public MobX api. Please consult the changelog to find out where this functionality went");
            },
            set: function set() {}
        });
    });
}
// forward compatibility with mobx, so that packages can easily support mobx 4 & 5
var $mobx = "$mobx";

exports.$mobx = $mobx;
exports.Reaction = Reaction;
exports.untracked = untracked;
exports.IDerivationState = IDerivationState;
exports.createAtom = createAtom;
exports.spy = spy;
exports.comparer = comparer;
exports.isObservableObject = isObservableObject;
exports.isBoxedObservable = isObservableValue;
exports.isObservableArray = isObservableArray;
exports.ObservableMap = ObservableMap;
exports.isObservableMap = isObservableMap;
exports.transaction = transaction;
exports.observable = observable;
exports.computed = computed;
exports.isObservable = isObservable;
exports.isObservableProp = isObservableProp;
exports.isComputed = isComputed;
exports.isComputedProp = isComputedProp;
exports.extendObservable = extendObservable;
exports.extendShallowObservable = extendShallowObservable;
exports.observe = observe;
exports.intercept = intercept;
exports.autorun = autorun;
exports.reaction = reaction;
exports.when = when;
exports.action = action;
exports.isAction = isAction;
exports.runInAction = runInAction;
exports.keys = keys;
exports.values = values;
exports.entries = entries;
exports.set = set;
exports.remove = remove;
exports.has = has$1;
exports.get = get;
exports.decorate = decorate;
exports.configure = configure;
exports.onBecomeObserved = onBecomeObserved;
exports.onBecomeUnobserved = onBecomeUnobserved;
exports.flow = flow;
exports.toJS = toJS;
exports.trace = trace;
exports.getDependencyTree = getDependencyTree;
exports.getObserverTree = getObserverTree;
exports._resetGlobalState = resetGlobalState;
exports._getGlobalState = getGlobalState;
exports.getDebugName = getDebugName;
exports.getAtom = getAtom;
exports._getAdministration = getAdministration;
exports._allowStateChanges = allowStateChanges;
exports._allowStateChangesInsideComputed = allowStateChangesInsideComputed;
exports.isArrayLike = isArrayLike;
exports._isComputingDerivation = isComputingDerivation;
exports.onReactionError = onReactionError;
exports._interceptReads = interceptReads;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/process/browser.js"), __webpack_require__("../../../../../../../../usr/local/lib/node_modules/chameleon-tool/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/umtrack-alipay/lib/uma.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function n(n){return my.request?my.request(n):my.httpRequest(n)}function e(e){try{Y.getNetworkInfo(function(t){if("NOTREACHABLE"===t.networkType||"none"===t.networkType||!1===t.networkAvailable){w().e("请求失败:暂无网络 ");e.fail()}else n(e)},e.fail)}catch(n){w().e("请求失败: "+n)}}function t(n){return en.encode(n,!1)}function i(n){return en.decode(n)}function r(n){for(var e="",t=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],i=0;i<Number(n);i++)e+=t[Math.round(Math.random()*(t.length-1))];return e}function o(n){return!Number.isNaN(parseInt(n,10))}function a(n,e){for(var t=String(n).split("."),i=String(e).split("."),r=0;r<Math.max(t.length,i.length);r++){var o=parseInt(t[r]||0,10),a=parseInt(i[r]||0,10);if(o>a)return 1;if(o<a)return-1}return 0}function s(n){return JSON.parse(JSON.stringify(n))}function c(n,e){this.id=n;this.ts=Date.now();var t=typeof e;if("string"===t&&e)this[n]=e;else if("object"===t)for(var i in e)({}).hasOwnProperty.call(e,i)&&(this[i]=e[i])}function u(n){var e=null;switch(n){case yn.HALF_SESSION:e=f();break;case yn.CLOSE_SESSION:e=l();break;case yn.EKV:e=h()}return e}function f(){var n=null,e=En().cloneCurrentSession();e&&(n={header:{st:"1"},analytics:{sessions:[e]}});return n}function l(){var n=null,e={},t=En().cloneCurrentSession();if(t){var i=x().get(),r=an().get();Array.isArray(i)&&i.length&&(t.pages=tn.clone(i));Array.isArray(r)&&r.length&&(t.shares=tn.clone(r));x().clear();an().clear();e.sessions=[t]}var o=fn().getEkvs();if(o){e.ekvs=tn.clone(o);fn().clear()}(e.sessions||e.ekvs)&&(n={analytics:e});return n}function h(){var n=null,e=fn().getEkvs();if(e){n={analytics:{ekvs:tn.clone(e)}};fn().clear()}return n}function p(n){return{h:d(n.header,Sn),a:v(n.analytics,mn)}}function d(n,e){var t=g(n,e);n.id_tracking&&(t[e.id_tracking||"id_tracking"]=g(n.id_tracking,In));return t}function g(n,e){var t={};for(var i in n)e[i]?t[e[i]]=n[i]:t[i]=n[i];return t}function v(n,e){var t={};if(n){var i=n.ekvs,r=n.sessions;i&&(t[e.ekvs]=i);Array.isArray(r)&&(t[e.sessions]=r)}return t}function _(n,t,i,r){_n.instance().setIdType(rn().getIdType());_n.instance().setIdTracking(rn().getIdTracking());var o=tn.clone(_n.instance().get());n.header=Object.assign(o,n.header,{ts:Date.now()});var a=p(n),s=C.stringify(a),c={url:U.LOG_URL,method:"POST",data:tn.base64Encode(s),success:function(n){var e=n.code||n.status||n.statusCode;if(200===e||413===e){w().i("数据发送成功: ",s);y((n.data||{}).imprint);"function"==typeof t&&t(n)}else{w().w("数据发送失败: ",s);"function"==typeof i&&i()}},fail:function(n){w().w("超时: ",s);"function"==typeof i&&i()},complete:function(){"function"==typeof r&&r()}};e(Object.assign(c,E()))}function y(n){if(n){M().set(U.IMPRINT,n);_n.instance().setItem(U.IMPRINT,n);var e=C.parse(tn.base64Decode(n));w().v("imprint: %o",e);var t=e.report_policy;if(t&&tn.isNumber(t)){M().set(U.REPORT_POLICY,t);if(t===U.REPORT_POLICY_INTERVAL){var i=e.report_interval;if(i&&tn.isNumber(i)){i<=U.EVENT_SEND_MIN_INTERVAL?i=U.EVENT_SEND_MIN_INTERVAL:i>U.EVENT_SEND_MAX_INTERVAL&&(i=U.EVENT_SEND_MAX_INTERVAL);M().set(U.REPORT_INTERVAL_TIME,i)}}}}}function E(){;"alipaymp/json";return{headers:{"Content-Type":"alipaymp/json","Msg-Type":"alipaymp/json"}}}function m(n){var e=n,t=[];this.enqueue=function(n){"number"==typeof e&&this.size()>=e&&this.dequeue();t.push(n)};this.dequeue=function(){return t.shift()};this.front=function(){return t[0]};this.isEmpty=function(){return 0===t.length};this.clear=function(){t.length=0};this.size=function(){return t.length};this.items=function(){return t};this.print=function(){console.log(t.toString())}}function S(){function n(){rn().init(function(){_n.instance().init();w().v("Header初始化成功")});e()}function e(){try{my.on("alipayAuthChange",function(n){n&&n.data&&n.data.authcode&&_n.instance().updateExtraInfo()})}catch(n){w().e("绑定auth change异常: ",n)}}function t(n){var e=!1,t=M().get(U.REPORT_POLICY);if(t&&t===U.REPORT_POLICY_INTERVAL){var i=M().get(U.REPORT_INTERVAL_TIME),r=M().get(U.EVENT_LAST_SEND_TIME);e=!r;i=i||U.EVENT_SEND_MIN_INTERVAL;var o=n-r;e=e||o>1e3*i}return e}function i(n){M().set(U.EVENT_LAST_SEND_TIME,n)}function r(n,e){if(!n||"string"!=typeof n){w().e('please check trackEvent id. id should be "string" and not null');return!1}if(n.length>U.MAX_EVENTID_LENGTH){w().e("The maximum length of event id shall not exceed "+U.MAX_EVENTID_LENGTH);return!1}if(e&&("object"!=typeof e||Array.isArray(e))&&"string"!=typeof e){w().e("please check trackEvent properties. properties should be string or object(not include Array)");return!1}if("object"==typeof e){var t=0;for(var i in e)if({}.hasOwnProperty.call(e,i)){if(i.length>U.MAX_PROPERTY_KEY_LENGTH){w().e("The maximum length of property key shall not exceed "+U.MAX_PROPERTY_KEY_LENGTH);return!1}if(t>=U.MAX_PROPERTY_KEYS_COUNT){w().e("The maximum count of properties shall not exceed "+U.MAX_PROPERTY_KEYS_COUNT);return!1}t+=1}}return!0}var o=!1,a=!1;this.init=function(e){w().v("sdk version: "+U.IMPL_VERSION);o?w().v("Lib重复实例化"):M().load(function(){w().v("cache初始化成功: ",M().getAll());n();o=!0;"function"==typeof e&&e();w().tip("SDK集成成功")})};this.resume=function(n){if(o&&!a){w().v("showOptions: ",n);a=!0;An().load();var e=En().resume(n),t=En().getCurrentSessionId();fn().setSessionId(t);e&&An().add(yn.HALF_SESSION,function(){An().send()})}};this.pause=function(){if(o){a=!1;En().pause();An().send(yn.CLOSE_SESSION,function(){An().save();M().save();w().v("cache save success")})}};this.setOpenid=function(n){if(!rn().getId()){w().v("setOpenId: %s",n);rn().setOpenid(n);An().send()}};this.setUnionid=function(n){w().v("setUnionid: %s",n);rn().setUnionid(n)};this.setUserid=function(n){w().v("setUserid: %s",n);rn().setUserid(n)};this.trackEvent=function(n,e){if(o){w().v("event: ",n,e);if(r(n,e)){fn().addEvent(n,e);var a=Date.now();if(t(a)){i(a);An().send(yn.EKV,function(){})}}}};this.trackShare=function(n){if(o){try{n=an().add(n);w().v("sharePath: ",n.path)}catch(n){w().v("shareAppMessage: ",n)}return n}};this.trackPageStart=function(n){o&&x().addPageStart(n)};this.trackPageEnd=function(n){o&&x().addPageEnd(n)}}function I(){}function A(n,e,t){var i=n[e];n[e]=function(n){t.call(this,n);i&&i.call(this,n)}}function N(n){try{kn.init(n)}catch(n){w().v("onAppLaunch: ",n)}}function T(n){try{Tn=n?tn.clone(n):{};w().v("App onShow: ",n,Tn)}catch(n){w().v("onAppShow: ",n)}}function R(){try{kn.pause()}catch(n){w().v("onAppHide: ",n)}}function O(n){try{if(n){Tn.query=Tn.query||{};Object.assign(Tn.query,n)}w().v("Page onLoad: ",n,Tn)}catch(n){w().v("onPageLoad: ",n)}}function L(){try{kn.resume(Tn);kn.trackPageStart(this.route)}catch(n){w().v("onPageShow: ",n)}}function k(){try{kn.trackPageEnd(this.route)}catch(n){w().v("onPageHide: ",n)}}var P="[UMENG] -- ",w=function(){function n(){this.setDebug=function(n){t=n};this.d=function(){if(t)try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.debug.apply(console,arguments)}catch(n){}};this.i=function(){try{if(t)try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.info.apply(console,arguments)}catch(n){}}catch(n){}};this.e=function(){if(t)try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.error.apply(console,arguments)}catch(n){}};this.w=function(){if(t)try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.warn.apply(console,arguments)}catch(n){}};this.v=function(){if(t)try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.log.apply(console,arguments)}catch(n){}};this.t=function(){if(t)try{console.table.apply(console,arguments)}catch(n){}};this.tip=function(){try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.log.apply(console,arguments)}catch(n){}};this.tip_w=function(){try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.warn.apply(console,arguments)}catch(n){}};this.err=function(){try{"string"==typeof arguments[0]&&(arguments[0]=P+arguments[0]);console.error.apply(console,arguments)}catch(n){}}}var e=null,t=!1;return function(){null===e&&(e=new n);return e}}(),D={set:function(n,e,t){var i,r={key:n,success:function(n){"function"==typeof t&&t(n)},fail:function(){"function"==typeof t&&t()}};r.data=e;i=my.setStorage;try{i&&i(r)}catch(n){w.e("存储错误",n)}},get:function(n,e){var t;t=my.getStorage;try{t&&t({key:n,success:function(n){"function"==typeof e&&e(n.data)},fail:function(t){w().w(n+": "+t.errMsg);"function"==typeof e&&e()}})}catch(n){w.e("获取storage错误",n)}},remove:function(n,e){var t;t=my.removeStorage;try{t&&t({key:n,success:function(){"function"==typeof e&&e(!0)},fail:function(){"function"==typeof e&&e(!1)}})}catch(n){w.e("删除storage错误",n)}}},C={stringify:function(n){if(n)try{return JSON.stringify(n)}catch(n){}return""},parse:function(n){if(n)try{return JSON.parse(n)}catch(n){}return null},parseToArray:function(n){if(n)try{return JSON.parse(n)}catch(n){}return[]}},b=function(){function n(){var n={};this.appKey=function(){return n.appKey};this.set=function(e){n=e};this.get=function(){return n};this.setItem=function(e,t){n[e]=t};this.getItem=function(e){return n[e]}}var e=null;return function(){e||(e=new n);return e}}(),M=function(){function n(){this.load=function(n){if(i){D.remove(t);n()}else{t="um_cache_"+b().appKey();D.get(t,function(e){i=C.parse(e)||{};r=!0;D.remove(t);n()})}};this.save=function(){i&&D.set(t,C.stringify(i))};this.set=function(n,e){i&&(i[n]=e)};this.get=function(n){return(i||{})[n]};this.remove=function(n){i&&i[n]&&delete i[n]};this.getAll=function(){return i};this.clear=function(){i=null};this.has=function(n){return!!this.get(n)};this.isLoaded=function(){return r}}var e=null,t="",i=null,r=!1;return function(t){e||(e=new n(t));return e}}(),V="",U={SESSION_INTERVAL:3e4,LOG_URL:V="https://ulogs.umeng.com/alipaym_logs",GET_OPENID_URL:"https://ulogs.umeng.com/uminiprogram_logs/wx/getuut",DEVICE_INFO_KEY:"device_info",ADVERTISING_ID:"mobile_ad_id",ANDROID_ID:"android_id",CURRENT_SESSION:"current_session",SESSION_PAUSE_TIME:"session_pause_time",EVENT_SEND_MIN_INTERVAL:5,EVENT_SEND_MAX_INTERVAL:86400,EVENT_LAST_SEND_TIME:"last_send_time",MAX_EVENTID_LENGTH:128,MAX_PROPERTY_KEY_LENGTH:256,MAX_PROPERTY_KEYS_COUNT:100,REPORT_POLICY:"report_policy",REPORT_INTERVAL_TIME:"report_interval_time",REPORT_POLICY_START_SEND:"1",REPORT_POLICY_INTERVAL:"6",IMPRINT:"imprint",SEED_VERSION:"1.0.0",IMPL_VERSION:"2.2.0",ALIPAY_AVAILABLE_VERSION:"10.1.52",SHARE_PATH:"um_share_path",SHARES:"shares",REQUESTS:"requests",UUID:"um_uuid",UUID_SUFFIX:"ud",OPENID:"um_od",UNIONID:"um_unid",ALIPAYID:"um_alipayid",USERID:"um_userid",LAUNCH_OPTIONS:"LAUNCH_OPTIONS",UM_SSRC:"_um_ssrc",IS_ALIYUN:!1,ALIYUN_URL:"serverless.huoban.youmeng.network.forward"},Y={getUserInfo:function(n){my.getSetting({success:function(e){e.authSetting.userInfo?my.getOpenUserInfo({success:e=>{let t=JSON.parse(e.response).response;n({userInfo:t})},fail:function(){n({})}}):n({})},fail:function(){n({})}})},getSystemInfo:function(n,e){my.getSystemInfo({success:function(e){"function"==typeof n&&n(e)},fail:function(){"function"==typeof e&&e()}})},getDeviceInfo:function(n){try{my.call("getDeviceInfo",{},function(e){var t=(e||{}).data;if(t){M().set(U.DEVICE_INFO_KEY,t);"function"==typeof n&&n(t)}else{var i=M().get(U.DEVICE_INFO_KEY);"function"==typeof n&&n(i)}})}catch(n){w().w("支付宝获取设备info 失败",n)}},checkNetworkAvailable:function(n){var e={success:function(e){var t=!1;t=e.networkAvailable;"function"==typeof n&&n(t)},fail:function(){"function"==typeof n&&n()}};my.getNetworkType(e)},getNetworkInfo:function(n,e){var t={success:function(e){"function"==typeof n&&n(e)},fail:function(){"function"==typeof e&&e()}};my.getNetworkType(t)},getDeviceId:function(n,e){try{"function"==typeof n&&n("")}catch(n){w().e("getDeviceId error",n)}},getAdvertisingId:function(n,e){"function"==typeof n&&n("")},getPageName:function(){},onNetworkStatusChange:function(n){my.onNetworkStatusChange(function(e){"function"==typeof n&&n(e.isConnected||!0)})}},x=function(){function n(){var n=!1,e=null,t=[];this.addPageStart=function(t){if(t&&!n){e={ts:Date.now(),path:t};n=!0}};this.addPageEnd=function(i){if(n&&i&&e&&i===e.path){var r=Date.now()-e.ts;e.duration=Math.abs(r);t.push(e);e=null;n=!1}};this.get=function(){return t};this.clear=function(){t.length=0}}var e=null;return function(){e||(e=new n);return e}}(),H="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",K=function(n){for(var e={},t=0,i=n.length;t<i;t++)e[n.charAt(t)]=t;return e}(H),F=String.fromCharCode,j=function(n){if(n.length<2)return(e=n.charCodeAt(0))<128?n:e<2048?F(192|e>>>6)+F(128|63&e):F(224|e>>>12&15)+F(128|e>>>6&63)+F(128|63&e);var e=65536+1024*(n.charCodeAt(0)-55296)+(n.charCodeAt(1)-56320);return F(240|e>>>18&7)+F(128|e>>>12&63)+F(128|e>>>6&63)+F(128|63&e)},q=function(n){return n.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,j)},G=function(n){var e=[0,2,1][n.length%3],t=n.charCodeAt(0)<<16|(n.length>1?n.charCodeAt(1):0)<<8|(n.length>2?n.charCodeAt(2):0);return[H.charAt(t>>>18),H.charAt(t>>>12&63),e>=2?"=":H.charAt(t>>>6&63),e>=1?"=":H.charAt(63&t)].join("")},X=function(n){return n.replace(/[\s\S]{1,3}/g,G)},z=function(n){return X(q(n))},J=function(n,e){return e?z(String(n)).replace(/[+\/]/g,function(n){return"+"==n?"-":"_"}).replace(/=/g,""):z(String(n))},B=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g"),Q=function(n){switch(n.length){case 4:var e=((7&n.charCodeAt(0))<<18|(63&n.charCodeAt(1))<<12|(63&n.charCodeAt(2))<<6|63&n.charCodeAt(3))-65536;return F(55296+(e>>>10))+F(56320+(1023&e));case 3:return F((15&n.charCodeAt(0))<<12|(63&n.charCodeAt(1))<<6|63&n.charCodeAt(2));default:return F((31&n.charCodeAt(0))<<6|63&n.charCodeAt(1))}},W=function(n){return n.replace(B,Q)},Z=function(n){var e=n.length,t=e%4,i=(e>0?K[n.charAt(0)]<<18:0)|(e>1?K[n.charAt(1)]<<12:0)|(e>2?K[n.charAt(2)]<<6:0)|(e>3?K[n.charAt(3)]:0),r=[F(i>>>16),F(i>>>8&255),F(255&i)];r.length-=[0,0,2,1][t];return r.join("")},$=function(n){return n.replace(/[\s\S]{1,4}/g,Z)},nn=function(n){return W($(n))},en={encode:J,decode:function(n){return nn(String(n).replace(/[-_]/g,function(n){return"-"==n?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))}},tn={base64Encode:t,base64Decode:i,isNumber:o,compareVersion:a,getRandomStr:r,clone:s},rn=function(){function n(){function n(n){try{my.call("getOpenUserData",{},function(e){var t=(e||{}).uid;t||w().err('请确保已经勾选支付宝功能包中的"友盟+数据服务"功能包！');"function"==typeof n&&n(t)})}catch(e){n("")}}var e="",t="",i="",r="",o="";this.init=function(e){o="alipay_id";D.get(U.ALIPAYID,function(t){if(t){r=t;e&&e()}else n(function(n){w().v("获取到alipayid: %s",n);r=n;D.set(U.ALIPAYID,r);e&&e()})})};this.getIdType=function(){return o};this.getIdTracking=function(){var n={};e&&(n.openid=e);t&&(n.unionid=t);r&&(n.alipay_id=r);i&&(n.userid=i);return n};this.setOpenid=function(n){if(!e&&n){e=n;D.set(U.OPENID,n)}};this.setUnionid=function(n){if(!t&&n){t=n;D.set(U.UNIONID,n)}};this.setUserid=function(n){if(!i&&n){i=n;D.set(U.USERID,n)}};this.getId=function(){return r}}var e=null;return function(){e||(e=new n);return e}}(),on=3,an=function(){function n(){return{add:function(n){w().v("share origin: %o",n);var e={title:n.title,path:n.path.split("?")[0],_um_sts:Date.now()},r=n.path,o=rn().getId();if(o){var a=i.split(","),s=(a=a.filter(function(n){return n.length>0})).indexOf(o);s>=0&&(a=a.slice(0,s));a.length<on&&a.push(o);var c=a.join(",");-1!==r.indexOf("?")?r+="&_um_ssrc="+c:r+="?_um_ssrc="+c;var u=Date.now();r+="&_um_sts="+u;n.path=r;e._um_ssrc=c;e._um_sts=u}t.push(e);w().v("share: %o",n);return n},setShareSource:function(n){i=n},clear:function(){t.length=0},get:function(){return t}}}var e=null,t=[],i="";return function(){e||(e=new n);return e}}(),sn="ekvs",cn=1e4,un=1,fn=function(){function n(){if(a.length){var n=M().get(sn);if(t(n)+a.length<=cn){n=e(n,a);M().set(sn,n)}}}function e(n,e){var t=(n=n||{})[o];Array.isArray(t)&&t.length?n[o]=t.concat(e):n[o]=[].concat(e);return n}function t(n){var e=0;for(var t in n)Array.isArray(n[t])&&(e+=n[t].length);return e}function i(){return{addEvent:function(e,t){var i=new c(e,t);if(o){a.unshift(i);if(a.length>un){n(o);a.length=0}}else{w().w("session id is null: ",o);s.unshift(i)}},setSessionId:function(n){o=n;w().v("setSessionId: ",o);if(Array.isArray(s)&&s.length&&o){for(var e=0;e<s.length;e++)this.addEvent(s[e]);s.length=0}},getEkvs:function(){var n=M().get(sn);a&&a.length&&(n=e(n,a));return n},clear:function(){M().remove(sn);a.length=0}}}var r,o,a=[],s=[];return function(){r||(r=i());return r}}(),ln="2g",hn="3g",pn="4g",dn="none",gn=" ",vn=["access","access_subtype"],_n=function(){function n(){function n(n){Y.getSystemInfo(function(i){Y.getNetworkInfo(function(o){var a=o.type||o.networkType;a===dn&&(a="unknown");var s=M().get(U.IMPRINT);s&&(r.imprint=s);e(i,a);t(i);n&&n()})})}function e(n,e,t){r.userInfo=t;r.device_type="Phone";r.sdk_version=U.IMPL_VERSION;r.appkey=b().appKey();if(n){var i,o,a,s=n.model||"",c=(n.product,n.platform||""),u=n.brand||"",f=u.toLowerCase();r.platform_version=n.version;if("android"===c){i=Math.round(n.screenWidth);o=Math.round(n.screenHeight)}else{i=Math.round(n.screenWidth*n.pixelRatio);o=Math.round(n.screenHeight*n.pixelRatio)}a=i>o?i+"*"+o:o+"*"+i;r.os=c;r.font_size_setting=n.fontSizeSetting;r.device_model=s.toLowerCase().indexOf(f)>-1?s:f+gn+s;r.device_brand=u;r.device_manufacturer=f;r.device_manuid=s.toLowerCase().indexOf(f)>-1?s:f+gn+s;r.device_name=s.toLowerCase().indexOf(f)>-1?s:f+gn+s;r.os_version=n.system;r.resolution=a;r.language=n.language}switch(e){case pn:r.access_subtype="LTE";r.access="4G";break;case hn:r.access_subtype="CDMA";r.access="3G";break;case ln:r.access_subtype="GRPS";r.access="2G";break;default:r.access=e;delete r.access_subtype}}function t(n){var e=[];if(n){e.push({name:"系统名",value:n.platform});e.push({name:"支付宝版本号",value:n.version})}e.push({name:"设备型号",value:r.device_model});e.push({name:"设备生产商",value:r.device_brand});e.push({name:"os版本号",value:r.os_version});e.push({name:"网络类型",value:r.access});e.push({name:"运营商",value:r.access_subtype});e.push({name:"分辨率",value:r.resolution});e.push({name:"screenWidth",value:n.screenWidth});e.push({name:"screenHeight",value:n.screenHeight});e.push({name:"pixelRatio",value:n.pixelRatio});for(var t="",i=0;i<e.length;i++){var o=e[i];t+=o.name+": "+o.value+"; "}w().v("调试辅助信息: ",t)}var i=!1,r={};r.sdk_type="alipaymp";r.platform="alipay";r.platform_sdk_version=my.SDKVersion;return{init:function(){this.updateExtraInfo();n(function(){i=!0})},isLoaded:function(){return i},get:function(){return r},getSDKType:function(){return r.sdk_type},getPlatform:function(){return r.platform},getRealtimeFields:function(){var n={};vn.forEach(function(e){n[e]=r[e]});return n},setIdTracking:function(n){this.setItem("id_tracking",n)},setIdType:function(n){this.setItem("id_type",n)},setItem:function(n,e){r[n]=e},getItem:function(n){return r[n]},updateExtraInfo:function(){Y.getDeviceInfo(function(n){r.device_info=n||""})}}}var e=null;return{instance:function(){e||(e=n());return e}}}(),yn={HALF_SESSION:"half_session",CLOSE_SESSION:"close_session",EKV:"ekv"},En=function(){function n(){return{resume:function(n){var e=!1;a||(a=M().get(U.CURRENT_SESSION));var i=new Date;o=i.getTime();if(!a||!a.end_time||o-a.end_time>U.SESSION_INTERVAL){e=!0;t(n);w().v("开始新的session(%s): ",a.id,a)}else w().v("延续上一次session(%s): %s ",a.id,i.toLocaleTimeString(),a);return e},pause:function(){i()},getCurrentSessionId:function(){return(a||{}).id},getCurrentSession:function(){return a},cloneCurrentSession:function(){return tn.clone(a)}}}function e(n){var e={};for(var t in n)0===t.indexOf("_um_")&&(e[t]=n[t]);return e}function t(n){try{var t=(a||{}).options||{},i=Object.assign({},e(n.query));i.path=n.path||t.path;i.scene=n.scene?_n.instance().getPlatform()+"_"+n.scene:t.scene;w().v("session options: ",i);var r=i[U.UM_SSRC];r&&an().setShareSource(r);var o=Date.now();a={id:tn.getRandomStr(10)+o,start_time:o,options:i}}catch(n){w().e("生成新session失败: ",n)}}function i(){if(a){var n=new Date;a.end_time=n.getTime();"number"!=typeof a.duration&&(a.duration=0);a.duration=a.end_time-o;M().set(U.CURRENT_SESSION,a);w().v("退出会话(%s): %s ",a.id,n.toLocaleTimeString(),a)}}var r=null,o=null,a=null;return function(){r||(r=n());return r}}(),mn={sessions:"sn",ekvs:"e"},Sn={sdk_type:"sdt",access:"ac",access_subtype:"acs",device_model:"dm",language:"lang",device_type:"dt",device_manufacturer:"dmf",device_name:"dn",platform_version:"pv",id_type:"it",font_size_setting:"fss",os_version:"ov",device_manuid:"did",platform_sdk_version:"psv",device_brand:"db",appkey:"ak",_id:"id",id_tracking:"itr",imprint:"imp",sdk_version:"sv",resolution:"rl"},In={uuid:"ud",unionid:"und",openid:"od",alipay_id:"ad",device_id:"dd",userid:"cuid"},An=function(){function n(e,t){if(_n.instance().isLoaded()){var i=u(e),r=_n.instance().getRealtimeFields();i.header=Object.assign({},i.header,r);c.enqueue(i);"function"==typeof t&&t()}else setTimeout(function(){n(e,t)},100)}function e(n){var i=c.front(),r=function(){c.dequeue();e(n)},o=function(){var t=c.dequeue();t&&s.push(t);e(n)};if(i)_(i,r,o);else{t();n()}}function t(){s.forEach(function(n){c.enqueue(n)});s.length=0}function i(n){if(rn().getId())a?w().i("队列正在发送中"):Y.checkNetworkAvailable(function(t){if(!1!==t){a=!0;e(function(){a=!1;"function"==typeof n&&n()})}else"function"==typeof n&&n()});else{w().i("获取id标识失败，暂缓发送");"function"==typeof n&&n()}}function r(){this.send=function(n,e){n?this.add(n,function(){i(e)}):i(e)};this.add=function(e,t){n(e,t)};this.load=function(){var n=M().get(U.REQUESTS);n&&n.length&&n.forEach(function(n){c.enqueue(n)});M().remove(U.REQUESTS)};this.save=function(){M().set(U.REQUESTS,tn.clone(c.items()));c.clear()}}var o=null,a=!1,s=[],c=new m(50);return function(){o||(o=new r);return o}}(),Nn=[];I.prototype={createMethod:function(n,e,t){try{n[e]=t?function(){return t[e].apply(t,arguments)}:function(){Nn.push([e,[].slice.call(arguments)])}}catch(n){w().v("create method errror: ",n)}},installApi:function(n,e){try{var t,i,r=["resume","pause","trackEvent","trackPageStart","trackPageEnd","trackShare","setOpenid","setUnionid","setUserid"];for(t=0,i=r.length;t<i;t++)this.createMethod(n,r[t],e);if(e)for(t=0,i=Nn.length;t<i;t++){var o=Nn[t];try{e[o[0]].apply(e,o[1])}catch(n){w().v("impl[v[0]].apply error: ",o[0],n)}}}catch(n){w().v("install api errror: ",n)}}};var Tn={};try{var Rn=App;App=function(n){A(n,"onLaunch",function(){N(n.umengConfig)});A(n,"onShow",T);A(n,"onHide",R);if(n.onShareAppMessage){var e=n.onShareAppMessage;n.onShareAppMessage=function(n){var t=e.call(this,n);return kn.trackShare.call(this,t)}}Rn(n)}}catch(n){w().w("App重写异常")}try{var On=Page;Page=function(n){A(n,"onShow",L);A(n,"onHide",k);A(n,"onUnload",k);A(n,"onLoad",O);if(n.onShareAppMessage){var e=n.onShareAppMessage;n.onShareAppMessage=function(n){var t=e.call(this,n);return kn.trackShare.call(this,t)}}On(n)}}catch(n){w().w("Page重写异常")}var Ln=new I,kn={_inited:!1,init:function(n){function e(n){try{var e=new S;w().v("成功创建Lib对象");e.init(function(){w().v("Lib对象初始化成功");Ln.installApi(n,e);w().v("安装Lib接口成功")})}catch(n){w().w("创建Lib对象异常: "+n)}}if(this._inited)w().v("已经实例过，请避免重复初始化");else if(n)if(n.appKey){b().set(n);w().setDebug(n.debug);this._inited=!0;var t=this;Y.getSystemInfo(function(n){n&&n.version&&tn.compareVersion(n.version,U.ALIPAY_AVAILABLE_VERSION)>=0?e(t):w().err("只支持版本号大于等于10.1.52的支付宝客户端！")})}else w().err("请确保传入正确的appkey");else w().err("请通过在App内添加umengConfig设置相关信息！")}};try{Ln.installApi(kn,null);w().v("安装临时接口成功");my.uma=kn}catch(n){w().w("uma赋值异常: ",n)}module.exports=kn;


/***/ }),

/***/ "./src/uma-stat.js":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _umtrackAlipay = __webpack_require__("./node_modules/umtrack-alipay/lib/uma.min.js");

var _umtrackAlipay2 = _interopRequireDefault(_umtrackAlipay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 开发支付宝小程序时导入此模块

exports.default = _umtrackAlipay2.default; // import uma from 'umtrack-wx'; // 开发微信小程序时导入此模块

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/chameleon-runtime/index.js");
module.exports = __webpack_require__("./node_modules/chameleon-store/index.js");


/***/ })

},[0])
;