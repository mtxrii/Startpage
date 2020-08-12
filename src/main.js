import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
})

app.$mount('#app')
