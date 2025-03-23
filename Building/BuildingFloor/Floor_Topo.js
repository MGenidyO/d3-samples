
const canvas = {
    w: 1000,
    h: 1000
};

const topoData = await d3.json(`./2layer.json`);
debugger
const geoData = {};

const arrOfKeys = Object.keys(topoData.objects);

arrOfKeys.forEach(key => {
    geoData[key] = topojson.feature(topoData, key);
})

const d3Identity = d3.geoIdentity();

const d3Projection = d3Identity
.reflectY(true)
    .fitSize([canvas.w, canvas.h], geoData["floor_map"]);

const d3Path = d3.geoPath(d3Projection);

const svgContainer = d3
    .select("#svg_floor_topo_container")
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

