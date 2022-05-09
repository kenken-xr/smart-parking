<template>
	<view class="changepass">
		<!--顶部返回按钮-->
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<!-- 顶部背景 -->
		<view class="login-top bg-active">
			<view class="desc">
				<view class="title">Hi~</view>
				<text>请重新设置密码</text>
			</view>
		</view>
		
		<!-- 忘记密码 -->
		<view class="login-type-content">
			<image class="login-bg" src="/static/login-bg.png" style="height: 200vx;"></image>
			<view class="main">
				<view class="nav-bar">
					忘记密码
				</view>
				
				<!-- 表单部分 -->
				<block>
					<view class="login-type-form">
						
						<!-- 手机号 -->
						<view class="item">
							<image class="login_image" src="../../static/login/userName.png"></image>
							<input class="main-input" type="number" v-model="phonedata" 
								placeholder="请输入手机号" maxlength="11" />
						</view>
						
						<view style="margin-top: 8px"></view>
						
						<!-- 验证码 -->
						<view class="item">
							<image class="login_image" src="../../static/login/phone.png"></image>
							<view class="type">
								<input v-model="code" class="main-input-code" maxlength="6" type="number" 
									placeholder="请输入验证码" />
								<!-- <getCode codeText="获取验证码" setTime="10" ref="runCodes" style="font-size: 10px;"
									@setCode="sendMsg()">
								</getCode> -->
								
								<text class="code-text" :class="{gray:showTime}" @click="handleGetCodeClick">
									{{showTime ?currentCountTime+'s后重新获取':'获取验证码'}}
								</text>
							</view>
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
						
					</view>
					
					<!-- 提交按钮 -->
					<button class="confirm-btn bg-active" :disabled="btnLoading"
						:loading="btnLoading" @tap="changepassword">
						提交
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
	export default {
		data() {
			return {
				phonedata: '', //电话
				passdata: '', //密码
				code:'',//验证码
				isRotate: false ,//是否加载旋转
					
				ispassword:'', //再次输入的密码
					
				btnLoading: false,
				
				appName: '找车车',
				
				countTime: 60,
				currentCountTime: 60,
				showTime:false,
				timeId:null
			}
		},
		methods: {
			// 返回上一页
			navBack() {
				uni.navigateBack();
			},
			
			//验证码倒计时
			// sendMsg(){
			// 	//获取验证码
			// 	if (this.phonedata.length < 11) {
			// 	     uni.showToast({
			// 	        icon: 'none',
			// 			position: 'bottom',
			// 	        title: '手机号不正确'
			// 	    });
			// 	    return;
			// 	}
			// 	console.log("获取验证码")
			// 	this.$refs.runCode.$emit('runCode'); //触发倒计时
			// 	console.log("触发倒计时")
			// 	this.isRotate=true;
				
			// 	setTimeout(function(){
			// 		this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
			// 		console.log("倒计时终止");
			// 		this.isRotate=false;
			// 	},3000)
			// },
			
			handleGetCodeClick() {
				this.showTime = true
				if(this.showTime && this.currentCountTime !== this.countTime) return
				this.currentCountTime
				this.timeId = setInterval(()=>{
					if(this.currentCountTime <= 0) {
						this.currentCountTime = this.countTime
						this.showTime = false
						clearInterval(this.timeId)
					}
					this.currentCountTime--
				},1000)
			},
			
			//改密码
			changepassword(){
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
				
				if (this.code.length < 6) {
					uni.showToast({
						title:"验证码错误",
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
				if(this.passdata!==this.ispassword){
					uni.showToast({
						title:"两次密码输入不一致",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				uni.showLoading({
					title:'提交中...'
				});
				setTimeout(function () {
				    uni.hideLoading();
				}, 2000);
				
				uni.request({
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					url: 'http://47.117.160.161/find_password/', 
					method:'POST',
				    data: {
						phoneNum:this.phonedata,
						new_password:this.passdata
				    },
				    success: (res) => {
				        console.log(res);
						if(res.data.code !== 1){
							uni.showToast({
								title:"密码修改失败",
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
				
			}
		}
	}
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
		width: 56%;
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
	
	.code-text {
		font-size: 32rpx;
		color: $base-color;
	}
	.gray {
		color: #C0C0C0;
	}
	
	.changepass {
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
				height: 115vw;
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
					line-height: 96rpx;
					font-size: 34rpx;
					margin: 0 120rpx;
					border-bottom: 5rpx solid;
					color: $base-color;
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
						.sms-code-btn, sms-code-resend {
							width: 240rpx;
							font-size: 26rpx;
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
