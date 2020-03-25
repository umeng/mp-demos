import * as React from 'react';
import { View, Text, Image, uma } from '@/components';
import styles from './index.module.css';
import { useReady } from 'remax';

export default () => {
  console.log(999);
  useReady(()=>{
    console.log(999);
    uma().trackEvent('ppp');
  });
  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ"
          className={styles.logo}
          alt="logo"
        />
        <View className={styles.text}>
          编辑 <Text className={styles.path}>src/pages/index/index.js</Text>开始
        </View>
      </View>
    </View>
  );
};
