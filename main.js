import Vue from 'vue'
import App from './App'
import HttpRequest from './common/httpRequest'
import queue from './common/queue'
import getCode from './components/get-code'


import { myRequest } from './common/http.js'
Vue.prototype.$myRequest = myRequest

// import { getStorage } from './common/getStorage.js'
// Vue.prototype.$getStorage = getStorage


Vue.config.productionTip = false

Vue.component('getCode', getCode);
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

