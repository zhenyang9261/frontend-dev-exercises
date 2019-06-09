<template>
  <div class="chart">
    <svg
      :heigh='this.svgHeight'
      :width='this.svgWidth'
    >
      <g transform="translate(150,30)" />
      {{output}}
    </svg>
    
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Chart',
  props: {
    jsonData: Array
  },
  data() {
    return {
      svgHeight: 960,
      svgWidth: 500,
      /*chartMargin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 150
      },*/
      chartWidth: 780,
        //this.svgWidth - this.chartMargin.left - this.chartMargin.right,
      chartHeight: 440
        //this.svgHeight - this.chartMargin.top - this.chartMargin.bottom
    }
  },
  created() {
    this.z = d3.scaleOrdinal()
            .range(["#A9BCF5", "#F79F81"]);
  },
  methods: {
    eduChart() {
      console.log(this.eduData);
    },
    sortData (data) {

      // First create the array of keys/over_50k so that we can sort it:
      var sort_array = [];
      for (var key in data) {
        sort_array.push({key:key,value:data[key].value.over_50k});
      }

      // Now sort it:
      sort_array = sort_array.sort(function(x,y){return  x.value - y.value});

      // Now compose the result array:
      var sorted_data = [];
      for (var i=0;i<sort_array.length;i++) {
        var item = data[sort_array[i].key];
        sorted_data.push(item);
      }
      return sorted_data;
    }
  },
  computed: {
    eduData() {
      
      var result_data = d3.nest()
      .key(d => d.education_level)
      .rollup(education_levels => {
        var obj = {};
        var totalCount = d3.sum(education_levels, d => d.count);

        d3.nest()
          .key(d => d.over_50k_text)
          .rollup(salary_50k => {
            var groupCount = d3.sum(salary_50k, d => d.count);

            obj['over_50k'] = Math.round(groupCount/totalCount * 100);
          
            obj['under_50k'] = 100 - obj['over_50k'];
          }).entries(education_levels.filter(function(d) { return d.over_50k_text === 'True'; }));

        obj['education_level'] = education_levels[0].education_level;
        obj['total'] = obj['under_50k'] + obj['over_50k'];
        
        return obj
      })
      .entries(this.jsonData);
      var sorted = this.sortData(result_data);
      return sorted;
    },
    output() {
      return this.eduChart();
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
