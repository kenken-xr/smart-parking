<template>
	<timeline>
	    <timelineItem v-for="item in history" :leftTime="item[4].substring(0,10)">
	        <view class="tripItem">
	            <view class="title">{{item[0]}}</view>
				<view class="tips">停车场：{{item[1]}}</view>
				<view class="tips">层：{{item[2]}}</view>
				<view class="tips">停车位置：{{item[3]}}</view>
				<view class="tips">进场时间：{{item[4].substring(0,10)+' '+item[4].substring(11,19)}}</view>
				<view class="tips">离开时间：{{item[5].substring(0,10)+' '+item[5].substring(11,19)}}</view>
	        </view>
	    </timelineItem>
		
	</timeline>
</template>

<script>
	import timeline from '../../components/chenbin-timeline/timeLine.vue'
	import timelineItem from '../../components/chenbin-timeline/timelineItem.vue'
	export default {
		components:{
		    timeline,
		    timelineItem
		},
		data() {
			return {
				history:[],
				
				// history:[{
				// 	license_number:'',
				// 	parkinglot:'',
				// 	floor:'',
				// 	parkingPosition:'',
				// 	begin_time:'',
				// 	leave_time:'',
				// 	year:''
				// }]
			}
		},
		
		onLoad:function(){
			this.license_number=uni.getStorageSync('license_number');
			this.getlist();
		},
		
		methods: {
			getlist(){
				
				uni.request({
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				    url: 'http://47.117.160.161/history_search/', //接口地址。
					method:'POST',
				    data: {
						license_number_id : this.license_number
				    },
				    success: (res) => {
						if(res.data.code == 1){
							console.log(res);
							this.history=res.data.list;
							
							// history:[{
							// 	license_number:'',
							// 	parkinglot:'',
							// 	floor:'',
							// 	parkingPosition:'',
							// 	begin_time:'',
							// 	leave_time:'',
							// 	year:''
							// }]
							
							
						}
						else{
							uni.showToast({
								title:"没有历史记录哦",
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
		},
	}
</script>

<style lang="scss">
.tripItem {
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
	border-radius:10px;
	margin-bottom: 30rpx;
	.title {
	    font-size:30rpx;
	    font-family:PingFangSC-Medium,PingFang SC;
	    font-weight:500;
	    color:rgba(51,51,51,1);
	}
	.tips {
	    font-size:30rpx;
	    font-family:PingFangSC-Regular,PingFang SC;
	    font-weight:400;
	    color:rgba(153,153,153,1);
	    margin-top: 20rpx;
	}
}
</style>
