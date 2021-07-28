# cocos 小游戏使用说明

## 作为普通脚本集成

下载sdk后，把uma.js放到cocos工程中，在启动场景的脚本中加入如下代码

````javascript
var uma = require('./uma.js');
uma.init({
	appKey:'xxx',
	useOpenid:false,
	debug:true
});
````

## sdk在其他地方引用

-  通过qg.uma来引用
-  通过require uma 模块来引用



