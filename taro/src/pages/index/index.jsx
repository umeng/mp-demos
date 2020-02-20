import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页'
  }

  onShareAppMessage (res) {
    console.log('Page onShareAppMessage: ', this);

    return {
      title: '自定义转发标题',
      path: 'pages/index/index?um_test=1111111111'
    }
  }

  trackEvent () {
    Taro.getApp().uma.trackEvent('buy', {
      name: 'car'
    });
  }

  render () {
    return (
      <View className='index'>
        <Button className='btn-max-w' plain type='primary' onClick={this.trackEvent}>trackEvent</Button>
      </View>
    )
  }
}
