import uma from './uma';
// uma包引入必须在此引入，init 可以延迟到 后面通过wx.uma去调用
uma.init({
    appKey: 'xxx',
    debug: true,
    useOpenid: false,
  });
const nativeAppConfig = {};
module.exports = nativeAppConfig;