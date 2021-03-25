const plugin = requirePlugin('hello-plugin')
plugin.init({onAppShow:wx.onAppShow,onAppHide:wx.onAppHide});
App({
  onLaunch() {
  }
})
