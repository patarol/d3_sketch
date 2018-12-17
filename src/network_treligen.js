/* global d3 window makeAnnotations */

// Network code from: Mike Bostock's example https://bl.ocks.org/mbostock/4062045
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const color = {
  3: '#005b7c',
  1: '#008eab',
  8: '#01bcc6',
  22: '#113a80',
};

const circlePadding = 20;

const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.id))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2));

var treligen = ['BigData', 'Tools', 'Services', 'Techniques']

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.json('https://raw.githubusercontent.com/patarol/d3_sketch/master/data/graph.json', (error, graph) => {
  if (error) throw error;

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line')
    .attr('stroke-width', 1);

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graph.nodes)
    .enter().append('circle')
    .attr('r', function(d){
      if ('Treligen' === d.id) {

        return 20;

      } else {

          if (treligen.includes(d.id)) {

            return 12;

          } else
          return 5;
        }
      }
    )
    .attr('fill', d => color[`${d.group}`] || 'lightgrey')
    .on("click", click)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
    .on('mouseover.tooltip', function(d) {
      tooltip.transition()
        .duration(300)
        .style("opacity", .8);
      tooltip.html(d.id)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function() {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    })
    .on('mouseout.fade', fade(1))
    .on('mouseout.fade2', console.log("linkedByIndex"))
    .on("mousemove", function() {
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    });

  node.append('title')
    .text(d => d.id);

  d3.select('body')
    .on('touchstart', noZoom)
    .on('touchmove', noZoom)

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(graph.links);

  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    makeAnnotations.annotations()
      .forEach((d, i) => {
        points = graph.nodes
          .filter(d => d.group === groups[i])
          .map(d => ({
            x: d.x,
            y: d.y,
            r: 5
          }));
        circle = d3.packEnclose(points);
        d.position = {
          x: circle.x,
          y: circle.y
        };
        d.subject.radius = circle.r + circlePadding;
      });
    makeAnnotations.update();
  }

  let groups = [3, 1, 8];
  let points = groups.map(p => graph.nodes
    .filter(d => d.group === p)
    .map(d => ({
      x: d.x,
      y: d.y,
      r: 5
    })));

  let circle = points.map(p => d3.packEnclose(p));
  const annotations = [{
      note: {
        label: 'R  Python  SQL  D3  AWS',
        title: 'Tools'
      },
      dy: -13,
      dx: 106,
      x: circle[0].x,
      y: circle[0].y,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: circle[0].r + circlePadding,
        radiusPadding: 10,
      },
    },
    {
      note: {
        label: 'Boosting  TextMining  Clustering',
        title: 'Techniques'
      },
      dy: 13,
      dx: -136,
      x: circle[1].x,
      y: circle[1].y,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: circle[1].r + 20,
        radiusPadding: 10,
      },
    },
    {
      note: {
        label: 'Classification Prediction Segmentation',
        title: 'Services'
      },
      dy: -43,
      dx: -126,
      x: circle[2].x,
      y: circle[2].y,
      type: d3.annotationCalloutCircle,
      subject: {
        radius: circle[2].r + 20,
        radiusPadding: 10,
      },
    },
  ];

  window.makeAnnotations = d3.annotation()
    .annotations(annotations)
    .accessors({
      x: d => d.x,
      y: d => d.y
    });

  svg.append('g')
    .attr('class', 'annotation-encircle')
    .call(makeAnnotations);

  svg.selectAll('.annotation-subject')
    .style('pointer-events', 'none');

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function click(d) {
      if (!d3.event.defaultPrevented) {
        if (d.group) {
          d._group = d.group;
          d.node = null;
        }
        update();
      }
    }

    var linkedByIndex = {};
        graph.links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

     function fade(opacity) {
            return function(d) {
                node.style("stroke-opacity", function(o) {
                    thisOpacity = isConnected(d, o) ? 1 : opacity;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });


              link.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });


                link.attr("marker-end", function(o) {
                    return opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)';
                });





            };
     }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function noZoom() {
      d3.event.preventDefault();
    }
});
