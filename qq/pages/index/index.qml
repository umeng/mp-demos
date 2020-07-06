<!--index.wxml-->
<view>
  <button type="primary" bindtap="gotoPage1">页面1</button>
  <button type="primary" bindtap="trackEvent"> trackEvent </button>
  <button type="primary" bindtap="gotoLog"> 商品列表页 </button>
  <button type="primary" bindtap="getCache"> 获取cache </button>
  <button type="primary" bindtap="clearCache"> clearCache </button>
  <button open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 
    授权获取用户信息 
  </button>
  <button bindtap="handleSetOpenid"> setOpenid </button>
  <button bindtap="handleSetUnionid"> setUnionid </button>
  <button bindtap="handleSetUserid"> setUserid </button>
  <button open-type="share"> 分享 </button>
  <my-component></my-component>
</view>