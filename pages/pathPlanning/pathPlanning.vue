<!-- 这个是把路线画出来 -->
<!-- 有一点小bug，出发点和那个之间有间距，还有一个问题是没有办法显示到中间 -->
<template>
	<view>
		<view class="map_box">
			<map id="navi_map"  :latitude="latitude" 
				:longitude="longitude" scale="16" :markers="markers" :polyline="polyline"
				:show-compass="true" 
				:show-location="true">
			</map>
		</view>
		
		<view class="text_box">
		  <view class="text">{{distance}}</view>
		  <view class="text">{{cost}}</view>
		  <view class="detail_button" bindtouchstart="goDetail">详情</view>
		</view>
	</view>
</template>

<script>
	// import pathPlanning from '@/common/path-planning.js';
	//var pathPlanning = require('@/common/path-planning.js');//require这个js模块  
	import amap from '@/common/amap-wx.130.js';//require这个js模块  
	export default {
		data() {
			return {
				// 地图实例
				amapPlugin:null,
				// 小程序高德地图key
				key: '986e3e528e41c7db57356cc78a3727a9',
				// 图标点数据
				markers: [{
				  iconPath: "'../../static/imgs/1.png'",
				  id: 0,
				  // latitude: 39.989643,
				  // longitude: 116.481028,
				  latitude: '',
				  longitude: '',
				  width: 23,
				  height: 33
				},{
				  iconPath: "'../../static/imgs/1.png'",
				  id: 0,
				  // latitude:39.90816,
				  // longitude: 116.434446,
				  latitude:'',
				  longitude: '',
				  width: 24,
				  height: 34
				}],
				// 中心点
				latitude: '',
				longitude: '',
					
				distance: '',
				cost: '',
				// 地图轨迹数据
				polyline:[],	
			}
		},
		
		onLoad(options) {
			this._initMap();
			let that = this;
			this.amapPlugin = new amap.AMapWX({
				key:this.key
			})
			// var that = this
			that.getMyLocation();
			this.amapPlugin.getPoiAround({
			      success: function(data){
			        //成功回调
			      },
			      fail: function(info){
			        //失败回调
			        console.log(info)
			      }
			    })

			// console.log(options.address1_longitude)
			// address1_longitude='+res.longitude+'&address1_latitude='
			// +res.latitude+'&address2_longitude='+longitude+'&address2_latitude='
			this.markers[0].latitude=options.address1_latitude;
			this.markers[0].longitude=options.address1_longitude;
			this.markers[1].latitude=options.address2_latitude;
			this.markers[1].longitude=options.address2_longitude;
			this.latitude=(	this.markers[0].latitude+this.markers[1].latitude)/2;
			this.longitude=(this.markers[0].longitude+this.markers[1].longitude)/2;
		
			// var markerPosition = [this.longitude, this.latitude];
			// this.amapPlugin.panTo(markerPosition); 
			// console.log(this.markers[0].latitude)
			
			// this.amapPlugin.setPointToCenter(this.longitude,this.latitude);
			
			// 静态死数据
			this.amapPlugin.getDrivingRoute({
		      // origin: '116.481028,39.989643',
		      // destination: '116.434446,39.90816',
			  origin: this.markers[0].longitude+','+this.markers[0].latitude ,
			
			  destination:  this.markers[1].longitude+','+this.markers[1].latitude ,
			  
			  // console.log(origin)
		      success: function(data){
		        var points = [];
				// points.push({origin});
		        // 通过一个点一个点生成地图轨迹数据
				//有一点小bug，出发点和那个之间有间距，还有一个问题是没有办法显示到中间
		        if(data.paths && data.paths[0] && data.paths[0].steps){
		          var steps = data.paths[0].steps;
		          for(var i = 0; i < steps.length; i++){
		            var poLen = steps[i].polyline.split(';');
		            for(var j = 0;j < poLen.length; j++){
		              points.push({
		                longitude: parseFloat(poLen[j].split(',')[0]),
		                latitude: parseFloat(poLen[j].split(',')[1])
		              })
		            } 
		          }
		        };
				
				that.polyline=[{
					points: points,   //地图轨迹数据
					color: "#0000ff",   //轨迹颜色
					width: 18 //线条宽度
				}]  
				
				if(data.paths[0] && data.paths[0].distance){
					that.setData({
						distance: data.paths[0].distance + '米'
					});
				}
				if(data.taxi_cost){
					that.setData({
						cost: '打车约' + parseInt(data.taxi_cost) + '元'
					});
				}
		      },
		      fail: function(info){
		
		      }
		    })
		},

		methods: {
			// goDetail(){
			//   uni.navigateTo({
			//     url: '../navigation_car_detail/navigation'
			//   })
			// },
			// 初始化地图，
			_initMap(){
				let _this = this;
				// #ifdef APP-PLUS
				uni.getLocation({
				    type: 'gcj02',
					geocode:true,
				    success: function (res) {
						console.log(JSON.stringify(res))
						// _this.latitude = res.latitude;
						// _this.longitude = res.longitude;
						let market = {
							id: 0,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../static/imgs/1.png',
							title: res.address.poiName,
							callout: {
								content: res.address.poiName,
								color: '#ffffff',
								fontSize: '14',
								display: 'ALWAYS',
								bgColor: '#FF6F1E',
								padding: '10',
								textAlign: 'center',
								borderRadius: '15'
							},
						}
						// let market = {
						// 		id: 1,
						// 		latitude: this.markers[1].latitude,
						// 		longitude: this.markers[1].longitude,
						// 		iconPath: '../../static/imgs/1.png',
						// 		title: res.address.poiName,
						// 		callout: {
						// 			content: res.address.poiName,
						// 			color: '#ffffff',
						// 			fontSize: '14',
						// 			display: 'ALWAYS',
						// 			bgColor: '#FF6F1E',
						// 			padding: '10',
						// 			textAlign: 'center',
						// 			borderRadius: '15'
						// 		}
						// }
						_this.markers[0] = market;
						_this.address1 = market;
						_this.markers = [..._this.markers];
						_this.includePoints[0] = market;
				    },
					fail:function(err) {
						console.log(err)
					},
				});
				// #endif
			},
			// 获取地理位置
			getMyLocation() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						this.markers[0].latitude = res.latitude;
						this.markers[0].longitude = res.longitude;
						console.log('myLatitude为' + this.markers[0].latitude);
						console.log('myLongitude为' + this.markers[0].longitude);
					},
					fail: function(e) {
						console.log(e);
					}
				});	
			},
			
			
			
		
		},
		
	}
</script>

<style>
.map_box{
  position:absolute;
  top: 35px;
  bottom: 90px;
  left: 0px;
  right: 0px;
}
#navi_map{
  width: 100%;
  height: 100%;
}
.text_box{
  position:absolute;
  height: 90px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.text_box .text{
  margin: 15px;
}
.detail_button{
  position:absolute;
  bottom: 30px;
  right: 10px;
  padding: 3px 5px;
  color: #fff;
  background: #0091ff;
  width:50px;
  text-align:center;
  border-radius:5px;
}
</style>
