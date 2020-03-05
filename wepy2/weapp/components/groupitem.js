"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  props: {
    gitem: {}
  },
  data: {},
  methods: {
    tap: function tap() {
      this.gitem.childname = "Child Random(".concat(Math.random(), ")");
      var index = this.$parent.$children.indexOf(this);
      console.log("Item ".concat(index, ", ID is ").concat(this.gitem.childid));
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'13-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.tap($event);
      })();
    
  }}}, models: {}, refs: undefined });