       
const fontSize = {
    regular: 14,
    large: 19,
    small: 11
  };
  
  const colorMap = {
    "#00CA8D": "#00AE70",
    "#FFB100": "#F39003",
    "#FF6782": "#E34C67"
  };
  
  const colors = ["#00CA8D", "#e3e3e3"];
  
  // green color code = #00CA8D
  //ngray color code =  #e3e3e3 , #F5F5F5

      const value = 0.75;
      const grade = "Progress";
      const percent = Math.round(value * 100);
      const text = percent + "%";
      const data = [value, 1 - value];
      const width = 160;
      const height = 160;
      const anglesRange = 0.1 * Math.PI;
      const margin = 20;
      const radis = Math.min(width, 2 * height) / 2 - margin;
      const thickness = 8;
      const ab = (value > 0.5 ? 1 : -1) * (thickness / 2);
  
      const translation = (x, y) => `translate(${x}, ${y})`;
  
      const svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", translation(width / 2, height - 15));
  
      const pies = d3
        .pie()
        .value((d) => d)
        .startAngle(anglesRange * (value >= 0.5 ? -1 : 1))
        .endAngle(anglesRange * (value >= 0.5 ? 1 : -1));
  
      const arc = d3
        .arc()
        .outerRadius(radis)
        .innerRadius(radis - thickness)
        .cornerRadius(10);
  
      const arcs = svg.selectAll("path").data(pies(data)).enter();
  
      arcs
        .append("path")
        .attr("fill", (d, i) => colors[i])
        .attr("d", arc);
  
      svg
        .append("text")
        .text(() => grade)
        .attr("text-anchor", "middle")
        .attr("dy", "-1.2em")
        .attr("fill", (d, i) => colors[i])
        .style("font-size", fontSize.large)
        .style("font-weight", "bold");
  
      svg
        .append("text")
        .text(() => text)
        .attr("text-anchor", "middle")
        .attr("fill", (d, i) => colors[i])
        .style("font-size", fontSize.regular);
  
        arcs
        .selectAll('circle')
        .data(pies(data))
        .enter()
        .append('circle')
        .attr('cx', d => {
          return radis * Math.cos(d.endAngle - d.startAngle) + (value > 0.5 ? -1 : 1) * (thickness / 2);
        })
        .attr('cy', d => {
          return (
            (value >= 0.5 ? -1 : 1) * radis * Math.sin(d.endAngle - d.startAngle) +
            0.5 * thickness
          );
        })
        .attr('r', (d, i) => {
          return i * 12;
        })
        .style('fill', '#00AE70');
  
      arcs
        .append("text")
        .text((d, i) => (i ? percent : ""))
        .attr("text-anchor", "middle")
        .attr('x', d => {
          return radis * Math.cos(d.endAngle - d.startAngle) + (value > 0.5 ? -1 : 1) * (thickness / 2);
        })
        .attr('y', d => {
          return (
            (value >= 0.5 ? -1 : 1) * radis * Math.sin(d.endAngle - d.startAngle) +
            thickness
          );
        })
        .attr("fill", "white")
        .style("font-size", fontSize.small);
    
  