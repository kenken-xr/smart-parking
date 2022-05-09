<!-- 我的收藏 -->
<!-- 已测试 -->
<template>
	<view class="container">
		<view class="item" v-for="poi in showPois">
			<image class="pic" :src="primary"></image>
			
			<text class="name">{{ poi[0]}}</text>
			
			<view class="icon">
				<image class="wish" src="../../static/imgs/wish.png" v-show="!showUpImg[poi[3]]"
						@click="changeImg(poi)" mode="">
				</image>
				<image class="wish" src="../../static/imgs/wish_selected.png" v-show="showUpImg[poi[3]]" 
						@click="changeImg(poi)" mode="">
				</image>
				
				<image class="loc" @click="viewMapLocation(poi[1],poi[2],poi[0])" :src="titleImg" />
			</view>
			
		</view>
	</view>
</template>

<script>
	var amap = require('@/common/amap-wx.130.js'); //require这个js模块
		
	export default {
		name: 'HmFriendInformationCard',
		props: {
		  dataId: {
		    type: String,
		    default: 'hm-friend-information-card'
		  },
		},
		
		data() {
			return {
				user_id_id:'',
				amapPlugin: null, //new地图
				key: '986e3e528e41c7db57356cc78a3727a9', //对应wx小程序的高德地图key
				showPois: [], //用于显示的poi
				//这个长度根据需要改
				showUpImg:[],
			    // animationData: {},
				primary:
				'/static/hm-friend-information-card/images/img_wish_location.png',
				
				titleImg:
				'/static/hm-friend-information-card/images/1.png',
				
			}
		},
		onLoad:function() {
			this.user_id_id=uni.getStorageSync('user_id');
			this.initshowPois();
            this.$forceUpdate();
			
		},
		computed: {
			activeThemeStyle() {
				return "background-color:#abd8cf;color:#d2000f"
			},
		},
		onReady:function() {
			this.user_id_id=uni.getStorageSync('user_id');
			console.log("index onReady")
			//new实例化高德sdk
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});
			
		},
		//这里可以借鉴，还需要再改改
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享去智慧停车场小程序',
				path: '/pages/map/map'
			}
		},
		

		methods: {
			//初始化showPois数组
			initshowPois(){

				// this.user_id_id=uni.getStorageSync('user_id');
				console.log(1000)
				console.log(this.user_id_id)
				
				//从后端获取收藏信息初始化到showPois数组中
				try {
					console.log(this.user_id_id);
					uni.request({
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						url: 'http://47.117.160.161/wish_search/',
						method: 'POST',
						data: {
							user_id_id: this.user_id_id,
							// user_id_id:'583028',
						},
						dataType: 'json',
						success: (res) => {
							console.log(res)
							if(res.data.code==200){
								uni.showToast({
									title:"没有收藏的停车场哦",
									icon:'none',
									duration: 2000
								})
								return;
								// console.log("没有收藏!")
								// uni.showModal({
								// 	title: '提示',
								// 	content: '您还没有收藏，快来收藏停车场吧！',
								// 	showCancel: false,
								// 	success: function(res) {
								// 		if (res.confirm) {
								// 			console.log('用户点击确定');
								// 		}
								// 	}
								// });
								
							}
							else{
								this.showPois=res.data.list
								console.log(this.showPois)
								var len=this.showPois.length;
								var i;
								for(i=0;i<len;i++){
									this.showUpImg[i]=true;
								}
								//最后一列加上下标
								i=0;
								do {
									this.showPois[i].push(i);
									i = i + 1;
								} while (i != len);				
							}
						}
					});
				} catch (e) {
					console.log('init showPois error!')
				};	
			},
			
			//点击取消收藏or收藏图标
			changeImg(poi) {
				
	            try {
					if (this.showUpImg[poi[3]] == true) {
						//取消收藏，接后端
						uni.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							url: 'http://47.117.160.161/delete_wish/',
							method: 'POST',
							data: {
								parkingLot: poi[0],
								user_id_id: this.user_id_id,
								// user_id_id:'001',
								lat:poi[1],
								lng:poi[2],
							},
							dataType: 'json',
							success: (res) => {
								uni.showModal({
									title: '提示',
									content: '取消收藏成功！',
									showCancel:false,
									success: function (res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
						    }
	                    });
						this.showUpImg[poi[3]]=false;
						this.$forceUpdate()
					}
					else {
						//添加收藏，接后端
						uni.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							url: 'http://47.117.160.161/add_wish/',
							method: 'POST',
							data: {
								parkingLot: poi[0],
								// user_id_id:'001',
								user_id_id: this.user_id_id,
								lat:poi[1],
								lng:poi[2],
							},
							dataType: 'json',
							success: (res) => {
		                        uni.showModal({
		                        	title: '提示',
		                        	content: '收藏成功！',
		                        	showCancel:false,
		                        	success: function (res) {
		                        		if (res.confirm) {
		                        			console.log('用户点击确定');
		                        		}
		                        	}
		                        });
							}
						});
						this.showUpImg[poi[3]]=true;
						this.$forceUpdate()
					}
				} catch (e) {
					console.log('delete or add wish error!')
				};
			},


			// 这里传入的三个参数分别是  要去的  经度 纬度 以及 地址信息
			//注意这个只从当前所在地出发
			viewMapLocation(lat,lng, address) {

				var longitude = lng;
				var latitude = lat;

				// 获取定位信息
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					// 用户允许获取定位
					success: function(res) {
						console.log(res, '经纬度')
						if (res.errMsg == "getLocation:ok") {
							console.log(latitude)
							console.log(longitude)
							uni.openLocation({
								// 传入你要去的纬度
								latitude: Number(latitude),
								// 传入你要去的经度
								longitude: Number(longitude),
								// 传入你要去的地址信息 不填则为空
								address: address,
								success: function() {
									console.log('success');
								},
								fail: function() {
									console.log('fail');
								}
							});
						}
					},
					// 用户拒绝获取定位后 再次点击触发
					fail: function(res) {
						console.log(res)
						if (res.errMsg == "getLocation:fail auth deny") {
							uni.showModal({
								content: '检测到您没打开获取信息功能权限，是否去设置打开？',
								confirmText: "确认",
								cancelText: '取消',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: (res) => {
												console.log('确定');
											}
										})
									} else {
										console.log('取消');
										return false;
									}
								}
							})
						}
					}
				});
			},

			//打开第三方地图
			openMap(loca, name) {
				const array = loca.split(",");

				var longitude = array[0];
				var latitude = array[1];

				let url = "";
				if (plus.os.name == "Android") {
					let hasBaiduMap = plus.runtime.isApplicationExist({
						pname: 'com.baidu.BaiduMap',
						action: 'baidumap://'
					});
					let hasAmap = plus.runtime.isApplicationExist({
						pname: 'com.autonavi.minimap',
						action: 'androidamap://'
					});
					let urlBaiduMap =
						`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`
					urlBaiduMap = encodeURI(urlBaiduMap)
					let urlAmap =
						`androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
					urlAmap = encodeURI(urlBaiduMap)
					if (hasAmap && hasBaiduMap) {
						plus.nativeUI.actionSheet({
							title: "选择地图应用",
							cancel: "取消",
							buttons: [{
								title: "百度地图"
							}, {
								title: "高德地图"
							}]
						}, function(e) {
							switch (e.index) {
								case 1:
									plus.runtime.openURL(urlBaiduMap);
									break;
								case 2:
									plus.runtime.openURL(urlAmap);
									break;
							}
						})
					} else if (hasAmap) {
						plus.runtime.openURL(urlAmap);
					} else if (hasBaiduMap) {
						plus.runtime.openURL(urlBaiduMap);
					} else {
						plus.nativeUI.alert("本机未安装指定的地图应用");
						// url = "geo:"+latitude+","+longitude+"?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82";
						// plus.runtime.openURL(url); //如果是国外应用，应该优先使用这个，会启动google地图。这个接口不能统一坐标系，进入百度地图时会有偏差  
					}
				} else {
					// iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）  
					plus.nativeUI.actionSheet({
						title: "选择地图应用",
						cancel: "取消",
						buttons: [{
							title: "Apple地图"
						}, {
							title: "百度地图"
						}, {
							title: "高德地图"
						}]
					}, function(e) {
						console.log("e.index: " + e.index);
						switch (e.index) {
							case 1:
								url =
									`http://maps.apple.com/?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82&ll=${latitude},${longitude}&spn=0.008766,0.019441`;
								break;
							case 2:
								url =
									`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
								break;
							case 3:
								url =
									`iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
								break;
							default:
								break;
						}
						if (url != "") {
							url = encodeURI(url)
							plus.runtime.openURL(url, function(e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				}
			},

		}
	}
</script>

<style lang="less">
	// page{
	// 	background:rgba(255,255,255,1);
	// 	box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
	// 	background-image:
	// 		radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
	// 		radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
	// 		radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
	// 		radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
	// 		background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; 
	// 		background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
	// }
	.container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		margin: 0 auto;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
		
		
		.item{
			margin-top: 30rpx;
			display: flex;
			width: 90%;
			height: 170rpx;
			background-color:white;
			border-radius: 35rpx; 
			box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
			
			align-items: center;
			flex-direction: row;
			
			.pic{
				width: 90rpx;
				height: 90rpx;
				margin-left: 45rpx;
			}
				
			.name{
				width: 400rpx;
				margin-left: 30rpx;
				color: black;
				font-size: 35rpx;
				line-height: 60rpx;
			}
			
			.icon{
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 50rpx;
				height: 120rpx;
				margin-left: 40rpx;
				
				.wish{
					width: 42rpx;
					height: 50rpx;
				}
					
				.loc{
					margin-top: 30rpx;
					width: 42rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
