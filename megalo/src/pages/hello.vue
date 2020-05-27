<template>
  <div class="app">
      <img class="img" src="../static/imgs/megalo_logo.png" @touchstart="changeStat">
      <hello-world :color="color"></hello-world>
      <h1 class="txt" v-show="t%2==1">click logo::{{t}}</h1>
      <button @tap="gotopage" >gotopageA</button>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {
    HelloWorld
  },
  data () {
    return {
      t: 1,
      color: '#007d37'
    }
  },
  beforeCreate () {
    console.log('Page [hello] Vue beforeCreate')
  },
  created () {
    this.$uma.trackEvent('lllll')
    console.log('Page [hello] Vue created')
    var appInstance = getApp()
    console.log(appInstance.globalData) // I am global data
  },
  beforeMount () {
    console.log('Page [hello] Vue beforeMount')
  },
  mounted () {
    console.log('Page [hello] Vue mounted')
  },
  onLoad (options) {
    // Do some initialize when page load.
    console.log('Page [hello] onLoad')
  },
  onReady () {
    // Do something when page ready.
    console.log('Page [hello] onReady')
  },
  onShow () {
    // Do something when page show.
    console.log('Page [hello] onShow')
  },
  onHide () {
    // Do something when page hide.
    console.log('Page [hello] onHide')
  },
  onUnload () {
    // Do something when page close.
    console.log('Page [hello] onUnload')
  },
  /**
   * for other event handlers, please check https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html
   */
  methods: {
    changeStat () {
      this.t++
      this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
    },
    gotopage () {
      wx.navigateTo({
        url: '/packageA/pages/a/index'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app{
  padding-top: 100px;
  .img {
    display: block;
    height: 120px;
    width: 138px;
    margin: 20px auto;
  }
  .txt {
      color: #567567;
      font-size: 13px;
      text-align: center;
  }
}
</style>
