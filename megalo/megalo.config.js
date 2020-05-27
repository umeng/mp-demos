module.exports = {
  // 构件生产模式时是否生成source map（仅在process.env.NODE_ENV === 'production' 时该选项生效）
  productionSourceMap: false,

  // 开启eslint格式化代码
  lintOnSave: true,

  configureWebpack: config => {
    // 你可以在这里粗放的修改webpack的配置并返回
    console.log('configureWebpack执行了')
    return config
  },
  chainWebpack: chainConfig => {
    // 你可以在这里通过 https://github.com/neutrinojs/webpack-chain 来精细的修改webpack配置
    // console.log('chainWebpack执行了', chainConfig.toString())
  },
  // 原生小程序组件存放目录，默认为src/native
  // 如果你有多个平台的原生组件，你应当在此目录下再新建几个子文件夹，我们约定，子文件夹名和平台的名字一致:
  // 微信小程序组件则命名为 'wechat'，支付宝为'alipay', 百度为 'swan'
  // 如果只有一个平台，则无需再新建子文件夹
  nativeDir: '/src/native',

  css: {
    loaderOptions: {
      css: {
        // https://github.com/webpack-contrib/css-loader#options
      },
      less: {
        // https://github.com/webpack-contrib/less-loader
      },
      sass: {
        // https://github.com/webpack-contrib/sass-loader
      },
      stylus: {
        // https://github.com/shama/stylus-loader
      },
        // https://github.com/megalojs/megalo-px2rpx-loader
      px2rpx: {
        rpxUnit: 0.5
      }
    }
  }
}
