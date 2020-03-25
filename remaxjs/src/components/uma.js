import { Platform } from 'remax';
function uma(){
    switch (Platform.current) {
        case 'alipay':
            return  my.uma;
        case 'wechat':
            return  wx.uma
        default:
            return  wx.uma;
    }
}
export default uma;