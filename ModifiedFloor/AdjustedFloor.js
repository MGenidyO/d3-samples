

const canvas = {
    w: 1000,
    h: 1000
};

const topoData = await d3.json(`../ModifiedFloor/AdjustedFloor.json`);

const geoData = {};

const arrOfKeys = Object.keys(topoData.objects);

arrOfKeys.forEach(key => {
    geoData[key] = topojson.feature(topoData, key);
})

const d3Identity = d3.geoIdentity();

const d3Projection = d3Identity
    .fitSize([canvas.w, canvas.h], geoData["apartment"]);

const d3Path = d3.geoPath(d3Projection);

const svg = d3
    .select("#svg_container")
    .append("svg")
    .attr("viewBox", `0 0 ${canvas.w} ${canvas.h}`)
    .attr("style", "border:1px solid black")
    .classed("floormap", true)
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
    .data(arrOfKeys)
    .enter()
    .append("g")
    .attr("class", (d)=>d)
    //.on("click", clicked)
    
    groups.append("title")
        .text(d => d);

const assets = groups
    .selectAll("path")
    .data(d=> geoData[d]?.features)
    .enter()
    .append("path")
    .attr("d", d3Path)


    
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.call(zoom);
  
    function reset() {
        groups.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([canvas.w/2, canvas.h/2])
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
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 2 );
    }