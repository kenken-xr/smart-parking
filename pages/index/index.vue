<template>
  <view class="login-type">
	<image class="backimg" src="/static/index_background.jpg"></image>
    <view class="logo">
      <image src="/static/logo_white.png"></image>
    </view>
	
    <button class="confirm-btn1" :disabled="btnLoading" @tap="navTo('/pages/login/login')">
      已有账号登录
    </button>
    <button class="confirm-btn2" :disabled="btnLoading" @tap="navTo(`/pages/login/login?type=1`)">
      立即注册
    </button>
    
	<!--协议popup-->
	<rf-protocol-popup ref="mapState" @popupState="popupState" protocolPath="/pages/set/about/detail?field=protocol_register&title=注册协议"
	    policyPath="/pages/set/about/detail?field=protocol_privacy&title=隐私协议"
	    v-if="isRfProtocolPopupShow" >
	</rf-protocol-popup>
	
    <!-- 底部协议 -->
    <view class="footer-protocol">
	  <checkbox :checked="appAgreementDefaultSelect" @tap="changecheck" color="#4F4F4F" style="transform: scale(0.6);"></checkbox>
      <text class="content">注册与登录表示同意</text>
      <!-- 协议地址 -->
      <text @tap="handleRfProtocolPopupShow">《{{appName}}协议》</text>
    </view>
  </view>
</template>

<script>
	
	import rfProtocolPopup from '@/components/rf-protocol-popup';
	export default {
		components: { rfProtocolPopup },
		data() {
			return {
				btnLoading: false,
				isRfProtocolPopupShow: false, // 控制协议popup显示
				appAgreementDefaultSelect: true,
				appName: '找车车'
			};
		},
		onShow() {
			if (uni.getStorageSync('accessToken')) {
				this.$mRouter.reLaunch({ route: '/pages/index/index' });
			}
		},
		onLoad(options) {
			// 如果不是第一次进来 就不需要强制阅读协议
			if (!uni.getStorageSync('notFirstTimeLogin')) {
				this.appAgreementDefaultSelect = false;
			} 
			else {
				this.appAgreementDefaultSelect = true;
			}
		},
		methods: {
			// 通用跳转
			navTo(url) {
		    if (!this.appAgreementDefaultSelect) {
					uni.showToast({
						title:'请勾选并阅读协议，才能进行下一步哦',
						icon:'none',
						duration: 2000
					})
					return;
				}
				uni.navigateTo({ url });
			},
			// 显示协议popup
			handleRfProtocolPopupShow() {
				this.isRfProtocolPopupShow = true;
			},
			//点击对号
			changecheck() {
				this.appAgreementDefaultSelect=!this.appAgreementDefaultSelect;
				uni.setStorageSync('notFirstTimeLogin', true);
			},
			// 监听是否同意协议
			popupState(e) {
				if (e) {
					this.appAgreementDefaultSelect = true;
					uni.setStorageSync('notFirstTimeLogin', true);
					this.isRfProtocolPopupShow = false;
				} 
				else {
					this.appAgreementDefaultSelect = false;
					this.isRfProtocolPopupShow = false;
				}
			}
		}
	};
</script>
<style lang="scss">
  page {
    background: #FFFAFA;
  }
  
  .login-type {
    .backimg{
		  width: 750rpx;
		  height: 650rpx;
    }
    .logo {
      text-align: center;
      margin-top: -100rpx;

      image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 35rpx;
		box-shadow: 0 5px 15px #1296db;
		
      }
    }
    .confirm-btn1 {
      width: 75%;
	  margin: 0 auto;
	  margin-top: 50rpx;
      height: 84rpx;
      line-height: 84rpx;
      font-size: 34rpx;
      border: 1rpx solid;
      color: white;
      background: $base-color;
    }
	
	.confirm-btn2 {
	  width: 75%;
	  margin: 0 auto;
	  margin-top: 50rpx;
	  height: 84rpx;
	  line-height: 84rpx;
	  font-size: 34rpx;
	  border: 1rpx solid;
	  color: $base-color;
	  background: none;
	}
    
    .footer-protocol {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28upx;
	  color: #4F4F4F;
	  margin-top: 40rpx;
      margin-bottom: 30upx;
      padding-bottom: 30upx;
      
    }
  }
</style>
