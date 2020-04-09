/* eslint-disable import/first */
import uma from './uma';
/**
 * 可选的单文件集成，但作者强烈建议使用多文件的集成方式。
 */
// let uma = {};
// if (process.env.TARO_ENV === 'weapp') {
//   uma = require('umtrack-wx');
//   uma.init({
//     appKey: 'YOUR_APP_KEY',
//     useOpenid: false,
//     autoGetOpenid: false,
//     debug: true
//   });
// } else if (process.env.TARO_ENV === 'alipay') {
//   uma = require('umtrack-alipay');
//   uma.init({
//     appKey: 'YOUR_APP_KEY',
//     debug: true
//   });
// }
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

Taro.uma = uma ;

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
