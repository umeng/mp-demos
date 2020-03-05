"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(1));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  data: {
    list: [{
      id: '0',
      title: 'loading'
    }]
  },
  events: {
    'index-broadcast': function indexBroadcast() {
      var _ref;

      var $event = (_ref = arguments.length - 1, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]);
      console.log("".concat(_this.$name, " receive ").concat($event.name, " from ").concat($event.source.name));
    }
  },
  methods: {
    tap: function tap() {
      // this.num = this.num + 1
      console.log(this.$name + ' tap');
    },
    add: function add() {
      var len = this.list.length;
      this.list.push({
        id: len + 1,
        title: 'title_' + len
      });
    },
    remove: function remove(index) {
      this.$delete(this.list, index);
    }
  },
  onLoad: function onLoad() {}
}, {info: {"components":{},"on":{}}, handlers: {'9-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.add($event);
      })();
    
  }},'9-1': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.tap($event);
      })();
    
  }},'9-2': {"tap": function proxy (index) {
    
    var _vm=this;
      return (function () {
        _vm.remove(index);
      })();
    
  }}}, models: {}, refs: undefined });