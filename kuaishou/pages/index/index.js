//index.js
Page({
  data: {
    motto: "Hello World",
    avator:'',
    id:''
  },
  onLoad: function () {
    try {
      var value = ks.getStorageSync("um_uuid");
      if (value) {
        this.setData({id:value});
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onShareAppMessage() {
    return {
      path: "pages/index/index?d=8",
    };
  },
  track() {
    ks.uma.trackEvent("idxxxx", { test: 9 });
  },
  getinfo(res) {
    console.log(res)
    if(res.detail.userInfo){
      this.setData({ motto: res.detail.userInfo.nickName ,avator:res.detail.userInfo.avatarUrl});
    }else{
      ks.login({
        success:()=>{
          // 必须是在用户已经授权的情况下调用
          ks.getUserInfo({
            success: (res)=> {
              this.setData({ motto: res.userInfo.nickName ,avator:res.userInfo.avatarUrl});
            }
          })
        }
      })
    }
  },
});
