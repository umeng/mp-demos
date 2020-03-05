"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('./vendor.js')(3));

var _umtrackWx = _interopRequireDefault(require('./vendor.js')(0));

var _core = _interopRequireDefault(require('./vendor.js')(1));

var _eventHub = _interopRequireDefault(require('./common/eventHub.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_umtrackWx["default"].init({
  appKey: 'YOUR_APP_KEY',
  useOpenid: true,
  autoGetOpenid: true,
  debug: true
});

_core["default"].app({
  hooks: {
    // App 级别 hook，对整个 App 生效
    // 同时存在 Page hook 和 App hook 时，优先执行 Page hook，返回值再交由 App hook 处
    'before-setData': function beforeSetData(dirty) {
      console.log('setData dirty: ', dirty);
      return dirty;
    }
  },
  globalData: {
    userInfo: null,
    uma: _umtrackWx["default"]
  },
  onLaunch: function onLaunch() {
    this.testAsync();

    _eventHub["default"].$on('app-launch', function () {
      console.log('app-launch event emitted, the params are:');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      console.log(args);
    });
  },
  methods: {
    sleep: function sleep(s) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve('promise resolved');
        }, s * 1000);
      });
    },
    testAsync: function testAsync() {
      var _this = this;

      return _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime2["default"].mark(function _callee() {
        var d;
        return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.sleep(3);

              case 2:
                d = _context.sent;
                console.log(d);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  }
}, {info: {"noPromiseAPI":["createSelectorQuery"]}, handlers: {}, models: {}, refs: undefined });