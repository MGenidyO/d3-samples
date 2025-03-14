// Set the margins
var margin = {top: 60, right: 100, bottom: 20, left: 80},
  width = 850 - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;

// Parse the month variable
var parseMonth = d3.timeParse("%b");
var formatMonth = d3.timeFormat("%b");

var formatYear = d3.timeFormat("%Y");
var parseYear = d3.timeParse("%Y");


// Set the ranges
var x = d3.scaleTime().domain([parseMonth("Jan"), parseMonth("Dec")]).range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Set the color scheme
var colors = d3.scaleOrdinal()
  .domain(["strawberry", "grape", "blueberry"])
  .range(["#EF5285", "#88F284" , "#5965A3"]);

// Define the line
var valueLine = d3.line()
    .x(function(d) { return x(d.Month); })
    .y(function(d) { return y(+d.Sales); })

// Create the svg canvas in the "graph" div
var svg = d3.select("#graph")
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

// Import the CSV data
d3.csv("MultiLineChartwith2LayersOfNesting.csv", function(error, data) {
  if (error) throw error;
  
   // Format the data
  data.forEach(function(d) {
      d.Month = parseMonth(d.Month);
      d.Sales = +d.Sales;
      d.Fruit = d.Fruit;
      d.Year = formatYear(parseYear(+d.Year));
  });

  var nest = d3.nest()
	  .key(function(d){
	    return d.Fruit;
	  })
	  .key(function(d){
	  	return d.Year;
	  })
	  .entries(data)

	  console.log(nest)

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Month; }));
  y.domain([0, d3.max(data, function(d) { return d.Sales; })]);
  
  // Set up the x axis
  var xaxis = svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .attr("class", "x axis")
       .call(d3.axisBottom(x)
          .ticks(d3.timeMonth)
          .tickSize(0, 0)
          .tickFormat(d3.timeFormat("%B"))
          .tickSizeInner(0)
          .tickPadding(10));

  // Add the Y Axis
   var yaxis = svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y)
          .ticks(5)
          .tickSizeInner(0)
          .tickPadding(6)
          .tickSize(0, 0));
  
  // Add a label to the y axis
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Monthly Sales")
        .attr("class", "y axis label");
 

	var fruitGroups = svg.selectAll(".fruitGroups")
	    .data(nest)
	    .enter()
	    .append("g")
	    .attr("stroke", function(d){ return colors(d.key)});

	var paths = fruitGroups.selectAll(".line")
        .data(function(d){ return d.values})
        .enter()
        .append("path");

    paths
	    .attr("d", function(d){
		  return valueLine(d.values)
		})
		.attr("class", "line")
		.style("stroke-dasharray", function(d){ 
			return (d.key == 2015) ? ("3, 3") : ("0, 0")});

  
})