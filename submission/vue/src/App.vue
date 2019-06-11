<template>
  <div id="app">
    
    <EduChart :jsonData="JsonData" v-show="isEdu"/>
    <RaceChart :jsonData="JsonData" v-show="!isEdu"/> 
    
    <!-- Toggle between the 2 components when button is clicked --> 
    <button class='toggleButton' v-on:click="isEdu = !isEdu">Toggle Charts</button>
    
  </div>
</template>

<script>
import * as d3 from 'd3'

import EduChart from './components/EduChart.vue'
import RaceChart from './components/RaceChart.vue'
import JsonData from './census.json'

export default {
  name: 'app',
  components: {
    EduChart,
    RaceChart
  },
  data() {
    return {
      JsonData,
      isEdu: true
    }
  },
  mounted() {
   this.isEdu = true;

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

.toggleButton {

  background-color: rgba(95, 146, 54, 0.904); /* Green */
  border: none;
  color: white;
  padding: 15px 30px;
  margin-top: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5em;
}

.toggleButton:hover {
  background-color: white;
  color: rgba(95, 146, 54, 0.904); /* Green */
  cursor:pointer;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.9;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}

</style>
