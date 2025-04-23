const canvas = {
  w: 1500,
  h: 1000
};

const topoData = await d3.json(`../ProjeCS -New/ProjeCS.json`);
const client_data = await d3.json(`../ProjeCS -New/ProjeCSData.json`);

const geoData = {};

const arrOfKeys = Object.keys(topoData.objects);

arrOfKeys.forEach(key => {
  geoData[key] = topojson.feature(topoData, key);
});

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
  .on("click", reset);

const g = svg.append("g");

const zones = [...new Set(arrOfKeys.flatMap(key => geoData[key]?.features.map(f => f.properties.Zone)))];
const colorScale = d3.scaleOrdinal()
  .domain(zones)
  .range(d3.schemeCategory10);

const tooltip = d3.select("#tooltip")
  .style("opacity", 0)
  .attr("class", "tooltip");

const assets = g
  .selectAll("g")
  .data(arrOfKeys)
  .enter()
  .append("g")
  .attr("class", "main-layer")
  .attr("stroke-width", 2);

  assets.selectAll("path")
  .data(d => geoData[d]?.features.filter(f => {
    const level = client_data.find(e => e.RoomID == f.properties.LAYER)?.Level;
    return level === "1" || level === "2";
  }))
  .enter()
  .append("path")
  .attr("cursor", "pointer")
  .attr("stroke", "#A3A5AB")
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
          <div class="value">${Number(d.target.__data__.properties.AREA).toFixed(2)}</div>
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

function updateLayerColors() {
  const showLayer1 = document.getElementById("layer1").checked;
  const showLayer2 = document.getElementById("layer2").checked;

  assets.selectAll("path")
    .attr("fill", d => {
      const roomData = client_data.find((e) => e.RoomID == d.properties.LAYER);
      if (roomData?.Level === "1" && showLayer1) return "#0d0f42"; 
      if (roomData?.Level === "2" && showLayer2) return "#0d0f42"; 
      return "none";
    })
    .attr("visibility", d => {
      const roomData = client_data.find((e) => e.RoomID == d.properties.LAYER);
      if (roomData?.Level === "1" && showLayer1) return "visible";
      if (roomData?.Level === "2" && showLayer2) return "visible";
      return "hidden"; 
    });
}

document.getElementById("layer1").addEventListener("change", updateLayerColors);
document.getElementById("layer2").addEventListener("change", updateLayerColors);

updateLayerColors();

const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

function reset() {
  g.transition().style("fill", null);
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity,
    d3.zoomTransform(svg.node()).invert([canvas.w / 2, canvas.h / 2])
  );
}

function zoomed(event) {
  const { transform } = event;
  g.attr("transform", transform);
  g.attr("stroke-width", 2);
}
