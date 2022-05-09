<template>
	<view @click="close" class="mask">
		
		
		
		<view @click.stop="onClick" class="content">
			<!-- <text class="text">点击蒙层关闭</text> -->
			<image v-if="flag[0]" style="width:270px;height:127px;margin-top:235px;margin-left:45px" @click="click(0)" src="../../static/help_0.png" >
			</image>
							
<!-- 			<image  v-if="flag[1]" style="width:200px;height:90px;margin-top:455px;margin-left:5px" @click="click(1)" src="../../static/help_1.png" >
			</image> -->
			<!-- 455px -->
			<view class="div" v-show="flag[1]" style="width:178px;height:80px;margin-top:480px;margin-left:5px" @click="click(1)">
				
				<view class="wenzi"> 
					{{sentence[1]}}
				</view>
				<view class="next">
					下一步
				</view>
			</view>
			<view class="div" v-show="flag[2]" style="width:180px;height:80px;margin-top:480px;margin-left:145px" @click="click(2)">
				<view class="wenzi"> 
					{{sentence[2]}}
				</view>
				<view class="next_2">
					下一步
				</view>
			</view>
			
<!-- 			<image  v-if="flag[2]" style="width:200px;height:90px;margin-top:455px;margin-left:145px" @click="click(2)" src="../../static/help_2.png" >
			</image> -->
			<image  v-if="flag[3]" style="width:270px;height:127px;margin-top:235px;margin-left:45px" @click="close" src="../../static/help_11.png" >
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag:[false,false,false,false], //先假设有四个提示
			    sentence:["扫码可以进入小地图","点击这里可以进行室外导航","点击这里可以扫码缴费、场内寻车","以上就是所有的提示了，希望您使用愉快"]
			    
			}
		},
		onLoad(){
			var first_flag = uni.getStorageSync('first_flag');
			var first_flag =false;//最后这里需要改一下，把这一行删去即可
			console.log(first_flag)
		    if(first_flag==false)
			{
				var that=this;  
				that.flag[0]=true;
				that.$forceUpdate()
			}
		},
		methods: {
			onClick(e) {
				// uni.showToast({
				// 	title: "点击蒙层关闭"
				// })
				// #ifdef APP-NVUE
				e.stopPropagation()
				// #endif
			},
			close() {
				uni.navigateBack()
			},
			click(index){
				// console.log(this.flag[index])
				this.flag[index] = false;
				// console.log(this.flag[index])
				this.flag[index+1]=true;
				this.$forceUpdate()
				if(index==3){
					uni.setStorageSync('first_flag', true);
				}
			}
		}
	}
</script>

<style>
	@font-face {
		font-family:Muyao-Softbrush;
		src: url('`@/static/font/Muyao-Softbrush.ttf');
	}
	/* body {
		font-family:Arial,Helvetica,sans-serif;
		font-size:1em;
		vertical-align:middle;
		font-weight:normal;
    } */
	page {
		background: transparent;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		/* justify-content: center;
		align-items: center; */
		background-color: rgba(0, 0, 0, 0.4);
	}

	.content {
	}
	
    .all{
    }
    .div{
    	border: 2px  solid #d7e7f3;
    	border-radius: 7px;  /*圆角弧度为7px*/
    	position: relative;
    	background:#d7e7f3;
    }
	
    .wenzi{
		margin-top: 10rpx;
	    margin-left: 10rpx;
		font-size: 35rpx;
		font-weight:600;
		flex-direction: row;
		/* font-family: "KaiTi"; */
		font-family:"Muyao-Softbrush";
    }
	.wenzi_1{
		margin-top: 20rpx;
	    margin-left: 12rpx;
		font-size: 35rpx;
		font-weight:600;
		flex-direction: row;
		font-family: "Times New Roman",Times, serif;
	}
    .next{
    	margin-left: 120px;
    	margin-top: 2px;
    	font-size: 30upx;
    	font-weight: 500;
    	color: #2196F3;
    	font-family:"Arial";
    	width:45px;
    	border-bottom: 1px dashed  #2196F3;
		/* #795548 */
    }
	.next_2{
		margin-left: 120px;
		margin-top: 2rpx;
		font-size: 30upx;
		font-weight: 500;
		/* color: #be409b; */
		color:#2196F3;
		/* display:block; */
		font-family:"Arial";
		width:45px;
		border-bottom: 1px dashed  #2196F3;
	}
    .close{
    	margin-left: 145px;
    	margin-bottom: 10px;
    	font-size: 30upx;
    	font-weight: 500;
    	color: #2196F3;
    	display:block;
    	font-family:"Arial";
    	width:30px;
    	border-bottom: 1px dashed #2196F3;
    }
    .div::before{
    	content: '';
    	width: 0;
    	height: 0;
    	border: 20px solid;
    	position: absolute;
    	bottom: -40px;
    	left: 120px;
    	border-color:  #d7e7f3 transparent transparent;
		/* #f6f6de */
    }
    
	
</style>
