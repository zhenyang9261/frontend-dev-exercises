<template>
  <div id="app">
    <Chart :jsonData="JsonData"/>
    <SwitchButton />
  </div>
</template>

<script>
import Chart from './components/Chart.vue'
import SwitchButton from './components/SwitchButton.vue'
import * as d3 from 'd3'
import JsonData from './census.json'

export default {
  name: 'app',
  components: {
    Chart,
    SwitchButton
  },
  data() {
    return {
      //census_data: []
      JsonData
    }
  },
  mounted: function() {
    /*fetch('./test.json', {
      method: 'get'
    })
    //d3.csv('./census.csv')
    .then((response) => {
      console.log(response.json())
      return response
    })
    .then((csvData) => {
      this.census_data = csvData
    }) */
    //this.fetchData()

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
</style>
