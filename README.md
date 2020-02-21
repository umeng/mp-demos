### 目录说明
* wx: 微信小程序原生demo
* alipay: 支付宝小程序原生demo
* uniapp: uniapp框架demo
* taro: taro框架demo
* mpvue: mpvue框架demo
* wepy2: wepy2.0版本框架demo
* chameleon: chameleon框架demo
* wx-game: 微信小程序原生demo

> 目前只有2.2.0及以上版本的SDK才支持以上第三方框架

目前SDK的线上版本为2.1.0，新版本(2.2.0)正在内测，如需安装新版本，请执行以下步骤：
微信
* 删除本地的node_modules/umtrack-wx目录
* 删除本地的miniprogram_npm目录
* 安装最新版本：npm i umtrack-wx@nex
* 确认最新版本为 2.2.1-0
* 重新构建：微信开发者工具-工具-构建npm

支付宝
* 删除本地的node_modules/umtrack-alipay目录
* 安装最新版本：npm i umtrack-alipay@next
* 确认最新版本为 2.2.1-0
* 清空缓存，重新编译
