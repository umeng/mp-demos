# mpx

> A mpx project

## Dev

```bash
# install dep
npm i

# for dev
npm run watch

# for online
npm run build
```

npm script规范 [build|watch]:[dev|prod]:[cross|web|none]

build默认prod，watch默认dev。另单独提供了build:dev和watch:prod，用于单次构建分析看未压缩代码分析问题和持续压缩代码便于大体积项目真机调试。

建议自行调整cross的目标。npm-run-all是为了兼容windows下无法同时执行两个npm script，若不需要转web平台，可考虑去掉。

# 关键集成步骤

```js
  import uma from 'umtrack-wx'
  uma.init({
    appKey: '5dfa09d2c1d04b48c99109a6',
    useOpenid: false,
    autoGetOpenid: false,
    uploadUserInfo: false,
    debug: true
  });
  import mpx, { createApp } from '@mpxjs/core'
  import apiProxy from '@mpxjs/api-proxy'
  mpx.use(apiProxy, { usePromise: true })
  createApp({
    onLaunch () {}
  },{customCtor: App});// 特别注意此处，跟微信官方的kbone类似，都是框架代码编译后优先级高于业务代码，导致无法在最开始引入sdk,无法先于框架劫持生命周期方法。需要编写特殊的webpack插件,提高友盟sdk的执行优先级。虽然mpx提供了，允许其他框架修改劫持的参数  customCtor https://mpxjs.cn/api/global-api.html#createpage  ，看文档需要每个Page，Component，App实例都要注入一次，但实际用来只需要App注入该参数就能正常运行，需要进一步测试，尤其是component，避免未知问题。
```