<template>
	<view class="center">
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header">

					</view>
					<text>{{name}}</text>
					
				</view>
			</view>
		    <view class="baiban">

			</view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus" @tap="tiaozhuan(item.key)">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.tiname}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		onShow:function(){
			this.name=uni.getStorageSync('name');
			
		},
		
		data() {
			return {
				name:'',
				
				menus: [{
						tiname: '我的收藏',
						icon: '../../static/fumou-center-template/mycollection.png',
						key: 1,
					},
					{
						tiname: '我的信息',
						icon: '../../static/fumou-center-template/myinfo.png',
						key: 2,
					},
					{
						tiname: '历史记录',
						icon: '../../static/fumou-center-template/oldlist.png',
						key: 3,
					},
					{
						tiname: '我的钱包',
						icon: '../../static/fumou-center-template/money.png',
						key: 4,
					},{
					    tiname: '附近加油站',
					    icon: '../../static/fumou-center-template/gas.png',
					    key: 5,
					},
					{
						tiname: '关于我们',
						icon: '../../static/fumou-center-template/aboutus.png',
						key: 6,
					},
					{
						tiname: '退出登录',
						icon: '../../static/fumou-center-template/exit.png',
						key: 7,
					}

				]
			};
		},
		
		methods: {
			tiaozhuan(num){
				// console.log(num)
				if(num==7){
					uni.redirectTo({
						url:'../index/index'
					})
					uni.hideHomeButton()
					return;
				}
				uni.navigateTo({
					url:'../my'+num+'/my'+num
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.profily,
	.profily_header {
		border-radius: 8px;
	}

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
			background-image: url('../../static/fumou-center-template/header.jpg');
			background-size: 100%;
		}

		text {
			margin-left: 20px;
			font-size: 40upx;
			letter-spacing: 2px;
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 300upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 30upx;
			letter-spacing: 2px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 8%;
				background: url('../../static/fumou-center-template/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 45upx;
				height: 45upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}
</style>
