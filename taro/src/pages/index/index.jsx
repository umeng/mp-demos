import Taro, { Component, uma } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

//import uma from '../../uma/uma';

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    uma.trackEvent('bu7y', {
      name: 'car3'
    });
    Taro.uma.trackEvent('ooooo', {
      name: 'car4'
    });

   }

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
    uma.trackEvent('buy', {
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
