<!-- 我的钱包 -->
<template>
	<view class="user_content">
	  <!--表头-->
	    <view class="user_head">
			<view class="user_img domain">
				<view class="userinfo-avatar">账户余额</view>
				<view class="userinfo_name">￥300.00</view>
			</view>
	    </view>
		
		<view class="center_menu">
			<view class="menu_item" v-for="item in items" >
				<image :src="item.icon" mode="aspectFill"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
	  <!-- <view class="user_edit_con">
			<navigator v-for="item in items" :url="item.url">
			    <view class="user_edit_li">
					<view class="user_edit_li_title">
					    <text :class="item.image" :style="item.color"></text>
					    <text class="fr grey">{{ item.text }}</text>
					    <text class="iconfont icon-jiantou"></text>
					</view>
			    </view>
			</navigator>
	    </view>
		 -->
		<view class="baiban">
		
		</view>
		
		<view class="center_menu">
			<view class="menu_item" v-for="item in items2" >
				<image :src="item.icon" mode="aspectFill"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
		
	   <!-- <view class="user_edit_con">
			<navigator v-for="item in items2" :url="item.url">
			    <view class="user_edit_li">
					<view class="user_edit_li_title">
						<image :src="item.image" mode="aspectFill"></image>
						<text>{{item.text}}</text>
					    <!-- <image :src="item.image" :style="item.color"class="img" mode="aspectFill"></image>
					    <text class="fr grey">{{ item.text }}</text>
					    <text class="iconfont icon-jiantou"></text> -->
				<!-- 	</view>
			    </view>
			</navigator>
	    </view> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				
			 items: [
			      {
			        // url: '',
			        icon: '../../static/fumou-center-template/in.png',
			        text: '充值',
			        // color: 'color:#63B8FF'
			      }, {
			        // url: '',
			        icon: '../../static/fumou-center-template/out.png',
			        text: '提现',
			        // color: 'color:red'
					
			      }
			    ],
			    items2: [
			      {
			        // url: '',
			        icon: '../../static/fumou-center-template/bank.png',
			        text: '银行卡',
			        // color: 'color:#63B8FF'
			      }, {
			        // url: '',
			        icon: '../../static/fumou-center-template/text.png',
			        text: '交易记录',
			        // color: 'color:red'
			      }
			    ],
			};
		},
	}
	/*
//     data() {
//         return {
//             items: [
// 				  {
// 					url: '',
// 					// image: 'iconfont icon-chongzhi1',
// 					image: '../../static/fumou-center-template/mycollection.png',
// 					text: '充值',
// 					color: 'color:#63B8FF'
// 				  }, {
// 					url: '',
// 					// image: 'iconfont icon-tixian',
// 					image: '../../static/fumou-center-template/mycollection.png',
// 					text: '提现',
// 					color: 'color:red'
// 				  }
// 				],
			// items2: [
			// 	  {
			// 		url: '',
			// 		// image: 'iconfont icon-yinhangqia',
			// 		image: '../../static/fumou-center-template/mycollection.png',
			// 		text: '银行卡',
			// 		color: 'color:#63B8FF'
			// 	  }, {
			// 		url: '',
			// 		// image: 'iconfont icon-jiaoyijilu',
			// 		image: '../../static/fumou-center-template/mycollection.png',
			// 		text: '交易记录',
			// 		color: 'color:red'
			// 	  }
			// 	],
//         };
//     }
*/
</script>

<style lang='scss'>
  
page {
  display: block;
  min-height: 100%;
  background-color: rgb(245,245,245);
}
.user_head {
    position: relative;
    background: #fff;
    padding: 20px 0;
    font-size: 14px;
    color: #ffffff;
    background:#82c5ff;
 
}
.user_img {
    margin: 0 auto;
    text-align: center;
    color: #fff;
}
 
.userinfo_name {
    clear: both;
    width: 100%;
    padding-top: 10px;
    color:#ffffff;
    font-size:20px
}
 
.userinfo-avatar {
    font-size:30px;
    font-weight: bolder;
    text-align: center;
}
 
.user_edit_con {
    background: #fff;
    margin-top:10px;
}
.icon-chongzhi1,.icon-tixian,.icon-yinhangqia,.icon-jiaoyijilu{
  font-size:30px;
  margin-right:10px;
}
 
 .icon-jiantou{
  font-size:15px;
  float:right;
}
 
.user_edit_li_title {
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    border-bottom: 1px solid #f5f5f5;
    border-bottom-color: #f5f5f5;
    font-size:14px;
 
}

.img{
	width:20px;
	height:20px;
	margin-top: 15px;
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
	
	.baiban {
		background: #FEFEFE;
		height: 30upx;
	}
	
</style>
 