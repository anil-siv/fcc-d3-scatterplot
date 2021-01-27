const width = 800;
const height = 400;
const padding = 80;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", "0 0 860 430")
  .attr("preserveAspectRatio", "xMidYMid");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((response) => {
//convert time to UTC via data object

  response.forEach((d) => {
    let parsedTime = d.Time.split(":");
    d.Time = new Date(
      Date.UTC(null, null, null, null, parsedTime[0], parsedTime[1])
    );
  });

  let keys = ["No doping Allegations", "Doping Allegations"];

//set tick format
  var timeFormat = d3.timeFormat("%M:%S");

  let xScale = d3
    .scaleLinear()
    .domain([
      d3.min(response, (d) => d.Year),
      d3.max(response, (d) => d.Year)
    ])
    .range([padding + 20, width]);

  let yScale = d3
    .scaleTime()
    .domain([
      d3.min(response, (d) => d.Time),
      d3.max(response, (d) => d.Time)
    ])
    .range([padding, height - 25]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ")")
    .call(yAxis);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    
    .style("opacity", 0)
    .style("position", "absolute");

  const mousemove = (event, d) => {
    let pageX = event.pageX;
    let pageY = event.pageY;
    let mins = d.Time.getMinutes();
    let secs = d.Time.getSeconds();
    let year = d.Year

    const text = d3
      .select("#tooltip")
      .html(
        "<p>" +
          d.Year +
          ": " +
          d.Name +
          "<br>" +
          mins +
          ":" +
          secs +
          "<br>" +
          (d.Doping.length ? d.Doping : "") +
          "</p>"
      ).attr("data-year",(d) => year)
      .style("left", pageX + "px")
      .style("top", pageY + "px");
  };

  svg
    .selectAll("circle")
    .data(response)
    .enter()
    .append("circle")
    .attr("class","dot")
    .style("stroke", "gray")
    .style("fill", (d, i) => {
      return d.Doping.length > 0 ? "DarkRed" : "DarkCyan";
    })
    .attr("cx", (d, i) => xScale(d.Year))
    .attr("data-xvalue",(d,i) => d.Year)
    .attr("cy", (d, i) => yScale(d.Time))
    .attr("data-yvalue",(d,i) => d.Time)
    .attr("r", 5)
    .on("mouseover", (d, i) => d3.select("#tooltip").style("opacity", "1"))
    .on("mouseleave", (d, i) => d3.select("#tooltip").style("opacity", "0"))
    .on("mousemove", mousemove);

  let color = d3.scaleOrdinal()
  .domain(keys)
  .range(["DarkCyan","DarkRed"])

  svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("id","legend")
    .attr("cx", 640)
    .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 650)
    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  .style("font-family", "monospace")

});
