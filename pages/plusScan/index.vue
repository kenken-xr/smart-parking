<!-- 扫一扫要调用的，需要用到 -->
<template>
</template>
<script>
	var barcode = null;
	export default {
		data() {
			return {
				name: '', //要在扫码界面自定义的内容
				flash: false, //是否打开摄像头
				type: '',
				value:'',
                result:'',
			};
		},
		onLoad(d) {
			var n = d.text;
			this.type = d.type;
			console.log(this.type,'type');
			// if (n) {
			// 	this.name = n;
			// }
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true); //全屏
			var currentWebview = page.$getAppWebview();
			this.createBarcode(currentWebview); //创建二维码窗口
			this.createView(currentWebview); //创建操作按钮及tips界面
			// #endif
		},
		
		methods: {
			// 扫码成功回调
			onmarked(type, result) {
				var text = '未知: ';
				switch (type) {
					// QR: QR二维码，数值为0
					case plus.barcode.QR:
						text = 'QR: ';
						break;
					// EAN13: EAN条形码标准版，数值为1
					case plus.barcode.EAN13:
						text = 'EAN13: ';
						break;
					// EAN8: ENA条形码简版，数值为2
					case plus.barcode.EAN8:
						text = 'EAN8: ';
						break;
				}
				plus.navigator.setFullscreen(false);
				
				
				//兄弟传参
				// this.$eventHub.$emit(this.type, {
				// 	result: result
				// });				
				
				uni.$emit(this.type, {
					result: result
				})
				this.result=result.split(",");
				
				
				console.log(this.type,result,'this.type');
				//返回上一次调用的页面
				// uni.navigateBack({
				// 	delta: 1,
				// });
				
				//只是大概完成，未进行测试
				//获取缓存中的license_number
				try{
					var license_number;
					license_number=uni.getStorageSync('license_number');
					console.log(44444)
					console.log(license_number)
					
					//获取缓存中的license_number
					// uni.getStorage({
					//     key: 'license_number',
					//     success: function(res) {
					// 		license_number=res.data;
					//         console.log('get success');
					//         console.log(res.data);
					//     },
					// });
				}catch (e) {
					console.log('init license_number error!')
					// error
				};
				
				//先判断缓存中的begin_time是否为空，如果为空就插入未离表，如果不为空就插入已离表
				try {
				    var res = uni.getStorageInfoSync()
					// console.log(res)
				    this.value = res.keys.includes('begin_time')
					//上面的这种方式好像没有什么效果，res里面有begin_time
					var begin_time;
					begin_time=uni.getStorageSync('begin_time');
					console.log(begin_time)
					console.log(begin_time=="")
					// console.log(111111)
					// console.log(this.value)
			    } catch (e) {
				    console.log(e)
				};
				if(begin_time==""){
					//进入
					try{
						uni.request({
							header:{
								 'Content-Type': 'application/x-www-form-urlencoded' 
							},
							url:'http://47.117.160.161/scan_in/',
							method:'POST',
							data:{
								//type保存的是二维码中携带的信息
								parkingLot:this.result[0],
								// parkingLot:'群光广场',
								floor:this.result[1],
								// floor:'A1',
								parkPosition:this.result[2],
								// parkPosition:'002',
								license_number_id:license_number,
								// license_number_id:'鄂A12346',
							},
							dataType:'json',
						    success: (res) => {
								// var result = JSON.parse(res.data.projectList);
								console.log(res)
								console.log(this.result[0])
								console.log(res.data.begin_time)
								if(res.data.code==1){
									console.log("扫码成功!")
									//将begin_time存入缓存
									uni.setStorage({
										key:"begin_time",
										data:res.data.begin_time,
										success: function() {
										    console.log('success store begin_time');
										}
									});
								}
                                else{
									console.log('insert error!');
								}
						    } 	
						});
					}catch (e) {
						console.log('scan_in error!')
				    };
				}else{
					//离开
					try{
						var begin_time;
						begin_time=uni.getStorageSync('begin_time');
						//获取缓存中的begin_time
						// uni.getStorage({
						//     key: 'begin_time',
						//     success: function(res) {
						// 		begin_time=res.data;
						//         console.log('get success');
						//         console.log(res.data);
						//     },
						// });
					}catch (e) {
						console.log('get begin_time error!')
						// error
					};
					try{
						uni.request({
							header:{
								 'Content-Type': 'application/x-www-form-urlencoded' 
							},
							url:'http://47.117.160.161/scan_out/',
							method:'POST',
							data:{
								//type保存的是二维码中携带的信息
								parkingLot:this.result[0],
								floor:this.result[1],
								parkPosition:this.result[2],
								license_number_id:license_number,
								begin_time:begin_time,
							},
							dataType:'json',
						    success: (res) => {
								// var result = JSON.parse(res.data.projectList);
								if(res.data.code==1){
									console.log("扫码成功!")
								}else{
									console.log("update DB error!")
								}
								uni.removeStorage({
								    key: 'begin_time',
								    success: function (res) {
								        console.log('success remove begin_time');
								    }
								});
						    } 	
						});
					}catch (e) {
						console.log('scan_out error!')
					};
				}


				// 获取用户位置
				var elev = this.result[3]
				//跳转到室内的地图，目前默认只有一个停车场，如果不同，还需要在处理
				uni.navigateTo({
						url:"../jumpto/jumpto?data="+elev,
						sucess:(res)=>{
							console.log(res)
						},
						fail:(err)=>{
							console.log(err)
						}
					});
				// uni.navigateBack({
				// 	delta: 2,
				// });
				console.log(1);
				
				barcode.close();			
			},
			// 创建二维码窗口
			createBarcode(currentWebview) {
				//自定义窗口大小
				//条码类型常量数组，默认情况支持QR、EAN13、EAN8类型。 通过此参数可设置扫码识别支持的条码类型（注意：设置支持的条码类型越多，扫描识别速度可能将会降低）
				barcode = plus.barcode.create('barcode', [plus.barcode.QR, plus.barcode.EAN13,plus.barcode.EAN8], {
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					scanbarColor: '#1DA7FF',
					position: 'static',
					frameColor: '#1DA7FF'
				});
				barcode.onmarked = this.onmarked;
				barcode.setFlash(this.flash);
				currentWebview.append(barcode);
				barcode.start();
			},
			// 创建操作按钮及tips
			createView(currentWebview) {
				// 创建返回原生按钮
				var backVew = new plus.nativeObj.View('backVew', {
						top: '0px',
						left: '0px',
						height: '40px',
						width: '100%'
					},
					[{
						tag: 'img',
						id: 'backBar',
						src: 'static/scan_image/backBar.png',
						position: {
							top: '2px',
							left: '3px',
							width: '35px',
							height: '35px'
						}
					}]);
				// 创建打开手电筒的按钮
				var scanBarVew = new plus.nativeObj.View('scanBarVew', {
						top: '60%',
						left: '40%',
						height: '10%',
						width: '20%'

					},
					[{
							tag: 'img',
							id: 'scanBar',
							src: 'static/scan_image/scanBar.png',
							position: {
								width: '28%',
								left: '36%',
								height: '30%'
							}
						},
						{
							tag: 'font',
							id: 'font',
							text: '轻触照亮',
							textStyles: {
								size: '10px',
								color: '#ffffff'
							},
							position: {
								width: '80%',
								left: '10%'
							}
						}
					]);
				// 创建展示类内容组件
				var content = new plus.nativeObj.View('content', {
						top: '0px',
						left: '0px',
						height: '100%',
						width: '100%'

					},
					[{
							tag: 'font',
							id: 'scanTitle',
							text: '扫码',
							textStyles: {
								size: '18px',
								color: '#ffffff'
							},
							position: {
								top: '0px',
								left: '0px',
								width: '100%',
								height: '40px'
							}
						},
						{
							tag: 'font',
							id: 'scanTips',
							text: this.name,
							textStyles: {
								size: '14px',
								color: '#ffffff',
								whiteSpace: 'normal'
							},
							position: {
								top: '90px',
								left: '10%',
								width: '80%',
								height: 'wrap_content'

							}
						}

					]);
				backVew.interceptTouchEvent(true);
				scanBarVew.interceptTouchEvent(true);
				currentWebview.append(content);
				currentWebview.append(scanBarVew);
				currentWebview.append(backVew);
				backVew.addEventListener("click", function(e) { //返回按钮
					uni.navigateBack({
						delta: 1
					});
					barcode.close();
					plus.navigator.setFullscreen(false);

				}, false);
				var temp = this;
				scanBarVew.addEventListener("click", function(e) { //点亮手电筒
					temp.flash = !temp.flash;
					if (temp.flash) {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/scan_image/yellow-scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: '轻触照亮',
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						]);
					} else {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/scan_image/scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: '轻触照亮',
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						])
					}
					if (barcode) {
						barcode.setFlash(temp.flash);
					}
				}, false)

			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			// 返回时退出全屏
			barcode.close();
			console.log("onBackPress");
			plus.navigator.setFullscreen(false);
			// #endif
		},
		onUnload() {
			console.log("onUnload");
			plus.navigator.setFullscreen(false);
		}


	};
</script>

<style scoped>
</style>
