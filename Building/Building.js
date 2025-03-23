
const canvas = {
    w: 1000,
    h: 1000
};

const topoData = await d3.json(`./Building.json`);
debugger
const geoData = {};

const arrOfKeys = Object.keys(topoData.objects);

arrOfKeys.forEach(key => {
    geoData[key] = topojson.feature(topoData, key);
})

const d3Identity = d3.geoIdentity();

const d3Projection = d3Identity
.reflectY(true)
    .fitSize([canvas.w, canvas.h], geoData["city_building_svgrepo_com"]);

const d3Path = d3.geoPath(d3Projection);

const svgContainer = d3
    .select("#svg_building_container")
    .append("svg")
    .attr("viewBox", `0 0 ${canvas.w} ${canvas.h}`)
    .classed("floormap", true)

const groups = svgContainer
    .selectAll("g")
    .data(arrOfKeys)
    .enter()
    .append("g")
    .attr("class", (d)=>d)
debugger
const assets = groups
    .selectAll("path")
    .data(d=> geoData[d]?.features)
    .enter()
    .append("path")
    .attr("fill", "#363cad")
    .attr("cursor", "pointer")
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3 )
    .attr("d", d3Path)


// const width = 1000;
// const height = 1000;

// //us = FileAttachment("./us.json").json()
// const us = await d3.json(`./building.json`);
// debugger
// const zoom = d3.zoom()
//     .scaleExtent([1, 8])
//     .on("zoom", zoomed);

// // const svg = d3.create("svg")
// //     .attr("viewBox", [0, 0, width, height])
// //      .attr("width", width)
// //     .attr("height", height)
// //     .attr("style", "max-width: 100%; height: auto;")
// //     .on("click", reset);
    
// const svg = d3
// .select("#svg_building_container")
// .append("svg")
// .attr("viewBox", [0, 0, width, height])
// .attr("width", width)
// .attr("height", height)
// .attr("style", "border:1px solid black")
// .classed("us-map", true)
// .on("click", reset);

// const path = d3.geoPath();

// const g = svg.append("g");

// const states = g.append("g")
//     .attr("fill", "#444")
//     .attr("cursor", "pointer")
//   .selectAll("path")
//   .data(topojson.feature(us, us.objects.city_building_svgrepo_com).features)
//   .join("path")
//     .on("click", clicked)
//     .attr("d", path);

// //states.append("title").text(d => `State: ${d.properties.name}\nBy: Silverkey Tech`);

// g.append("path")
//     //.attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("stroke-linejoin", "round")
//     .attr("d", path(topojson.mesh(us, us.objects.city_building_svgrepo_com, (a, b) => a !== b)));

// svg.call(zoom);

// function reset() {
//   states.transition().style("fill", null);
//   svg.transition().duration(750).call(
//     zoom.transform,
//     d3.zoomIdentity,
//     d3.zoomTransform(svg.node()).invert([width/2, height/2])
//   );
// }

// function clicked(event, d) {
//   const [[x0, y0], [x1, y1]] = path.bounds(d);
//   event.stopPropagation();
//   states.transition().style("fill", null);
//   d3.select(this).transition().style("fill", "red");
//   svg.transition().duration(750).call(
//     zoom.transform,
//     d3.zoomIdentity
//       .translate(width / 2, height / 2)
//       .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
//       .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
//     d3.pointer(event, svg.node())
//   );
// }

// function zoomed(event) {
//   const {transform} = event;
//   g.attr("transform", transform);
//   g.attr("stroke-width", 2 );
// }

// // return svg.node();
