# wepy1.x

# 1.注册友盟+账号 
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)

# 2.友盟官网申请小程序appkey
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)
# 3.配置域名白名单等
 [官网微信小程序文档](https://developer.umeng.com/docs/147615/detail/147619) 
# 4.安装sdk
```bash
cd path-to-uniappproject
npm install umtrack-wx --save
```
# 5.集成关键代码
***/src/app.wpy***
```js
import uma from 'umtrack-wx';
uma.init({
	appKey: 'xxxx',
	useOpenid: false,
	autoGetOpenid: false,
	debug: true
});
```
# 6.自定义事件
***/pages/index.wpy***
```js
onLoad(){
  my.uma.trackEvent('eventID',{pa:'fff'});
},
```
# 7. sdk集成位置尽量靠前
# 8. 关于wepy1.x注意在模拟器要关闭es6->es5，参考[https://wepyjs.gitee.io/wepy-docs/1.x/#/](https://wepyjs.gitee.io/wepy-docs/1.x/#/)