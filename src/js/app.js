import Main from './components/Main.vue'
import Vue from 'vue'
import store from './store'

Vue.component('main-component', Main);

new Vue({
  el: '#app',
  template:'<main-component></main-component>',
  store: store
})