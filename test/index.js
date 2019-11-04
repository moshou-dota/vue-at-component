import Vue from 'vue'
import App from './view/App.vue'
import AtComponent from '../src'

Vue.use(AtComponent)

new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
})