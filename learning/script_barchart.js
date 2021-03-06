  // bar chart with d3.js v5

  var easeOutBounce = function(pos) {
    if ((pos) < (1 / 2.75)) {
      return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
      return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
      return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
  };

  Math.easeOutBounce = easeOutBounce;

  var t = d3.transition()
    .duration(1000)
    .ease(easeOutBounce)

  var svg = d3.select("svg"),
    margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 10
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set x axis margin
  var x = d3.scaleBand()
    .range([30, width])
    .padding(0.1);

  // set y axis margin
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

  d3.tsv("https://raw.githubusercontent.com/patarol/d3_sketch/master/data/data.tsv").then(function(data) {
    x.domain(data.map(function(d) {
      return d.name;
    }));
    y.domain([0, d3.max(data, function(d) {
      return Number(d.value);
    })]);

    // draw x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // draw y axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0" + 30 + ")")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d3.format(".0s")))
      .style("font-size", "10px")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Value")
      .style("font-size", "12px");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.name);
      })
      .attr("y", height)
      .transition()
      .duration(1000)
      .ease(easeOutBounce)
      .attr("y", function(d) {
        return y(Number(d.value));
      })

      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(Number(d.value));
      });
  });
