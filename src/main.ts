import * as d3 from 'd3';
import {Node} from './node.model';

let svg = d3.select("#graph");
let width = +svg.attr("width");
let height = +svg.attr("height");

let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d: Node) => {
        return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width/2, height/2));

d3.json("data.json", (error, graph: any) => {
    if (error) throw error;

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d: Node) { return color(d.group); })
        .attr("cx", function(d: Node) { return d.x; })
        .attr("cy", function(d: Node) { return d.y; });

    node.append("title")
        .text(function(d: Node) { return d.id; });


    simulation
        .nodes(graph.nodes);
});