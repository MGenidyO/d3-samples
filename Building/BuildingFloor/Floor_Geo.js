//sconst { geoEquirectangular } = require("../../lib/d3.v7");

(async function() {
    const width = 500;
    const height = width;
    const svg = d3.select('#svg_floor_geo_container')
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("fill", "#ff0066");  
    try {
      const geojson = await d3.json('./Floor_Geo.json');
      
//const d3Identity = d3.geoIdentity();

// const d3Projection = d3Identity
//     .fitSize([canvas.w, canvas.h]);


// var projection = d3.geoIdentity()
// .reflectY(true)
// .fitSize([760,700],data);

var projection = d3.geoEquirectangular()
const geoGenerator = d3.geoPath(projection);

    //   const projection = d3.geoTransverseMercator()
    //     .fitExtent([[0, 0], [width, height]], geojson);
        
    //   const geoGenerator = d3.geoPath()
    //     .projection(projection);

//const geoGenerator = d3.geoPath()
//.pointRadius(2);		
debugger
 svg
.append("g")
.attr("fill", "#ff0066")
.selectAll('path')
.data(geojson.features)
.join('path')
.attr("fill", "#363cad")
.attr("cursor", "pointer")
.attr("stroke", "black")
.attr("stroke-linejoin", "round")
.attr("stroke-width", 3 )
.attr('d', geoGenerator); 

// const assets = groups
//     .selectAll("path")
//     .data(d=> geoData[d]?.features)
//     .enter()
//     .append("path")
//     .attr("fill", "#363cad")
//     .attr("cursor", "pointer")
//     .attr("stroke", "black")
//     .attr("stroke-linejoin", "round")
//     .attr("stroke-width", 3 )
//     .attr("d", d3Path)

    //   const graticule = d3.geoGraticule();		  
    //   svg
    //     .append("g")
    //       .attr("stroke", "#666")
    //       .attr("stroke-width", "0.2")
    //       .attr("fill", "none")	
    //     .append("path")
    //       .attr('d', geoGenerator(graticule()));
    
    //   svg
    //     .append("g")
    //       .attr("fill", "rgba(0, 198, 134, 0.6)")
    //     .selectAll('path')
    //     .data(geojson.features)
    //     .join('path')
    //       .attr('d', d => geoGenerator(d));
          //.attr('d', geoGenerator);	

          
    //     var svg2 = d3.select("body").append("svg")
    //     .attr("width", 760)
    //     .attr("height", 700)
    //   d3.json("./Floor_Geo.json", function(data) {
    //     var group = svg2.selectAll("g")
    //       .data(data.features)
    //       .enter()
    //      .append("g")

    //   var projection = d3.geoIdentity()
    //     .reflectY(true)
    //     .fitSize([760,700],data);
    //   var path = d3.geoPath().projection(projection);
    //   var areas = group.append("path")
    //   .attr("d",path)
    //   .attr("class","area")
    //   })
    }
    catch (error) {
      document.querySelector("#errorMessage").textContent = error; 
    }
  })();
    // var svg = d3.select("svg")
    // var width = +svg.attr("width")
    // var height = +svg.attr("height")

    // const canvas = {
    //     w: 1000,
    //     h: 1000
    // };
    
    // const svgContainer = d3
    // .select("#svg_floor_geo_container")
    // .append("svg")
    // .attr("viewBox", `0 0 ${canvas.w} ${canvas.h}`)
    // .classed("floormap", true)

// const geojson = d3.json("./Floor_Geo.json")

//     const geoGenerator = d3.geoPath()
//   //.pointRadius(2);		
// debugger
// const svg = d3.select('#svg_floor_geo_container')
//   .append("g")
//     .attr("fill", "#ff0066")
//   .selectAll('path')
//     .data(geojson.features)
//     .join('path')
//     .attr('d', geoGenerator); 

    //var path = d3.geoPath().projection(d3.geoAlbersUsa().scale(500))
    //var path = d3.geoPath()
    //var path = d3.geoPath().projection(d3.geoMercator().scale(100))



    // var x = d3.scaleLinear()
    //     .domain([1, 10])
    //     .rangeRound([600, 860]);

    // var color = d3.scaleThreshold()
    //     .domain(d3.range(2, 10))
    //     .range(d3.schemeBlues[9]);

    



//   var promises = [
//     d3.json("./Floor_Geo.json")
//     //d3.json("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/08/8.04/data/us-map.json")
//   ]

//   Promise.all(promises).then(function(data){
//       ready(data[0]);
//   })

//   function ready(us) {
//     console.log(us)
//     svgContainer.append("g")
//           .selectAll("path")
//             .data(us.features)
//             //.data(topojson.feature(us, us.objects.states).features)
//           .enter()
//           .append("path")
//               .attr("fill", "grey")
//               .attr("d", path)
//               .attr("stroke", "#fff")
//               .attr("stroke-width", .2)
//   }

