# rax 框架支持

以微信小程序为例，关键代码如下
 在`app.js`中
 
```js
import { runApp } from 'rax-app';
import uma from 'umtrack-wx';

runApp({
  app: {
    onLaunch() {
      uma.init({
        appKey: 'xxx',
        debug: true,
        useOpenid: false,
      });
    },
    onShow(opt) {
      uma.resume(opt, true);
    },
    onHide() {
      uma.pause();
    },
  },
});

```
