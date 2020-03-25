import * as React from 'react';
import { Image as AlipayImage } from 'remax/alipay';
import { Image as WechatImage } from 'remax/wechat';
import { Platform } from 'remax';

export default function Image(props) {
  switch (Platform.current) {
    case 'alipay':
      return <AlipayImage {...props} />;
    case 'wechat':
    default:
      return <WechatImage {...props} />;
  }
}
