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
