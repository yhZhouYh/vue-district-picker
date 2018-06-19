<template>
  <div id="app">
    <button @click="tt">选择</button>
    <vue-district-picker :show.sync="show" @confirm="confirm" :citydata="citydata"></vue-district-picker>
  </div>
</template>

<script>
import citydata from './assets/area.json'
// import VueDistrictPicker from './lib/vue-district-picker'
export default {
  name: 'app',
  // components: {
  //   VueDistrictPicker
  // },
  mounted(){
    console.log(citydata)
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      show: false,
      citydata
    }
  },
  methods: {
    confirm(ids, values){
      console.log(ids, values)
    },
    tt(){
      this.show = !this.show
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}



a {
  color: #42b983;
}
</style>
