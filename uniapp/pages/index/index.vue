<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<button type="primary" @click="trackEvent">trackEvent</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		onShareAppMessage() {
		    return {
		        title: '欢迎体验uni-app',
		        path: '/pages/index/index'
		    };
		},
		onNavigationBarButtonTap(e) {
		    uni.navigateTo({
		        url: '/pages/about/about'
		    });
		},
		onLoad() {
			console.log('onLoad');
		},
		onReady() {
			console.log('onReady');
		},
		onShow() {
		    console.log('onShow');
		},
		onHide() {
		    console.log('onHide');
		},
		methods: {
			trackEvent () {
				this.$uma.trackEvent('buy', {
					name: 'tv'
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
