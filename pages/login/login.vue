<template>
	<view class="login">
		<!--顶部返回按钮-->
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<!-- 顶部背景 -->
		<view class="login-top bg-active">
			<view class="desc">
				<view class="title">Hi~</view>
				<text>{{ appName }}欢迎您</text>
			</view>
		</view>
		
		<!-- 登录注册部分 -->
		<view class="login-type-content">
			<image class="login-bg" src="/static/login-bg.png" :style="{height: tabCurrentIndex === 1 ? '130vw' : '90vw'}"></image>
			<view class="main">
				<view class="nav-bar">
					<view class="nav-bar-item" v-for="(item, index) in typeList" :key="index"
						:class="tabCurrentIndex === index ? 'nav-bar-item-active text-active' : ''"
						@tap="tabClick(index)" >
						{{ item.text }}
					</view>
				</view>
				
				<!-- 登录 -->
				<block v-if="tabCurrentIndex === 0">
					<view class="login-type-form">
						
						<!-- 输入手机号 -->
						<view class="item">
							<image class="login_image" src="../../static/login/userName.png"></image>
							<input v-model="phonedata" class="main-input" placeholder="请输入手机号" maxlength="11"/>
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 输入密码登录 -->
						<view class="item">
							<image class="login_image" src="../../static/login/password.png"></image>
							<input v-model="passdata" class="main-input" type="password" placeholder="请输入密码" />
						</view>
						
					</view>
					
					<!-- 登录按钮 -->
					<button class="confirm-btn bg-active" :disabled="btnLoading"
							:loading="btnLoading" @tap="Login">
						登录
					</button>
					
					<!-- 忘记密码 -->
					<view class="login-type-tips">
						<navigator url="/pages/forget/forget" open-type="navigate">忘记密码?</navigator>
					</view>
				</block>
				
				<!-- 注册 -->
				<block v-if="tabCurrentIndex === 1">
					<view class="login-type-form">
						<!-- 手机号 -->
						<view class="item">
							<image class="login_image" src="../../static/login/userName.png"></image>
							<input class="main-input" type="number" v-model="phonedata" 
								placeholder="请输入手机号" maxlength="11" />
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 设置密码 -->
						<view class="item">
							<image class="login_image" src="../../static/login/password.png"></image>
							<view class="type">
								<input v-model="passdata" class="main-input-code" maxlength="20" 
									type="password" placeholder="请设置密码" />
							</view>
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 再次输入密码 -->
						<view class="item">
							<image class="login_image" src="../../static/login/code.png"></image>
							<view class="type">
								<input v-model="ispassword" class="main-input-code" maxlength="15" 
									type="password" placeholder="请再次输入密码" />
							</view>
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 设置昵称 -->
						<view class="item">
							<image class="login_image" src="../../static/login/name.png"></image>
							<view class="type">
								<input v-model="namedata" class="main-input-code" maxlength="15" 
									placeholder="请设置昵称" />
							</view>
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 设置车牌号 -->
						<view class="item">
							<image class="login_image" src="../../static/login/carlicense.png"></image>
							<view class="type">
								<input v-model="license_numberdata" class="main-input-code" maxlength="7" 
									placeholder="请输入您的车牌号" />
							</view>
						</view>
					</view>
					
					<!-- 注册按钮 -->
					<button class="confirm-btn bg-active" :disabled="btnLoading"
						:loading="btnLoading" @tap="Register">
						注册
					</button>
					
				</block>
			</view>
		</view>
		<view class="login-type-bottom text-active">
		  {{ appName }} 版权所有
		</view>
	</view>
