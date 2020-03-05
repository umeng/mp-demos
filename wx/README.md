## 微信小程序打包
1. 在QUICK-APP-SDK根目录下打包！！！注意目录不要进错了
2. 运行npm run build:wx,打包完会存在lib目录下
3. 打包后引用方式为在app.js中添加此行 const uma = require('./lib/uma.min.js');
4. 若想引用源码，添加方式为 const uma = require('./src/umengAnalysis.alipay.js').default;
5. 只能用一种引用方式