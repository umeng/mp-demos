if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../components/demo-com/demo-com?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../npm/chameleon-ui-builtin/components/button/button?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../npm/chameleon-ui-builtin/components/page/page?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../npm/chameleon-ui-builtin/components/scroller/scroller?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=cbcbc8bacda81968de15e5ec4d28cc675f760bcd');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}