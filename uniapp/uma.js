// #ifdef MP-WEIXIN
import uma from 'umtrack-wx';
uma.init({
  appKey: 'xxxxxx',
  useOpenid: false,
  autoGetOpenid: false,
  debug: true
});
// #endif
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
  appKey: 'xxxxx',
  debug: true
});
// #endif

// #ifdef MP-TOUTIAO
import uma from './libs/umtrack-tt/uma.min.js';
uma.init({
    appKey:'yourappkey', //由友盟分配的APP_KEY
    autoGetOpenid: true, // 是否需要通过友盟后台获取openid或匿名openid，如若需要，请到友盟后台设置appId及secret
    debug: true, //是否打开调试模式
    uploadUserInfo: true // 自动上传用户信息，设为false取消上传，默认为false
 })
// #endif

// #ifdef H5
const uma = {
	init:()=>{},
	_inited:false,
	trackEvent:()=>{},
	setOpenid:()=>{},
	setUserid:()=>{},
	setUnionid:()=>{},
	pause:()=>{},
	resume:()=>{}
}
// #endif
// 适配vue插件如此可通过Vue.use(uma)来安装
uma.install = function (Vue) {
	Vue.prototype.$uma = uma;
}
export default uma;
