# chameleon

# 1.注册友盟+账号
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)
# 2.友盟官网申请小程序appkey
[参考官网原生小程序文档](https://developer.umeng.com/docs/147615/detail/147619)
# 3.域名白名单配置
 [官网微信小程序文档](https://developer.umeng.com/docs/147615/detail/147619) 
 [官网原生支付宝小程序接入](https://developer.umeng.com/docs/147615/detail/147727)
# 4.创建chameleon框架下的app 
[友盟sdk集成示例](https://github.com/umeng/mp-demos/tree/master/chameleon)
[cml官方的上手文档](https://cml.js.org/doc/quick_start/quick_start.html)

```bash
cml init project
```
# 5.安装sdk

```bash
cd path-to-project
npm install umtrack-alipay --save
npm install umtrack-wx --save
```
# 6.跨平台集成示例 
## 利用cml接口多态功能实现
[参考cml的接口多态功能](https://cml.js.org/doc/framework/polymorphism/api.html)
可以通过终端命令创建该文件,选择Polymorphic function，输入文件名称uma

```sh
cml init component 
# 选择 ,选择Polymorphic function ,输入uma
```
*** src/components/uma/uma.interface***

```html
<script cml-type="interface">
interface UmaInterface {
  uma:object;
}
</script>
<script cml-type="wx">
import uma from 'umtrack-wx';

class Method implements UmaInterface {
   uma = uma ;
   constructor(){
        this.uma.init({
        appKey: 'YOUR_APP_KEY',
        useOpenid: false,
        autoGetOpenid: false,
        debug: true
        });
   }
}
export default new Method().uma;
</script>
<script cml-type="alipay">
import uma from 'umtrack-alipay';

class Method implements UmaInterface {
   uma = uma ;
   constructor(){
        this.uma.init({
        appKey: 'YOUR_APP_KEY',
        debug: true
        });
   }
}

export default new Method().uma;
</script>
```
在app.cml的第一行脚本注入uma模块
***/src/app/app.cml***

```html
<script>
import uma from '/components/uma/uma.interface';
</script>
```
调用uma模块:
在其他页面中直接 import uma from '/components/uma/uma.interface'

***/src/pages/index/index.cml***
```html
<script>
import uma from '/components/uma/uma.interface';
</script>
```

# 7.自定义事件
*** /src/pages/index/index.cml ***
```js
uma.trackEvent('buy', {
  name: 'car'
})
```