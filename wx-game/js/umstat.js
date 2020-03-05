import uma from 'umtrack-wx'

uma.init({
  appKey: 'YOUR_APP_KEY',
  // useOpenid: false,
  // autoGetOpenid: false,
  debug: true
});

wx.onShow(function (options) {
  console.log('onshow');
  uma.resume(options);
});

wx.onHide(function (options) {
  console.log('onhide');
  uma.pause();
});

wx.onShareAppMessage(function () {
  // 你要分享的元数据
  // 请先到微信管理后台配置转发图片：https://developers.weixin.qq.com/minigame/dev/guide/open-ability/share/share.html
  var share = {
    title: '转发标题',
    imageUrl: '' // 图片 URL
  };

  // 此处务必将trackShare的调用结果return
  return uma.trackShare(share);
});