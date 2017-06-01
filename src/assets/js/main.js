"use strict";

// var d3 = require('d3');
// var topojson = require('topojson');
// var Tabletop = require('tabletop');
// var d3tip = require("d3-tip")(d3);
var math = require('./math.js')
var fitText = require('./fitText.js');
var animations = require('./animations.js')
var smoothScroll = require('./smoothScroll.js')

var width = 600,
    height = 600,
    r = 300;

var projection = d3.geo.orthographic()
    .scale(299)
    .translate([width / 2, height / 2])
    .clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1MHhYJzgdI2xNKoQum8Ec7S1k86wm_LfMr3PNw4GPmL8/pubhtml';

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

var drag = d3.behavior.drag()
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

svg.call(drag);

var gpos0, o0;

function dragstarted(){

  gpos0 = projection.invert(d3.mouse(this));
  o0 = projection.rotate();

}

function dragged(){

  var gpos1 = projection.invert(d3.mouse(this));

  o0 = projection.rotate();

  var o1 = math.eulerAngles(gpos0, gpos1, o0);
  projection.rotate(o1);

  svg.selectAll("path").attr("d", path);

  svg.selectAll(".explosion")
    .attr("d", circlePoint)

  svg.selectAll("circle")
    .attr("cx", function (d) { return projection(d)[0]; })
    .attr("cy", function (d) { return projection(d)[1]; })

}

function dragended(){
}

function initSpreadsheet() {
  Tabletop.init( { key: publicSpreadsheetUrl,
    callback: printDataOntoMap,
    simpleSheet: true } )
  }

function printDataOntoMap(data, tabletop) {
  svg.selectAll("path.explosion")
    .data(data).enter()
    .append("path")
    .attr("class", "explosion ripple")
    .attr("d", circlePoint)
    .style("pointer-events","visible")
    .on('click', rotateMap);
}

function circlePoint(data) {
  return path({"type": "Point", "coordinates": [data.lon, data.lat]})
}

function rotateMap(d) {
  var target = d3.event.target;
  console.log(target);
  d3.selectAll(".explosion").transition()
    .duration(1250)
    .tween("rotate", function() {
      var p = d3.geo.centroid({"type": "Point", "coordinates": [d.lon, d.lat]}),
      r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function (t) {
          projection.rotate(r(t));
          svg.selectAll("path").attr("d", path);
          svg.selectAll(".explosion").attr("d", circlePoint);
        }
    })
    .each("end", function() { 
      tip.show(d, target);
    });
}

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) { 
    return `
    <div>
      <iframe width="560" height="315" src="${d.url}&amp;controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });      
svg.call(tip);

d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world){
  if (error) throw error;

  svg.append("path")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  var borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

  svg.append("path")
    .datum(borders)
    .attr("class", "border")
    .attr("d", path);

  initSpreadsheet();

});

