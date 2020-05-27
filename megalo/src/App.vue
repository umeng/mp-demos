
<script>
export default {
  onLaunch (options) {
    // Do something initial when launch.
    console.log('App onLaunch, env文件自定义的环境变量VUE_APP_TEST值:', process.env.VUE_APP_TEST)
  },
  onShow (options) {
    // Do something when show.
    console.log('App onShow')
  },
  onHide () {
    // Do something when hide.
    console.log('App onHide')
  },
  onError (msg) {
    console.log('App onError')
    console.log(msg)
  },
  globalData () {
    return {
      a: 'I am global data'
    }
  }
}
</script>
