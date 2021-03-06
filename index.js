var w = 900;
var h = 500;
var projection = d3
  .geoAlbersUsa()
  .translate([w / 2, h / 2])
  .scale([1000]);
var path = d3.geoPath().projection(projection);

var legendText = [
  "Cities Lived",
  "States Lived",
  "States Visited",
  "Never Been There",
];

var svg = d3.select("svg").attr("width", w).attr("height", h);

const colors = d3.schemeGnBu[4];

d3.csv("./mystates.csv").then((data) => {
  let cleanedData = data.map((d) => ({
    state: d.state,
    score: parseInt(d.score),
  }));

  d3.json("./us-states.json").then((data) => {
    cleanedData.forEach((place) => {
      data.features.forEach((state) => {
        if (place.state === state.properties.name) {
          state.properties.visited = place.score;
        }
      });
    });
    svg
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")

      .attr("d", path)
      .style("fill", (d) => {
        const value = d.properties.visited;
        return colors[value + 1];
      })
      .style("stroke", "#fff")
      .style("stroke-width", 1);
  });

  d3.csv("./places.csv").then((data) => {
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => projection([d.lon, d.lat])[0])
      .attr("cy", (d) => projection([d.lon, d.lat])[1])
      .attr("r", 4)
      .style("fill", d3.schemeCategory10[1]);

    svg
      .selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .style("stroke", "black")
      .attr("stroke-width", 2)
      .attr("x1", (d, i) => {
        let offset = 4;
        if (i === 2) {
          offset = -4;
        }
        return projection([d.lon, d.lat])[0] + offset;
      })
      .attr("y1", (d) => projection([d.lon, d.lat])[1])
      .attr("x2", (d, i) => {
        let offset = 40;
        if (i === 2) {
          offset = -40;
        }
        return projection([d.lon, d.lat])[0] + offset;
      })
      .attr("y2", (d) => projection([d.lon, d.lat])[1] + 10);

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => {
        console.log();
        let offset = 45;
        if (i === 2) {
          offset = -105;
        }
        return projection([d.lon, d.lat])[0] + offset;
      })
      .attr("y", (d) => projection([d.lon, d.lat])[1] + 10)
      .attr("dy", ".35em")
      .text(function (d) {
        console.log(d.place);
        return d.place;
      })
      .attr("font-family", "Arial");
  });

  console.log(colors);
  colors.push(d3.schemeCategory10[1]);
  console.log(colors);
  var legend = d3
    .select("body")
    .append("svg")
    .attr("class", "legend")
    .attr("width", 180)
    .attr("height", 200)
    .selectAll("g")
    .data(colors.slice(1).reverse())
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => d);

  legend
    .append("text")
    .data(legendText)
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function (d) {
      return d;
    })
    .attr("font-family", "Arial");
});
