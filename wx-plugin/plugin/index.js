const uma = require('./umawrap');
uma.trackEvent('plugin_load'); // 此处用来统计插件载入次数，插件被多次引用，只会触发一次 
module.exports = {
  sayHello() {
    console.log('Hello plugin!')
  },
  init(ctx) {
    uma.wxpluginwraper(ctx)
  },
  answer: 42
}
