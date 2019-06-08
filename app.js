// Define SVG area dimensions

var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 150
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from census.csv
d3.csv("census.csv", function(error, data) {
  if (error) throw error;

  //console.log(data[0]);

  data.forEach(function(d) {
    d.count = +d.count;
  });

  // Compose dataset
  const nest = d3.nest()
  .key(d => d.education_level)
  .rollup(education_levels => {
    var obj = {};
    var totalCount = d3.sum(education_levels, d => d.count);
     
    d3.nest()
      .key(d => d.over_50k_text)
      .rollup(salary_50k => {
        var groupCount = d3.sum(salary_50k, d => d.count);

        //console.log(salary_50k)
        obj['over_50k'] = Math.round(groupCount/totalCount * 100);
      
        obj['under_50k'] = 100 - obj['over_50k'];
      }).entries(education_levels.filter(function(d) { return d.over_50k_text === 'True'; }));

    obj['education_level'] = education_levels[0].education_level;
    obj['total'] = obj['under_50k'] + obj['over_50k'];
    
    return obj
  })
  .entries(data)

//   nest = nest.map(function (d) {
//     var sortedData = d.value.sort(function(a,b){ return d3.ascending(a.under_50k, b.under_50k); });
//     return sortedData.map(function (o, i) {         
//         return {
//             y: o.over_50k,
//             x: o.under_50k
//         };
//     });
// });


/*nest = nest.map(function (d) {
  console.log(d)
  var sortedData = d.sort(function(a,b){ return d3.ascending(a.over_50k, b.over_50k); });
  //console.log(sortedData)
  return sortedData.map(function (o, i) {
      return {
          y: o.act_effort,
          x: o.number
      };
  }); 
}); */

//nest = nest.sort(function(a,b) {
//  return a.value.over_50k - b.value.over_50k; });

// First create the array of keys/net_total so that we can sort it:
// var sort_array = [];
// for (var key in nest) {
//     sort_array.push({key:key,value:nest[key].over_50k});
// }
// 
// // Now sort it:
// sort_array.sort(function(x,y){return x.over_50k - y.over});
// 
// // Now process that object with it:
// for (var i=0;i<sort_array.length;i++) {
//     var item = nest[sort_array[i].key];
// 
//     
// }

console.log(nest);
const x = d3.scaleLinear()
  .domain([0, d3.max(nest, d => d.value.total)])
  .range([1, chartWidth]).nice()

const y = d3.scaleBand()
  .domain(nest.map(d => d.key))
  .range([chartHeight, 0])
  .padding(0.1)

var z = d3.scaleOrdinal()
  .range(["#A9BCF5", "#F79F81"]);

chartGroup.append('g')
  .attr('class', 'axis x-axis')
  .attr('transform', `translate(0, ${chartHeight})`)
  .call(d3.axisBottom(x).tickFormat(function(d) { return d + "%"; })); // tickFormat(function(d) { return "Year" + d; }));

chartGroup.append('g')
  .attr('class', 'axis y-axis')
  .call(d3.axisLeft(y).ticks(null, 's'))

  // Create group for  x- axis labels
  var labelX = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    labelX.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("dx", "0.9em")
    .attr("value", "count") // value to grab for event listener
    .classed("active", true)
    .text("count");

 // Create group for  2 y- axis labels
 var labelsYGroup = chartGroup.append("g")
 .attr("transform", `translate(${0-chartMargin.left/4*3}, ${chartHeight/2})`);

var educationLabel = labelsYGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0)
 .attr("x", 0)
 .attr("dy", "0.9em")
 .attr("value", "education_level") // value to grab for event listener
 .classed("active", true)
 .text("Education Level");

chartGroup.append('g')
    .selectAll('g')
  .data(d3.stack().keys(['under_50k', 'over_50k'])(nest.map(d => d.value)))
    
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
  .data(d => d)
    .enter().append("rect")
    .attr('x', d => x(d[0]))
    .attr('y', d => y(d.data.education_level))
    .attr('height', y.bandwidth()/5*4)
    .attr('width', d => (x(d[1]) - x(d[0])))
    .order(d3.stackOrderDescending)

    // Add legend
  var options = ["True", "False"];
    var legend = svg.selectAll(".legend")
                    .data(options.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d,i) { return "translate(" + i%2 * 60 + 
                      "," +
                      Math.floor(i/2) * 20 + ")"; })
                    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
          .attr("x", chartWidth - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", z);

    legend.append("text")
          .attr("x", chartWidth - 24)
          .attr("y", 9)
          .attr("dy", ".6em")
          .style("text-anchor", "end")
          .text(function(d) { return d;});





});

