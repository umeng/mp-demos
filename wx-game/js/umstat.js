import uma from './utils/umtrack-wx-game/index'

wx.showShareMenu({
  withShareTicket: true
});
/**
 * 方法一onShareAppMessage
 */
uma.onShareAppMessage( ()=> {
  // 你要分享的元数据
  // 请先到微信管理后台配置转发图片：https://developers.weixin.qq.com/minigame/dev/guide/open-ability/share/share.html
  var share = {
    title: '右上角分享',
    imageUrl: '', // 图片 URL
    //query:'key1=val1&key2=val2'
  };
  // 此处务必将trackShare的调用结果return
  return share;
}); 

/**
 * onShareAppMessage 方法二
 */
// wx.onShareAppMessage(function(){
//   var share = {
//     title: '右上角分享',
//     imageUrl: '', // 图片 URL
//     query:'key1=val1&key2=val2'
//   };
//   let data = wx.uma.trackShare(share);
//   return data;
// })
