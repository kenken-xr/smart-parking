<script>
	export default {
		// globalData: {
		// 	notificationMsgSocket:new WebSocket('ws://47.117.160.161/ws/car/licenseNum'),
		// },  
		onLaunch: function() {
			console.log('App Launch')
			
			getApp().globalData.notificationMsgSocket.onmessage = function(e) { 
				var data = JSON.parse(e.data); 
				var message = data['data']; 
				var plc = data.data
				console.log(plc)
				if(plc == 'detected'){
					// uni.navigateTo({
					// 	url:"../mapTest/mapTest?type=entrance"
					// })
				}
			};
			getApp().globalData.notificationMsgSocket.onclose = function(e) {
				console.warn('Notification socket closed unexpectedly')
			};
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>

	/*每个页面公共css */
</style>
