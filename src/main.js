import Vue from 'vue'
import App from './App.vue'
import VueDistrictPicker from './vue-district-picker'

Vue.use(VueDistrictPicker)

new Vue({
  el: '#app',
  render: h => h(App)
})
