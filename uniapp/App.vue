<script>
	export default {
		onLaunch: function() {
			setTimeout(()=>{
				//this.$uma.setOpenid('setOpenid')
				// #ifdef MP-TOUTIAO
					this.$uma.setAnonymousid('setAnonymousid')
				// #endif
			},5000)
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
