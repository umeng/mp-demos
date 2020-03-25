import * as React from 'react';
import { Text as AlipayText } from 'remax/alipay';
import { Text as WechatText } from 'remax/wechat';
import { Platform } from 'remax';

export default function Text(props) {
  switch (Platform.current) {
    case 'alipay':
      return <AlipayText {...props} />;
    case 'wechat':
    default:
      return <WechatText {...props} />;
  }
}
