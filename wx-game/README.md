# wx-game



# 下载微信小游戏sdk包
最新sdk[下载地址](.https://g.alicdn.com/jssdk/mini/2.3.2/4b6656d/umtrack-wx-game.zip)

# 集成方法一
在小游戏启动文件`game.js`顶部添加

```js
import uma from './umtrack-wxgame/uma.min.js';
uma.init({
  appKey: 'xxxx',
  useOpenid: false, // default true
  autoGetOpenid: false,
  debug: true
});
// 主程序 

```
其他模块可通过wx.uma来引用
# 集成方法二
编写一个es模块
*uma.js*
```js
import uma from './umtrack-wxgame/uma.min.js'

uma.init({
  appKey: 'xxx',
  useOpenid: false,
  autoGetOpenid: false,
  debug: true
});
export default uma;
```
其他模块可以通过import这个uma模块来使用uma

# 方法列表
-  `uma.onShareAppMessage()`替代wx.onShareAppMessage
-  `uma.shareAppMessage()`替代wx.shareAppMessage
-  `uma.trackShare`见下方《关于分享事件和方法》
-  `uma.trackEvent`同微信小程序统计sdk
-  `uma.setOpenid`同微信小程序统计sdk
-  `uma.setUnionid`同微信小程序统计sdk
-  `uma.setUserid`同微信小程序统计sdk
-  `uma.init`同微信小程序统计sdk

# 关于分享事件和方法
不想使用uma.shareAppMessage来调用分享？那么你可以在wx.shareAppMessage的回调中自行调用uma.trackShare上报分享事件，该方法传入分享参数，返回对象中会添加分享追踪相关的query

示范代码wx.shareAppMessage
```js
 var  data = wx.uma.trackShare({query:"foo=bar",title:'调trackShare'});
 wx.shareAppMessage(data);
```
示范代码wx.onShareAppMessage
```js
wx.onShareAppMessage(function(){
  var share = {
    title: '代码调用分享',
    imageUrl: '', // 图片 URL
    query:'key1=val1&key2=val2'
  };
  let data = wx.uma.trackShare(share);
  return data;
})
```
