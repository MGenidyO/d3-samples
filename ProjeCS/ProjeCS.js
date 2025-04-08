
const canvas = {
  w: 1500,
  h: 1000
};

// const topoData = await d3.json(`../ProjeCS/ProjeCS.json`);
// const client_data = await d3.json(`../ProjeCS/ProjeCSData.json`);

const topoData = await d3.json(`./ProjeCS/ProjeCS.json`);
const client_data = await d3.json(`./ProjeCS/ProjeCSData.json`);

const geoData = {};

const arrOfKeys = Object.keys(topoData.objects);

arrOfKeys.forEach(key => {
  geoData[key] = topojson.feature(topoData, key);
})

const d3Identity = d3.geoIdentity();

const d3Projection = d3Identity
.reflectY(true)
  .fitSize([canvas.w, canvas.h], geoData["JFK_lv2"]);

const d3Path = d3.geoPath(d3Projection);

const svg = d3
  .select("#svg_client_2_container")
  .append("svg")
  .attr("viewBox", `0 0 ${canvas.w} ${canvas.h}`)
  .attr("style", "background-color:#E5E4E2;")
  .attr("width", 1000)
  //  .attr("style", "border:1px solid black")
  .on("click", reset)


const g = svg.append("g");

const groups = g
  .selectAll("g")
  .attr("fill", "#363cad") // #363cad
  .attr("cursor", "pointer")
  .data(arrOfKeys)
  .enter()
  .append("g")
  .attr("class", "main-layer")
  .attr("class", (d) => d).attr("stroke-width", 2)
//.on("click", clicked)

// groups.append("title")
//     .text(d => d);

//new part 
const zones = [...new Set(arrOfKeys.flatMap(key => geoData[key]?.features.map(f => f.properties.Zone)))];
const colorScale = d3.scaleOrdinal()
  .domain(zones)
  .range(d3.schemeCategory10); // Use d3 predefined color scheme or define custom colors

  const tooltip = d3.select("#tooltip")
  .style("opacity", 0)
  .attr("class", "tooltip");

const assets = groups
  .selectAll("path")
  .data(d => geoData[d]?.features)
  .enter()
  .append("path")
  .attr("fill", d => colorScale(d.properties.Zone))
  .attr("cursor", "pointer")
  .attr("stroke", "#8B8000")
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 1.5)
  .attr("name", d => `${d.properties.LAYER}`)
  .attr("class", `mainLayerArea`)
  .attr("d", d3Path)
  .on("mouseover", function (d) {

  tooltip
  .style("opacity", 1)
  .html(`
    <h3 class="layerName">Main background</h3>
    <div class="row">
      <div class="label">Zone:</div>
      <div class="value">${d.target.__data__.properties.Zone}</div>
    </div>
    <div class="row">
      <div class="label">Area:</div>
      <div class="value">${d.target.__data__.properties.AREA}</div>
    </div>
    <div class="row">
      <div class="label">Layer:</div>
      <div class="value">${d.target.__data__.properties.LAYER}</div>
    </div>
    <div class="row">
      <div class="label">Description:</div>
      <div class="value" style="max-width: 400px;">${client_data.find((e) => e.RoomID == d.target.__data__.properties.LAYER)?.RoomDescription}</div>
    </div>
  `)
  .style("left", (event.pageX + 20) + "px")
  .style("top", (event.pageY - 30) + "px");
})
.on("mouseout", function () {
  tooltip.style("opacity", 0);
});

//==============tool tip old design code ==============
/*
  .on("mouseover", function (d) {

    tooltip.style("opacity", 0.9);
    tooltip
      .html(() => {
      return `<p></p><p><b>Zone:</b> ${d.target.__data__.properties.Zone}</p>
      <p><b>AREA:</b> ${d.target.__data__.properties.AREA}</p>
      <p><b>LAYER:</b> ${d.target.__data__.properties.LAYER}</p>
      <p><b>Description:</b>  ${client_data.find((e) => e.RoomID == d.target.__data__.properties.LAYER)?.RoomDescription}</p><p></p>`;
      })
    tooltip.append("img")
      .attr("src", "../images/projecs.png")

      tooltip
     .style("left", d.pageX + 10 + "px")
     .style("top", d.pageY - 28 + "px");
  })
  .on("mouseout", d => {
    tooltip.style("opacity", 0);
  });
  */

assets.attr("fill", d => `${client_data.find((e) => e.RoomID == d.properties.LAYER) ? "#041E42" : "#C0C0C0"}`)
assets.attr("data-tip", d => `Zone: ${d.properties.Zone}\nAREA: ${d.properties.AREA}\nLAYER: ${d.properties.LAYER}\nDescription: ${client_data.find((e) => e.RoomID == d.properties.LAYER)?.RoomDescription}`)
// groups



const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

// svg.call(zoom)
// .on("mousedown.zoom", null)
// .on("touchstart.zoom", null)
// .on("touchmove.zoom", null)
// .on("touchend.zoom", null);

function reset() {
  groups.transition().style("fill", null);
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity,
    d3.zoomTransform(svg.node()).invert([canvas.w / 2, canvas.h / 2])
  );
}

function clicked(event, d) {
  const [[x0, y0], [x1, y1]] = groups.bounds(d);
  event.stopPropagation();
  groups.transition().style("fill", null);
  d3.select(this).transition().style("fill", "red");
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(canvas.w / 2, canvas.h / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / canvas.w, (y1 - y0) / canvas.h)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
    d3.pointer(event, svg.node())
  );
}

function zoomed(event) {
  const { transform } = event;
  g.attr("transform", transform);
  g.attr("stroke-width", 2);
}


function getMainArea(searchWord) {
  const value = searchWord.target.value
  const existElements = d3.selectAll('.mainLayerArea').filter(function() {
    const name = d3.select(this).attr("name");
    return value && name.toLowerCase().includes(value.toLowerCase()); // filter by single attribute
  })
  .attr("fill-opacity", 0.3)
  .attr("fill", "red")

  const notExistElements = d3.selectAll('.mainLayerArea').filter(function() {
    const name = d3.select(this).attr("name");
    return !value || !name.toLowerCase().includes(value.toLowerCase()); // filter by single attribute
  })
  .attr("fill-opacity", 1)
  .attr("fill", d => `${client_data.find((e) => e.RoomID == d.properties.LAYER) ? "#041E42" : "#C0C0C0"}`)
  
}

  document.getElementById("example-search-input").addEventListener("keyup", e => getMainArea(e));

