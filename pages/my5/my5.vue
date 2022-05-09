<!-- 附近加油站 -->
<template>
	<view class="container">
		<!-- <view class="pois-show"  @load="getPois(1)"> -->
		<view class="pois-show" @load="getPois(1)">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-y">
				<view class="item" v-for="poi in showPois" :key="poi.id">
					<image class="icon" src="../../static/imgs/location.png" mode=""></image>
					<view class="wenzi">
						<view>
							<text class="name-style">{{poi.name}}</text>
						</view>
						<view class="all-style">
							<text class="type-style">{{poi.type.split(";")[1]?poi.type.split(";")[1]:'加油站'}}</text>
							<!-- <text class="zi-style">加油站</text> -->
							<text class="point-style">·</text>
							<text class="address-style">{{poi.address.length!=0 ? poi.address : poi.name}}</text>

						</view>
					</view>

				<!-- 	<image class="wish" src="../../static/imgs/wish.png" v-show="showUpImg[poi.index]"
						@click="changeImg(poi)" mode=""></image>
					<image class="wish" src="../../static/imgs/wish_selected.png" v-show="!showUpImg[poi.index]"
						@click="changeImg(poi)" mode=""></image> -->

					<image class="drive" @click="viewMapLocation(poi.location,poi.name)"
						src="../../static/imgs/drive.png" mode=""></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	var amap = require('@/common/amap-wx.130.js'); //require这个js模块  
    import http from '@/common/http.js';
	
	export default {
		data() {
			return {
				amapPlugin: null, //new地图
				key: '986e3e528e41c7db57356cc78a3727a9', //对应wx小程序的高德地图key
				// address: '', //详细地址
				lat: '', //纬度
				lng: '', //经度
				searchPoiType: "", //根据类型搜索poiß
				searchPoiKw: "", //根据关键词搜索poi
				searchPois: [], //存储获取的poi数据
				showPois: [], //用于显示的poi
				activeTheme: 1, //默认激活第一个主题
				poiType: {
					1: "010100|010101|010102|010103|010104|010105|010107|010108|010109|010110|010111|010112|010200|010300", //加油站关
				},
				activeLimit: 15,
				//这个长度根据需要改
				// showUpImg: [],
				showUpImg: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
				// animationData: {},

			}
		},
		onLoad() {
			this.getMyLocation();
		    this.getPois(1);

		},
		computed: {
			activeThemeStyle() {
				return "background-color:#abd8cf;color:#d2000f"
			},
		},
		onReady() {
			console.log("index onReady")
			//new实例化高德sdk
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});
			//默认初始化poi搜索的类型为停车场
			this.searchPoiType = this.poiType[this.activeTheme]
			console.log("ready here")

			//如果有下面一句话的话，会一直获取授权
			// this.getAuthorizeInfo();

		},
		// mounted() {
		// 	 this.initshowUpImg();
		// },
		//这里可以借鉴，还需要再改改
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享智慧停车场小程序',
				path: '/pages/map/map'
			}
		},

		watch: {
			//当经纬度变化时重新获取poi
			lat() {
				this.getPoiInfoAround()
			}
		},
		methods: {
			async loadData(user_id,isparkingLot,longitude,latitude){
				// console.log('here')
				const res = await this.$myRequest({
					url:'is_wish/',
					data: {
						isparkingLot: isparkingLot,
						user_id_id: user_id,
						// user_id_id:'495184',
						islat:latitude,
						islng:longitude,
					},
					methods: 'POST',
				})
				//这里只需要传入不同的接口地址就可以
				// console.log(3000)
				return res.data.code;
		    },
			
			//根据后端数据库的信息来初始化showUpImg数组，完成测试
			async initshowUpImg() {
				try {
					var user_id;
					//获取缓存中的user_id
					// uni.getStorage({
					// 	key: 'user_id',
					// 	success: function(res) {
					// 		user_id = res.data;
					// 		console.log('get success');
					// 		console.log(res.data);
					// 	},
					// });
					user_id=uni.getStorageSync('user_id');
					console.log(user_id);
					console.log(444444)
				} catch (e) {
					console.log('get user_id  error!')
				};
				try {
					var i;				
					for (i = 0; i < this.activeLimit; i++) 
					{
						// console.log(i)
						var isparkingLot = this.showPois[i].name;
						
						const array = this.showPois[i].location.split(",");
						var longitude = array[0];
						var latitude = array[1];
						// user_id='495184';
						var a  =await this.loadData(user_id,isparkingLot,longitude,latitude);
						
						// console.log(a)
						
						if (a == 1) {
							// console.log(i)
							this.showUpImg[i] = false;
							this.$forceUpdate()
						} else {
							this.showUpImg[i] = true;
							this.$forceUpdate()
						}
					};
				} catch (e) {
					console.log('initshowUpImg error!')
				};
				
				console.log(200)
				console.log(this.showUpImg)
			},

			//只是大概完成，已测试
			changeImg(poi) {
				console.log('poi',poi.type.split(";")[1])
				try {
					var user_id;
					//获取缓存中的user_id
					// console.log('mark')
					// uni.getStorage({
					// 	key: 'user_id',
					// 	success: function(res) {
					// 		user_id = res.data;
					// 		console.log('get success');
					// 		// console.log('res',res.data);
					// 	},
					// });
					user_id=uni.getStorageSync('user_id');
					
					console.log(user_id)
					console.log(2000)
				} catch (e) {
					console.log('init error!')
				};


				try {
					
					if (this.showUpImg[poi.index] == true) {
						
						const array = poi.location.split(",");
						var longitude = array[0];
						var latitude = array[1];
	
						//添加收藏，接后端
						uni.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							url: 'http://47.117.160.161/add_wish/',
							method: 'POST',
							data: {
								parkingLot: poi.name,
								user_id_id: user_id,
								// user_id_id:'495184',
								lat:latitude,
								lng:longitude,
							},
							dataType: 'json',
							success: (res) => {
								console.log(poi.name)
								console.log(user_id)
								console.log(latitude)
								console.log(longitude)
								// var result = JSON.parse(res.data.projectList);
								// console.log(200)
								console.log(res)
								uni.showModal({
									title: '提示',
									content: '收藏成功！',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
							}
						});
						// uni.showToast({
						// 	title:"收藏成功！"
						// })
						// uni.showModal({
						// 	title: '提示',
						// 	content: '收藏成功！',
						// 	showCancel: false,
						// 	success: function(res) {
						// 		if (res.confirm) {
						// 			console.log('用户点击确定');
						// 		}
						// 	}
						// });
					} else {
						const array = poi.location.split(",");
						
						var longitude = array[0];
						var latitude = array[1];
						
						//取消收藏，接后端
						uni.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							url: 'http://47.117.160.161/delete_wish/',
							method: 'POST',
							data: {
								parkingLot: poi.name,
								// user_id_id:'495184',
								user_id_id: user_id,
								lat:latitude,
								lng:longitude,
							},
							dataType: 'json',
							success: (res) => {
								uni.showModal({
									title: '提示',
									content: '取消收藏成功！',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
								// var result = JSON.parse(res.data.projectList);
							}
						});
						// uni.showToast({
						// 	title:"取消收藏成功！"
						// })
						// uni.showModal({
						// 	title: '提示',
						// 	content: '取消收藏成功！',
						// 	showCancel: false,
						// 	success: function(res) {
						// 		if (res.confirm) {
						// 			console.log('用户点击确定');
						// 		}
						// 	}
						// });
					}
				} catch (e) {
					console.log('add_or_delete__wish_back error!')
					// error
				};

				this.showUpImg[poi.index] = !this.showUpImg[poi.index];
				this.$forceUpdate()
			},


			//授权获取地理位置信息
			/*
			// getAuthorizeInfo() {
			// 	uni.authorize({
			// 		scope: 'scope.userLocation',
			// 		success: () => { // 允许授权
			// 			// this.getLocationInfo();
			// 			this.getMyLocation();
			// 		},
			// 		fail: () => { // 拒绝授权
			// 			this.openConfirm();
			// 			console.log("你拒绝了授权，无法获得周边信息")
			// 		}
			// 	})
			// },
			*/

			// 获取地理位置
			getMyLocation() {
				let that = this;
				console.log('getting location')
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						that.lat = res.latitude;
						that.lng = res.longitude;
						//that.address = res.regeocodeData.formatted_address;
						//that.address=res.address;

						console.log('myLatitude为' + that.myLatitude);
						console.log('myLongitude为' + that.myLongitude);
					},
					fail: function(e) {
						console.log(e);
					}
				});
			},

			//获取周边poi数据
			getPoiInfoAround() {
				// console.log(1)
				uni.showLoading({
					title: '加载中'
				});
				let loc = this.lat + "," + this.lng
				this.amapPlugin.getPoiAround({
					"location": loc,
					"querytypes": this.searchPoiType,
					"querykeywords": this.searchPoiKw,
					success: (data) => {
						//成功回调
						this.searchPois = data.poisData
						this.setShowPois()
						uni.hideLoading();
						// console.log("poi", this.searchPois)
					},
					fail: (info) => {
						//失败回调
						console.log(info)
						uni.hideLoading();
						// uni.showToast({
						// 	title: '无法获得周边信息,您可以手动添加内容',
						// 	icon: 'none',
						// 	duration: 2000
						// })
					}
				});
			},
			// 再次获取授权
			// 当用户第一次拒绝后再次请求授权
			/*
			// openConfirm() {
			// 	uni.showModal({
			// 		title: '请求授权当前位置',
			// 		content: '需要获取您的地理位置，请确认授权',
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				uni.openSetting(); // 打开地图权限设置
			// 			} else if (res.cancel) {
			// 				uni.showToast({
			// 					title: '你拒绝了授权，无法获得周边信息',
			// 					icon: 'none',
			// 					duration: 2000
			// 				})
			// 			}
			// 		}
			// 	});
			// },
			*/

			getPois(index) {
				this.activeTheme = index
				this.searchPoiType = this.poiType[this.activeTheme]
				// console.log(111111111)
				// uni.showLoading({
				// 	title: '加载中'
				// });
				setTimeout(function() {
					uni.hideLoading();
				}, 100);
				this.getPoiInfoAround()
			},

			setShowPois() {
				this.showPois = this.searchPois.slice(0, this.activeLimit);
				// console.log(this.showPois)
				// console.log(typeof(this.showPois[0]))
				var i = 0;
				do {
					// var showUpImg=true;
					var index = "index";
					this.showPois[i][index] = i;
					i = i + 1;
				} while (i != this.activeLimit);
				console.log(1000)
				console.log(this.showPois)
				this.initshowUpImg();
			},


			// 这里传入的三个参数分别是  要去的  经度 纬度 以及 地址信息
			//注意这个只从当前所在地出发
			// viewMapLocation(longitude , latitude , address) {
			viewMapLocation(location, address) {
				const array = location.split(",");

				var longitude = array[0];
				var latitude = array[1];

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
	.container {
		height: 100vh;
		width: 100vw;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		opacity: 0.9;
		border-radius: 10rpx 10rpx 0px 0px;

		.pois-show {
			//这里可以根据导航栏的宽度来确定,后续可以在修改
			height: 100%;
			width: 100%;
			background-size: 100% 100%;
			margin-top: 0upx;
			// box-shadow: #d0d0d0 1px 1px 10px 0px;
			// padding: 20upx 30upx;

			.scroll-y {
				height: 100%;
				width: 100%;
				margin-top: 0upx;
				padding: 5upx 0 5upx 0;
				// border-bottom: 1upx solid #d2000f;
				// border-top: 1upx solid #d2000f;


				.item {
					height: 130upx;
					line-height: 50upx;
					// margin: 2upx 30upx;
					border: 1upx solid #ffffff;
					// border-bottom-color: #b8c2cc;
					border-bottom-color: #E5E5E5;
					border-radius: 1upx;
					margin-left: 15px;
					width: 90%;
					font-size: 30upx;
					text-align: left;
					display: flex;
					flex-direction: row;
					// justify-content: center;
					align-items: center;
					// float:left;
					// color: #4d4dff;
					color: #000000;
					font-weight: bolder;
					font-family: "Times New Roman";

					background-color: #ffffff;
					opacity: 0.8;

					.icon {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
						display: flex;
					}

					.wenzi {
						width: 80%;
						margin-left: 3px;
						margin-right: 3px;
						overflow: hidden;

						.name-style {
							// width: 70%;
							overflow: hidden;
							width: 80%;
							//显示省略符号来代表被修剪的文本。
							text-overflow: ellipsis;
							//文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
							white-space: nowrap;
						}

						.all-style {
							white-space: nowrap;
							overflow: hidden;

							.type-style {
								overflow: hidden;
								font-size: 25upx;
								font-weight: normal;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							// .zi-style {
							// 	overflow: hidden;
							// 	font-size: 25upx;
							// 	font-weight: normal;
							// 	text-overflow: ellipsis;
							// 	white-space: nowrap;
							// }

							.point-style {
								overflow: hidden;
								font-size: 25upx;
								font-weight: normal;
								text-overflow: ellipsis;
								white-space: nowrap;
								margin-left: 3px;
								margin-right: 5px;
							}

							.address-style {
								overflow: hidden;
								font-size: 25upx;
								font-weight: normal;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

						}

					}

					.wish {
						width: 40rpx;
						height: 40rpx;
						margin-left: 10rpx;
						float: right;
						margin-right: 20rpx;
					}

					.drive {
						width: 40rpx;
						height: 40rpx;
						margin-left: 10rpx;
						float: right;
						margin-right: 20rpx;
					}
				}
			}
		}
	}
</style>
