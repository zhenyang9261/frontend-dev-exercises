<template>
  <div class="racechart">
    <div class="title">
      <h3> Race vs Percentage of Salary Over 50K </h3>
    </div>
    <div class="chart">
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'RaceChart',
  props: {
    jsonData: Array
  },

  data() {
    return {
      svgWidth: 960,
      svgHeight: 500,
      chartMargin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 140
      }
    }
  },

  methods: {
    // Draw Race chart
    raceChart() {
      
      // Color of the bars
      var z = d3.scaleOrdinal()
            .range(["lightblue", "#F79F81"]);

      // Defind the canvas
      var svg_race = d3.select(".racechart")
        .append("svg")
        .attr("height", this.svgHeight)
        .attr("width", this.svgWidth);

      // Define the chart group
      var chartGroup = svg_race.append("g")
      .attr("transform", `translate(${this.chartMargin.left}, ${this.chartMargin.top})`);

      // Define x axis scale
      const x = d3.scaleLinear()
        .domain([0, d3.max(this.raceData, d => d.value.total)])
        .range([1, this.chartWidth]).nice()

      // Define y axis scale
      const y = d3.scaleBand()
        .domain(this.raceData.map(d => d.key))
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
       .attr("value", "race") // value to grab for event listener
       .classed("active", true)
       .text("Race");

      // Draw chart
      chartGroup.append('g')
          .selectAll('g')
        .data(d3.stack().keys(['over_50k', 'under_50k'])(this.raceData.map(d => d.value)))

          .enter().append("g")
          .attr("fill", function(d) { return z(d.key); })
          .selectAll("rect")
        .data(d => d)
          .enter().append("rect")
          .attr('x', d => x(d[0]))
          .attr('y', d => y(d.data.race))
          .attr('height', y.bandwidth())
          .attr('width', d => (x(d[1]) - x(d[0])))

      // Add gridlines
      this.make_gridlines(chartGroup, x, y);

      // Add Legend
      this.addLegend(svg_race);

    },

    // Gridlines
    make_gridlines(chartGroup, x, y) {		
      // add the X gridlines
      chartGroup.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.chartHeight + ")")
      .call(d3.axisBottom(x)
          .ticks(10)
          .tickSize(-this.chartHeight)
          .tickFormat("")
      )
       // add the Y gridlines
      /*chartGroup.append("g")			
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-chartWidth)
            .tickFormat("")
        ) */
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
    chartWidth() {
      return this.svgWidth - this.chartMargin.left - this.chartMargin.right; //790,
    },
    chartHeight() {
      return this.svgHeight - this.chartMargin.top - this.chartMargin.bottom; //540
    }, 
    raceData() {
      
      // Compose dataset step 1, group by race, calculate the total count for each group
      // Compose dataset step 2, in each group, filter data by "over_50k", then calculate the total counts. 
      // "over_50k": total count in step 2 divided by total count in step 1, then round to integer
      // "under_50k": 100(percent) - "over_50k"
       var result_data = d3.nest()
      .key(d => d.race)
      .rollup(races => {
        var obj = {};
        var totalCount = d3.sum(races, d => d.count);

        d3.nest()
          .key(d => d.over_50k_text)
          .rollup(salary_50k => {
            var groupCount = d3.sum(salary_50k, d => d.count);

            obj['over_50k'] = Math.round(groupCount/totalCount * 100);
          
            obj['under_50k'] = 100 - obj['over_50k'];
          }).entries(races.filter(function(d) { return d.over_50k === 1; }));

        obj['race'] = races[0].race;
        obj['total'] = obj['under_50k'] + obj['over_50k'];
        
        return obj
      })
      .entries(this.jsonData);

      // Sort the data for display
      var sorted = this.sortData(result_data);
      return sorted;
    }
  },
  mounted() {
   
    // Load the Race chart
    this.raceChart();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 1.5em 0;
  text-align: center;
  font-weight: bold;
}
</style>
