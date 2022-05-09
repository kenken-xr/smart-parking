<template>
	<view class="center">
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header"></view>
					<text>开发团队：WUT找车车项目组
					联系方式：250350232@qq.com</text>
				</view>
			</view>
		</view>
		
		<view class="baiban">
		</view>
		
		<!-- 地图，直接定位到学校 -->
		<view class="mapview">
			<map class="map" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				longitude:114.34403,
				latitude:30.512965,

				scale:13,
				markers:[
					{
						longitude:114.34403,
						latitude:30.512965,
						iconPath:'../../static/fumou-center-template/aboutus_map.png',
						width:20,
						height:20
					}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
	.center {
		height: 100%;
	
		&_box_bg {
			background: #F9F9F9;
			position: relative;
	
			.profily {
				position: absolute;
				width: 90%;
				border:1px solid #F7F7F7;
				margin: 0 auto;
				top: 40upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}
	
	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;
		.profily_header {
			height: 120upx;
			width: 120upx;
			background-image: url('../../static/logo.png');
			background-size: 100%;
			border-radius: 8px;
		}
	
		text {
			margin-left: 20px;
			font-size: 30upx;
			line-height: 60upx;
		}
	}
	
	.baiban {
		background: #FEFEFE;
		height: 300upx;
	}
	
	.map{
		width: 700rpx;
		height: 700rpx;
		margin-top: 60rpx;
		margin-left: 25rpx;
	}
</style>
