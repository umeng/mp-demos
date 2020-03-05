"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(1));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  props: {
    num: {
      type: [Number, String],
      coerce: function coerce(v) {
        return +v;
      },
      "default": 50
    }
  },
  events: {
    'index-broadcast': function indexBroadcast() {
      var _ref;

      var $event = (_ref = arguments.length - 1, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]);
      console.log("".concat(_this.$name, " receive ").concat($event.name, " from ").concat($event.source.$name));
    }
  },
  watch: {
    num: function num(curVal, oldVal) {
      console.log("\u65E7\u503C\uFF1A".concat(oldVal, "\uFF0C\u65B0\u503C\uFF1A").concat(curVal));
    }
  },
  methods: {
    plus: function plus() {
      this.num = this.num + 1;
      console.log('plus tapped in component');
      this.$emit('index-emit', this.num);
    },
    minus: function minus() {
      this.num = this.num - 1;
      console.log(this.$name + ' minus tap');
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'12-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.plus($event);
      })();
    
  }},'12-1': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.minus($event);
      })();
    
  }}}, models: {}, refs: undefined });