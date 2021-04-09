# rax 框架支持

[原理参考](https://rax.alibaba-inc.com/docs/guide/mix-native-code#5.%20%E5%9C%A8%20Rax%20%E4%B8%AD%E5%AE%9A%E5%88%B6%20app.js%20%E9%80%BB%E8%BE%91)

以微信小程序为例，在rax运行时方案中，由于执行时机存在差异，用户在 runApp 中编写的 onLaunch 等生命周期有可能会在首页的 onLoad 中才会执行。因此，如果用户对于原生的 App 的生命周期有定制需要（比如劫持生命周期等），可以采取如下方式：

在 src/miniapp-native 中新建 app.js，在其中可以随意编写业务逻辑，但要求该文件必须使用 module.exports 导出一个 App 的配置对象，代码示例如下：

```js
// ./uma.js是 umtrack-wx/lib/index.js sdk包复制过来的
import uma from './uma.js';
// uma包引入必须在此引入，uma.init 可以延迟到 后面通过wx.uma.init去调用
uma.init({
    appKey: 'xxx',
    debug: true,
    useOpenid: false,
});
const nativeAppConfig = {};
module.exports = nativeAppConfig;

```
后面就可以用wx.uma.trackEvent('XXXX')