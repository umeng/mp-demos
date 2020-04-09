# taro

<a name="c2630d72"></a>
# 1.注册友盟+账号

[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)

<a name="2b0b2169"></a>
# 2.友盟官网申请小程序appkey

[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)

<a name="c3d5368f"></a>
# 3.域名白名单配置

[官网微信小程序文档](https://developer.umeng.com/docs/147615/detail/147619)<br />
[官网原生支付宝小程序接入](https://developer.umeng.com/docs/147615/detail/147727)

<a name="a463ece3"></a>
# 4.创建taro框架下的app [demo](https://github.com/umeng/mp-demos/tree/master/taro)

```bash
taro init myApp
```

<a name="d6737ebf"></a>
# 5.安装sdk

```bash
cd path-to-taroproject
npm install umtrack-alipay --save
npm install umtrack-wx --save
```

<a name="ca761aa4"></a>
# 6.跨平台集成示例

<a name="8a6cad35"></a>
## 1.单文件内集成

[参考taro的跨平台方案](https://nervjs.github.io/taro/docs/envs.html)<br />
**_ src/app.jsx _**

```javascript
let uma = {};
if (process.env.TARO_ENV === 'weapp') {
  uma = require('umtrack-wx');
  uma.init({
    appKey: 'YOUR_APP_KEY',
    useOpenid: false,
    autoGetOpenid: false,
    debug: true
  });
} else if (process.env.TARO_ENV === 'alipay') {
  uma = require('umtrack-alipay');
  uma.init({
    appKey: 'YOUR_APP_KEY',
    debug: true
  });
}
//把uma 添加到Taro，后续通过Taro.uma调用uma方法 ,es6模块导入的是模块引用，
//因此放心注入，后面页面导入Taro模块是可以获取uma的
import Taro, { Component } from '@tarojs/taro'
Taro.uma = uma ;
```

<a name="ca4c0083"></a>
## 2.跨平台文件集成

[参考taro的跨平台方案](https://nervjs.github.io/taro/docs/envs.html)<br />
**_ src/uma/index.weapp.js_**

```javascript
import uma from 'umtrack-wx';

uma.init({
    appKey: 'YOUR_APP_KEY',
    useOpenid: false,
    autoGetOpenid: false,
    debug: true
});
export default uma;
```

**_ src/uma/index.alipay.js _**

```javascript
import uma from 'umtrack-alipay';

uma.init({
    appKey: 'YOUR_APP_KEY',
    debug: true
});
export default uma;
```

两种方法调用uma模块:<br />
1.在其他页面中直接 import uma from 'path/to/uma'<br />
2.或者同单文件集成，在app.jsx中注入uma到Taro<br />
**_app.jsx_**

```javascript
import uma from './uma'
import Taro, { Component } from '@tarojs/taro'
Taro.uma = uma ;
```

<a name="ece14611"></a>
# 7.自定义事件

```javascript
componentDidShow () {
    Taro.uma.trackEvent('bu7y', {
      name: 'car'
    });
},
```

<a name="77f20552"></a>
# 8.注意事项

无论哪种集成方式，在app.jsx文件中 uma模块的导入一定要在Taro的导入之前，如eslint出现提示，建议关掉app.jsx文件的相关eslint检查，一般是关于import前置 或 绝对路径模块要先于相对模块的eslint提示。
