<template>
  <div class="app">
      packageA/pages/a
  </div>
</template>

<script>
export default {
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
    console.log('Page [hello] Vue created')
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
