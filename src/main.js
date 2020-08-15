import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import {keys} from './keys.js'


Vue.use(Buefy, {
  defaultIconPack: 'mdi'
})

Vue.prototype.$keyVars = keys;
Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
})

app.$mount('#app')