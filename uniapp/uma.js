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
export default uma;
