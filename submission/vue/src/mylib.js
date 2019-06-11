/** 
 * Library file that contains functions used across components
 */
import * as d3 from 'd3';

var utilFunc = {

    /* Sort given data 
     * Data is in the format of array of dictionary of dictionaries
     * [{key: '', value: {x: '', y: '', z: ''...}}] 
     * Sort the data by a key (eg. x) in the nested dictionary
     */
    sortData (data) {

        // First create the array of key(key) - value(over_50K) pairs so that we can sort.
        var sort_array = [];
        for (var key in data) {
          sort_array.push({key:key,value:data[key].value.over_50k});
        }
        
        // Now sort it.
        sort_array = sort_array.sort(function(x,y){return  x.value - y.value});
        
        // Now compose the result array.
        var sorted_data = [];
        for (var i=0;i<sort_array.length;i++) {
          var item = data[sort_array[i].key];
          sorted_data.push(item);
        }
        return sorted_data;
    },

    /**
     * Add gridlines to "chartGroup" "x" axis with "chartHeight" 
     */
    makeXgridlines(chartGroup, chartHeight, x) {		
        
        // add the X gridlines
        chartGroup.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x)
            .ticks(10)
            .tickSize(-chartHeight)
            .tickFormat("")
        )
    },

    /* 
     * Add Legend to the "svg" with color scale "z"
     */
    addLegend(svg, z, chartWidth) {
        
        var options = ["True", "False"];
        var legend = svg.selectAll(".legend")
                        .data(options.slice())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d,i) { return "translate(" + i%2 * 75 + 
                          "," + Math.floor(i/2) * 20 + ")"; })
        legend.append("rect")
              .attr("x", chartWidth - 18)
              .attr("y", 4)
              .attr("width", 18)
              .attr("height", 14)
              .style("fill", z);
        legend.append("text")
              .attr("x", chartWidth - 24)
              .attr("y", 6)
              .attr("dy", ".6em")
              .style("text-anchor", "end")
              .text(function(d) { return d;});
    }
}
export default utilFunc;