</template>
<script>
	var _this;
	
	export default {
		data() {
			return {
				phonedata: '', //电话
				passdata: '', //密码
				isRotate: false ,//是否加载旋转
					
				ispassword:'', //再次输入的密码
				namedata:'' ,//昵称
				license_numberdata:'' ,//车牌号
					
				// user_id:'',
				btnLoading: false,
				appName: '找车车',
				tabCurrentIndex: 0,
				typeList: [
					{
						text: '登录'
					},
					{
						text: '注册'
					}
				]
			};
		},
		mounted() {
			_this = this;
		},
		destroyed() {
			uni.hideKeyboard();
		},
		onLoad(options) {
			this.tabCurrentIndex = parseInt(options.type || 0, 10);
		},
		methods: {
			// 返回上一页
			navBack() {
				uni.navigateBack();
			},
			// 切换登录/注册
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			
			// 提交表单
			toLogin() {
				uni.showLoading({
					title:'登录中...'
				});
				setTimeout(function () {
				    uni.hideLoading();
				}, 2000);
				
				uni.request({
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				    url: 'http://47.117.160.161/signin/', //接口地址。
					method:'POST',
				    data: {
						phoneNum:this.phonedata,
						password:this.passdata
				    },
				    success: (res) => {
				        console.log(res);
						if(res.data.code !== 1){
							uni.showToast({
								title:"手机号或密码错误",
								icon:'none',
								duration: 2000
							})
							return;
						}
						else{
							uni.setStorage({
								key:"user_id",
								data:res.data.user_id,
								success: function() {
								    console.log('success1');
								}
							});
							uni.setStorage({
								key:"name",
								data:res.data.name,
								success: function() {
								    console.log('success2');
								}
							});
							uni.setStorage({
								key:"password",
								data:this.passdata,
								success: function() {
								    console.log('success3');
								}
							});
							uni.setStorage({
								key:"phoneNum",
								data:this.phonedata,
								success: function() {
								    console.log('success3');
								}
							});
							uni.setStorage({
								key:"license_number",
								data:res.data.license_number,
								success: function() {
								    console.log('success3');
								}
							});
							setTimeout(() => {
							    //通过一个延时函数来执行排在后面的代码，这样就能够保证setStroage先执行
							}, 500)
							uni.switchTab({
								url: '../map/map'
							})
						}
						
						
				    },
					catch: (res) => {
						uni.hideLoading();
					}
				});
			},
			
			//点击登录按钮
			Login() {
				if (this.phonedata.length < 11) {
					uni.showToast({
						title:"请输入正确的手机号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				// 判断是否是手机号
				var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
				if(!strTemp.test(this.phonedata)){
					uni.showToast({
						title:"请输入有效的手机号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				if (this.passdata.length < 1) {
					uni.showToast({
						title:"请输入密码",
						icon:'none',
						duration: 2000
					})
					return;
				}
				this.toLogin();
			},
			
			
			toRegister() {
				uni.showLoading({
					title:'注册中...'
				});
				setTimeout(function () {
				    uni.hideLoading();
				}, 2000);
				
				uni.request({
				    header: {
				    	'Content-Type': 'application/x-www-form-urlencoded'
				    },
				    url: 'http://47.117.160.161/signup/', //接口地址。
					method:'POST',
				    data: {
						phoneNum:this.phonedata,
						password:this.passdata,
						name:this.namedata,
						license_number:this.license_numberdata
				    },
				    success: (res) => {
				        // console.log(res);
				    	if(res.data.code !== 1){
				    		uni.showToast({
				    			title:"注册失败",
				    			icon:'none',
				    			duration: 2000
				    		})
				    		return;
				    	}
				    	else{
				    		uni.setStorage({
				    			key:"user_id",
				    			data:res.data.user_id,
				    			success: function() {
				    			    console.log('success1');
				    			}
				    		});
				    		uni.setStorage({
				    			key:"name",
				    			data:this.namedata,
				    			success: function() {
				    			    console.log('success2');
				    			}
				    		});
				    		uni.setStorage({
				    			key:"password",
				    			data:this.passdata,
				    			success: function() {
				    			    console.log('success3');
				    			}
				    		});
							uni.setStorage({
								key:"phoneNum",
								data:this.phonedata,
								success: function() {
								    console.log('success3');
								}
							});
							uni.setStorage({
								key:"license_number",
								data:this.license_numberdata,
								success: function() {
								    console.log('success3');
								}
							});
				    		setTimeout(() => {
				    		    //通过一个延时函数来执行排在后面的代码，这样就能够保证setStroage先执行
				    		}, 500)
				    	}
				    	uni.switchTab({
				    		url: '../map/map'
				    	})
				    	
				    },
					catch: (res) => {
						uni.hideLoading();
					}
				});
			},
			
			//点击注册按钮
		    Register() {
				
				if (this.phonedata.length <11) {
					uni.showToast({
						title:"请输入正确的手机号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				// 判断是否是手机号
				var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
				if(!strTemp.test(this.phonedata)){
					uni.showToast({
						title:"请输入有效的手机号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				if (this.passdata.length < 1) {
					uni.showToast({
						title:"请设置登录密码",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if(this.passdata!==this.ispassword){
					uni.showToast({
						title:"两次密码输入不一致",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if(this.namedata.length < 1){
					uni.showToast({
						title:"请输入昵称",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if(this.license_numberdata.length < 7){
					uni.showToast({
						title:"请输入正确的车牌号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				var n=/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(this.license_numberdata)
				// console.log(n);
				if(!n){
					uni.showToast({
						title:"请输入正确的车牌号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				this.toRegister();
			}
		}
	};
</script>
<style lang="scss">
	
	page {
		background: #fff;
	}
	.item {
		line-height: 40px;
		display: flex;
	}
	
	.login_image {
		margin-top: 10px;
		width: 19px;
		height: 19px;
	}
	.type {
		display: flex;
		margin-left: 16px;
		border-bottom: 1px solid #EEEEEE;
		width: 100%;
	}
	.main-input-code {
		width: 60%;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
	
	.main-input {
		width: 100%;
		font-size: 14px;
		margin-left: 16px;
		border-bottom: 1px solid #eeeeee;
		height: 40px;
		line-height: 40px;
	}
	
	.login {
		width: 100%;
		position: relative;
		
		.bg-active {
		  // background-color: $base-color;
		  background: linear-gradient(to right,#ABDCFF,#16bdef);
		  color: #fff;
		}
		.text-active, .iconfont {
		  color: $base-color;
		}
		.back-btn {
			position: absolute;
			left: 40rpx;
			z-index: 9999;
			padding-top: var(--status-bar-height);
			top: 40rpx;
			font-size: 48rpx;
			color: #fff;
		}
		.login-top {
			height: 300rpx;
			position: relative;
			.desc {
				color: #fff;
				position: absolute;
				top: 80rpx;
				left: 40rpx;
				font-size: 48rpx;
				.title {
					font-size: 48rpx;
				}
			}
		}
		.login-type-content {
			position: relative;
			top: -72rpx;
			.login-bg {
				width: 94vw;
				height: 94vw;
				margin: 0 3vw;
			}
			.main {
				width: 94vw;
				position: absolute;
				top: 0;
				left: 3vw;
				.nav-bar {
					display: flex;
					height: 100rpx;
					justify-content: center;
					align-items: center;
					position: relative;
					z-index: 10;
					.nav-bar-item {
						flex: 1;
						display: flex;
						height: 100%;
						line-height: 96rpx;
						font-size: 34rpx;
						display: flex;
						margin: 0 120rpx;
						justify-content: center;
					}
					.nav-bar-item-active {
						border-bottom: 5rpx solid;
					}
				}
				.login-type-form {
					width: 80%;
					margin: 50rpx auto;
					.input-item {
						position: relative;
						height: 90rpx;
						line-height: 90rpx;
						margin-bottom: 30rpx;
						.iconfont {
							font-size: 50rpx;
							position: absolute;
							left: 0;
						}
						.login-type-input {
							height: 90rpx;
							padding-left: 90rpx;
							border-bottom: 1rpx solid rgba(0, 0, 0, .1);
						}
					}
				}
				.login-type-tips {
					margin-top: 16px;
					padding: 0 50rpx;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #666;
				}
				.confirm-btn {
					margin-top: 60upx;
					width: 80%;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}
		.login-type-bottom {
			width: 100%;
			padding-bottom: 40rpx;
			text-align: center;
			font-size: 32rpx;
		}
	}
</style>
