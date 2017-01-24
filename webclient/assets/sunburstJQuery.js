$(window).on('hashchange', function(e) {

  var width = 1000;
  var height = 450;
  var n = 1;
  var radius = Math.min(width, height) / 2;
  var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);
  var y = d3.scale.linear().range([0, radius]);

  var color = d3.scale.category20c();

  var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  vis.append("foreignObject").attr("class", "explanation-obj").attr("width",
      "175").attr("height", "50").style("z-index", 100).style("cursor",
      "pointer")
    .attr("transform", function(x) {
      return "translate(-90,-20)"
    }).append("xhtml:div").attr("id", "words").attr("class", "wordsDiv");

  var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) {
      return d.size;
    });

  var arc = d3.svg.arc()
    .startAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x)))
    })
    .endAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)))
    })
    .innerRadius(function(d) {
      return Math.sqrt(d.y);
    })
    .outerRadius(function(d) {
      return Math.sqrt(d.y + d.dy);
    });


  var parts = document.location.hash.split('/');
  var routeName = parts[parts.length - 2];
  var domainName = parts[parts.length - 1];

  console.log("routeName: ", routeName);

  if (routeName !== 'domainhome')
    return;

  console.log("Domain: ", domainName);

  var settings = {
    "async": true,
    "url": ("/domain/domainhomeview/" + domainName),
    "method": "GET"
  }

  $.ajax(settings).done(function(response) {
    if (response)
      json = JSON.parse(response);
    else
      json = {};

    // });

    // d3.json('assets/test.json', function(error, json) {
    // d3.json(data, function(error, json) {
    var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");

    var path = vis.selectAll("path")
      .data(partition.nodes(json))
      .enter().append("svg:path")
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) {
        if (n == 1) {
          ++n;
          return '#ddd';
        }
        return color(d.name);
      })
      .style("opacity", 1)
      .on("click", click)
      .on("mouseover", mouseover);

    d3.select("#container").on("mouseleave", mouseleave);

    function click(d) {
      path.transition()
        .duration(750)
        .attrTween("d", arcTween(d));
      if (d) {
        // CAUTION this is a global variable declared in index.html, like a coward
        selectedConceptName.onNewSelect(d.name);

      }
    }
    d3.select(self.frameElement).style("height", height + "px");

    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i ?

          function(t) {
            return arc(d);
          } :
          function(t) {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
            return arc(d);
          };
      };
    }
  });

  function mouseover(d) {
    console.log('Selected element ', d.name);
    d3.select("#courseName")
      .text(d.name);
    d3.select("#explanation")
      .style("visibility", "");

    var sequenceArray = getAncestors(d);
    var targetAttr = $(this).find('div.mouseover').prevObject.attr('style');
    var breadCrumColor = targetAttr.substring(targetAttr.indexOf('rgb'),
      targetAttr.indexOf(';'));
    updateBreadcrumbs(sequenceArray, breadCrumColor);

    d3.selectAll("path")
      .style("opacity", 0.3);

    vis.selectAll("path")
      .filter(function(node) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);
  }

  function mouseleave(d) {
    console.log('in mouse leave')
    d3.select("#trail")
      .style("visibility", "hidden");
    d3.selectAll("path").on("mouseover", null);

    d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
        d3.select(this).on("mouseover", mouseover);
      });

    d3.select("#explanation")
      .style("visibility", "hidden");
  }

  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  var b = {
    w: 90,
    h: 30,
    s: 3,
    t: 10
  };

  function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) {
      points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
  }

  function updateBreadcrumbs(nodeArray, breadCrumColor) {
    var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) {
        return d.name + d.depth;
      });

    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", breadCrumColor);
    entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .style('text-align', 'justify')
      .style('font-size', '9px')
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.name;
      });

    g.attr("transform", function(d, i) {
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    g.exit().remove();
    d3.select("#trail")
      .style("visibility", "");
  }

});
