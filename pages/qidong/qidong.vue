<template>
	<view class="background" :style="'height:'+ screenHeight +'px !important;'">
		<image class="backimg" src="../../static/yindao.jpg"></image>
		<button class="tiaoguo" style="color:white; plain=true" plain="true" @click="navi" >跳过</button> 
	</view>
</template>

<script>

	export default{
		data(){
			return{
				screenHeight: '',
			}
		},
		onLoad() {
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
			var interval = setInterval(() => {
										// --_this.countdown
										 console.log(111)
									}, 3)
			setTimeout(() => {
				clearInterval(interval)
				uni.redirectTo({
					url:"../index/index"
				})
				uni.hideHomeButton()
			}, 2000)
		},
		methods:{
			navi(){
				uni.redirectTo({
					url:"../index/index"
				})
				uni.hideHomeButton()
			}
		}
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
	}
	
	.background{
		width: 100%;
		height: 100%;
	}
	.backimg{
		width: 100%;
		height: 100%;
	}
	.tiaoguo{
		border:2px solid #FFFFFF;
		margin-top:  -1350rpx;
		/* -1350rpx; */
		margin-right: 50rpx;
		width: 140rpx;
		padding: 0;
		font-size: 30rpx;
		line-height: 50rpx;
		letter-spacing: 10rpx;
	}
</style>

