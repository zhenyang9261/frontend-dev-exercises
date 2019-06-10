<template>
  <div class="chart">
    
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
      svgHeight: 600,
      svgWidth: 960,
      chartMargin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 140
      },
      chartWidth: 790,
      chartHeight: 540
    }
  },

  methods: {
    // Draw Education chart
    eduChart() {
      
      // Color of the bars
      var z = d3.scaleOrdinal()
            .range(["lightblue", "#F79F81"]);

      // Defind the canvas
      var svg_edu = d3.select(".chart")
        .append("svg")
        .attr("height", this.svgHeight)
        .attr("width", this.svgWidth);

      // Define the chart group
      var chartGroup = svg_edu.append("g")
      .attr("transform", `translate(${this.chartMargin.left}, ${this.chartMargin.top})`);

      // Define x axis scale
      const x = d3.scaleLinear()
        .domain([0, d3.max(this.eduData, d => d.value.total)])
        .range([1, this.chartWidth]).nice()

      // Define y axis scale
      const y = d3.scaleBand()
        .domain(this.eduData.map(d => d.key))
        .range([this.chartHeight, 0])
        .padding(0.1)

      // Attach x axis
      chartGroup.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${this.chartHeight})`)
        .call(d3.axisBottom(x).tickFormat(function(d) { return d + "%"; })); 

      // Attach y axis
      chartGroup.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(y).ticks(null, 's'))

      // Create x- axis labels
      var labelX = chartGroup.append("g")
          .attr("transform", `translate(${this.chartWidth / 2}, ${this.chartHeight + 20})`);

      // Attach x axis
      labelX.append("text")
          .attr("x", 0)
          .attr("y", 10)
          .attr("dx", "0.9em")
          .attr("value", "count") // value to grab for event listener
          .classed("active", true)
          .text("count");

      // Create y- axis labels
      var labelsYGroup = chartGroup.append("g")
       .attr("transform", `translate(${0-this.chartMargin.left/4*3}, ${this.chartHeight/2})`);

      labelsYGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0)
       .attr("dy", "0.9em")
       .attr("value", "education_level") // value to grab for event listener
       .classed("active", true)
       .text("Education Level");

      // Draw chart
      chartGroup.append('g')
          .selectAll('g')
        .data(d3.stack().keys(['over_50k', 'under_50k'])(this.eduData.map(d => d.value)))

          .enter().append("g")
          .attr("fill", function(d) { return z(d.key); })
          .selectAll("rect")
        .data(d => d)
          .enter().append("rect")
          .attr('x', d => x(d[0]))
          .attr('y', d => y(d.data.education_level))
          .attr('height', y.bandwidth())
          .attr('width', d => (x(d[1]) - x(d[0])))

          this.addLegend(svg_edu);

    },

    // Add Legend to the chart
    addLegend(svg) {
      var z = d3.scaleOrdinal()
            .range(["#A9BCF5", "#F79F81"]);
      var options = ["True", "False"];
      var legend = svg.selectAll(".legend")
                      .data(options.slice())
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d,i) { return "translate(" + i%2 * 60 + 
                        "," + Math.floor(i/2) * 20 + ")"; })

      legend.append("rect")
            .attr("x", this.chartWidth - 18)
            .attr("width", 10)
            .attr("height", 14)
            .style("fill", z);

      legend.append("text")
            .attr("x", this.chartWidth - 24)
            .attr("y", 6)
            .attr("dy", ".6em")
            .style("text-anchor", "end")
            .text(function(d) { return d;});
    },

    // Sort given data 
    // Data is in the format of array-dictionary of dictionary
    // [{key: '', value: {x: '', y: '', z}}]
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
          }).entries(education_levels.filter(function(d) { return d.over_50k === 1; }));

        obj['education_level'] = education_levels[0].education_level;
        obj['total'] = obj['under_50k'] + obj['over_50k'];
        
        return obj
      })
      .entries(this.jsonData);
      var sorted = this.sortData(result_data);
      return sorted;
    }
  },
  mounted() {
   
    // Load the Education chart
    this.eduChart();
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
