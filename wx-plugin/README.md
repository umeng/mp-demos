# 在微信小程序插件中使用友盟统计sdk
## 注意事项
1. 因为微信`小程序插件`中无法静默获取`openid`,所以在微信小程序插件中不支持自动获取`openid`，统计使用uuid,需要设置`useOpenid`为`false`
2. 微信小程序插件内暂不支持用户信息自动采集上报
3. 如需自动采集页面信息，需要在使用的页面和组件顶部单独引用sdk，参考demo，自定义事件不受此限制。
4. 需要在小程序中引用插件时传入小程序的wx对象,可以只引入{onAppShow:wx.onAppShow,onAppHide:wx.onAppHide}，并在插件中调用uma.wxpluginwraper({{onAppShow:wx.onAppShow,onAppHide:wx.onAppHide}});
5. sdk版本需要大于2.6.3,当前2.6.3版本处于beta状态，请执行 `npm view umtrack-wx@beta`查看最新的beta包