
const canvas = {
  w: 1000,
  h: 600
};

const topoData = await d3.json(`../ProjeCS/ProjeCS.json`);
const client_data = await d3.json(`../ProjeCS/ProjeCSData.json`);

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

//d3Projection.translate([0, 180,0]);

//projection.rotate([x / 10, 0, 0]);
const svg = d3
  .select("#svg_client_2_container")
  .append("svg")
  .attr("viewBox", `0 0 ${canvas.w} ${canvas.h}`)
  .attr("style", "border:3px solid #041E42; background-color:#E5E4E2;")
  .attr("width", canvas.w,)
  //  .attr("style", "border:1px solid black")
  .on("click", reset)


const g = svg.append("g");


// const states = g.append("g")
//     .attr("fill", "#444")
//     .attr("cursor", "pointer")
//   .selectAll("path")
//   .data(topojson.feature(us, us.objects.states).features)
//   .join("path")
//     .on("click", clicked)
//     .attr("d", path);

const groups = g
  .selectAll("g")
  .attr("fill", "#363cad")
  .attr("cursor", "pointer")
  .data(arrOfKeys)
  .enter()
  .append("g")
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
  .attr("d", d3Path).on("mouseover", function (d) {

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

assets.attr("fill", d => `${client_data.find((e) => e.RoomID == d.properties.LAYER) ? "#041E42" : "#C0C0C0"}`)
assets.attr("data-tip", d => `Zone: ${d.properties.Zone}\nAREA: ${d.properties.AREA}\nLAYER: ${d.properties.LAYER}\nDescription: ${client_data.find((e) => e.RoomID == d.properties.LAYER)?.RoomDescription}`)
// groups



const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

svg.call(zoom);

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



// function initTips() {
//   // purge previous for dynamic render
//   // Array.from(document.querySelectorAll('.tooltip')).forEach(el => {
//   //   el.remove()
//   // })

//   // built upon: https://stackoverflow.com/a/69340293/10885535
//   Array.from(document.querySelectorAll('[data-tip]')).forEach(el => {
//     // tip
//     let tip = document.createElement('div')
//     tip.classList.add('tooltip')
//     //tip.innerText = el.getAttribute('data-tip')
//     tip.style.backgroundColor = '#E5E4E2';
//     tip.style.border = '1.8px solid #8B8000';
//     tip.style.color = '#041E42';
//     tip.style.fontSize = '13px';
//     tip.style.fontFamily = `'Montserrat', 'Proxima Nova', 'Gotham', 'Avenir', sans-serif`;
//     tip.style.letterSpacing = '1px';
//     tip.style.fontWeight = '500';
//     tip.style.width = '230px'

//     document.body.appendChild(tip)
//     // logo
//     let logo = document.createElement('img')
//     logo.src = "../images/projecs2.png";

//     tip.appendChild(logo)

//     let divInfo = document.createElement('div')
//     divInfo.innerHTML = `<p></p><p><b>ZONE:</b> ${el.__data__.properties.Zone}</p>
//       <p><b>AREA:</b> ${el.__data__.properties.AREA}</p>
//       <p><b>LAYER:</b> ${el.__data__.properties.LAYER}</p>
//       <p><b>DESCRIPTION:</b>  ${client_data.find((e) => e.RoomID == el.__data__.properties.LAYER)?.RoomDescription}</p><p></p>`
//     tip.appendChild(divInfo)
//     //assets.attr("data-tip", d => `Zone: ${d.properties.Zone}\nAREA: ${d.properties.AREA}\nLAYER: ${d.properties.LAYER}\nDescription: ${client_data.find((e) => e.RoomID == d.properties.LAYER)?.RoomDescription }`)

//     // arrow
//     let arrow = document.createElement('div')
//     arrow.classList.add('tooltip-arrow')
//     tip.appendChild(arrow)

//     // toggle with mouse
//     el.onmouseover = e => {
//       tip.style.opacity = 1
//       tip.style.visibility = 'visible'
//       let elmPos = el.getBoundingClientRect()
//       let tipPos = tip.getBoundingClientRect()
//       tip.style.left = (elmPos.left + (elmPos.width - tipPos.width) / 2) + 'px'
//       tip.style.top = (elmPos.top + (elmPos.height)) + 'px'
//       arrow.style.left = (tipPos.width / 2 - 5) + 'px'
//       e.stopPropagation() // stop parent
//     };
//     el.onmouseout = e => {
//       tip.style.opacity = 0
//       tip.style.visibility = 'hidden'
//     };
//   });
// }

// kickoff
//initTips()