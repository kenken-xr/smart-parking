<template>
	<view class="container">
		<view class="ui-all">
			
			<view class="ui-list">
				<text>昵称</text>
				<input type="text" :placeholder="value" :value="name" @input="bindName" 
					placeholder-class="place" maxlength="15"/>
			</view>
			
			<view class="ui-list">
				<text>id</text>
				<input type="text" disabled :value="user_id" placeholder-class="place" />
			</view>
			
			<view class="ui-list">
				<text>手机号</text>
				<input type="text" :placeholder="value" :value="phoneNum" @input="bindphoneNum" 
					placeholder-class="place" maxlength="11"/>
			</view>
			
			<view class="ui-list">
				<text>密码</text>
				<input type="text" :placeholder="value" :value="password" @input="bindpassword" 
					placeholder-class="place" maxlength="15"/>
			</view>
			
			<view class="ui-list">
				<text>车牌号</text>
				<input type="text" :placeholder="value" :value="license_number" 
					@input="bindlicense_number" placeholder-class="place" maxlength="7"/>
			</view>
			
			<!-- 保存修改按钮 -->
			<button class="save" @tap="savaInfo">保 存 修 改</button>
		</view>

	</view>
</template>

<script>
	export default {
		
		onShow:function(){
			this.name=uni.getStorageSync('name');
			this.user_id=uni.getStorageSync('user_id');
			this.phoneNum=uni.getStorageSync('phoneNum');
			this.password=uni.getStorageSync('password');
			this.license_number=uni.getStorageSync('license_number');
			this.ooldlicense_number=uni.getStorageSync('license_number');
		},
		
		data() {
			return {
				value: '请填写',  //无内容时的默认值
				
				name:'', //昵称
				user_id:'', //id
				phoneNum:'', //电话
				password:'', //密码
				license_number:'' ,//车牌号
				
				ooldlicense_number: '' //原来的车牌号

			}

		},
		
		
		methods: {
			bindName(e) {
				this.name = e.detail.value;
			},
			bindphoneNum(e) {
				this.phoneNum = e.detail.value;
			},
			bindpassword(e) {
				this.password = e.detail.value;
			},
			bindlicense_number(e) {
				this.license_number = e.detail.value;
			},
			
			// 点击保存修改按钮
			savaInfo(){
				
				//判断信息是否正确
				if (this.phoneNum.length !=11) {
					uni.showToast({
						title:"请输入正确的手机号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if (this.password.length < 1) {
					uni.showToast({
						title:"请设置登录密码",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if(this.name.length < 1){
					uni.showToast({
						title:"请输入昵称",
						icon:'none',
						duration: 2000
					})
					return;
				}
				if(this.license_number.length < 7){
					uni.showToast({
						title:"请输入正确的车牌号",
						icon:'none',
						duration: 2000
					})
					return;
				}
				
				console.log(this.ooldlicense_number)
				
				uni.request({
					
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				    url: 'http://47.117.160.161/updateuser/', //接口地址。
					method:'POST',
				    data: {
						user_id : this.user_id,
						newname : this.name,
						newPassword : this.password,
						newphoneNum : this.phoneNum,
						oldlicense_number : this.ooldlicense_number, //获取的原来的车牌号
						newlicense_number : this.license_number
				    },
				    success: (res) => {
						console.log(res);
						if(res.data.code == 1){
							console.log(this.license_number);
							uni.setStorage({
								key:"name",
								data:this.name,
								success: function() {
								    console.log('success2');
								}
							});
							uni.setStorage({
								key:"password",
								data:this.password,
								success: function() {
								    console.log('success3');
								}
							});
							uni.setStorage({
								key:"phoneNum",
								data:this.phoneNum,
								success: function() {
								    console.log('success3');
								}
							});
							uni.setStorage({
								key:"license_number",
								data:this.license_number,
								success: function() {
								    console.log('success3');
								}
							});
							this.ooldlicense_number=uni.getStorageSync('license_number');
							uni.showToast({
								title:"修改成功！",
								icon:'none',
								duration: 2000
							})
							setTimeout(() => {
							    //通过一个延时函数来执行排在后面的代码，这样就能够保证setStroage先执行
							}, 500)
							return;
						}
						else{
							uni.showToast({
								title:"修改失败",
								icon:'none',
								duration: 2000
							})
							return;
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

<style lang="less">
	.container {
		display: block;
	}

	.ui-all {
		padding: 20rpx 40rpx;
		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}

			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}
			
			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}

			.place {
				color: #999999;
				font-size: 30rpx;
			}
		}

		.save {
			background: #2bc0ff;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 32rpx;
		}
	}
</style>
