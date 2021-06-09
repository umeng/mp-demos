import uma from './uma.min.js'

uma.init({
  appKey: 'YOUR APP KEY',
  useOpenid: false, //default true
  autoGetOpenid: false,
  debug: true,
  uploadUserInfo:true
});
//uma.setUserInfo({city:88})
export default uma;