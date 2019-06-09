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

// Select div for different chart, append SVG area to it, and set the dimensions
var svg_edu = d3.select("#education_level")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var svg_race = d3.select("#race")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup;
var z = d3.scaleOrdinal()
  .range(["#A9BCF5", "#F79F81"]);

function init(type) {

  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  if (type === "edu") {
    chartGroup = svg_edu.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  } else {
    chartGroup = svg_race.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  }
}

// Sort the data to display the bars in a sorted order
function sortData (data) {

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

// Draw Education Level chart
function drawEdu (data) {

  chartGroup = svg_edu.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Define x axis scale
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value.total)])
    .range([1, chartWidth]).nice()

  // Define y axis scale
  const y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([chartHeight, 0])
    .padding(0.1)

  // Attach x axis
  chartGroup.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(x).tickFormat(function(d) { return d + "%"; })); 

  // Attach y axis
  chartGroup.append('g')
    .attr('class', 'axis y-axis')
    .call(d3.axisLeft(y).ticks(null, 's'))

  // Create x- axis labels
  var labelX = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
  
  labelX.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("dx", "0.9em")
    .attr("value", "count") // value to grab for event listener
    .classed("active", true)
    .text("count");

  // Create y- axis labels
  var labelsYGroup = chartGroup.append("g")
   .attr("transform", `translate(${0-chartMargin.left/4*3}, ${chartHeight/2})`);

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
    .data(d3.stack().keys(['over_50k', 'under_50k'])(data.map(d => d.value)))

      .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
    .data(d => d)
      .enter().append("rect")
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d.data.education_level))
      .attr('height', y.bandwidth())
      .attr('width', d => (x(d[1]) - x(d[0])))
}

function drawRace (data) {

  chartGroup = svg_race.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Define x axis scale
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value.total)])
    .range([1, chartWidth]).nice()

  // Define y axis scale
  const y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([chartHeight, 0])
    .padding(0.1)

  // Attach x axis
  chartGroup.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(x).tickFormat(function(d) { return d + "%"; })); 

  // Attach y axis
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
    .data(d3.stack().keys(['over_50k', 'under_50k'])(data.map(d => d.value)))

      .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
    .data(d => d)
      .enter().append("rect")
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d.data.race))
      .attr('height', y.bandwidth())
      .attr('width', d => (x(d[1]) - x(d[0])))
}

// Add legend
function addLegend(svg) {
  var options = ["True", "False"];
  var legend = svg.selectAll(".legend")
                  .data(options.slice())
                  .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d,i) { return "translate(" + i%2 * 60 + 
                    "," + Math.floor(i/2) * 20 + ")"; })

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
}

// Read the data from csv and call other functions to draw charts.
function drawChart(chart_type) {

  var result_data;

  // Load data from census.csv
  d3.csv("census.csv", function(error, data) {
    if (error) throw error;

    // Convert string to number
    data.forEach(function(d) {
      d.count = +d.count;
    });

    // Compose dataset step 1, group by education_level/race, calculate the total counts for each group
    // Compose dataset step 2, in each group, filter data by "over_50k", then calculate the total counts. 
    // The "under_50k" is calculated as 100(percent) - "over_50k"
    if (chart_type === "edu" ) {
      result_data = d3.nest()
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
      .entries(data)

      data = sortData(result_data);
      drawEdu(data);
      addLegend(svg_edu);

    } else {
      result_data = d3.nest()
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
          }).entries(races.filter(function(d) { return d.over_50k_text === 'True'; }));

        obj['race'] = races[0].race;
        obj['total'] = obj['under_50k'] + obj['over_50k'];
        
        return obj
      })
      .entries(data)
     
      data = sortData(result_data);
      drawRace(data);
      addLegend(svg_race);
    }
  });
  
}

// Build the chart of Education Level
drawChart("edu");

// Build the chart of Race
drawChart("race");
