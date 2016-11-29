const uuid = require('uuid');
import {Node} from "./node.model";

export class NodeService {
    private graphService;

    constructor(graph) {
        this.graphService = graph;
    }

    public addNode(event: MouseEvent, i: number) {
        try {
            let json = JSON.parse(localStorage.getItem("data"));

            json.nodes.push({
                "id": uuid(),
                "group": "1",
                "x": event.pageX,
                "y": event.pageY
            });

            localStorage.setItem("data", JSON.stringify(json));

            this.graphService.nodes = this.graphService.graph
                .selectAll("circle")
                .data(json.nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", (d: Node) => {
                    return this.graphService.color(d.group);
                })
                .attr("cx", (d: Node) => {
                    return d.x;
                })
                .attr("cy", (d: Node) => {
                    return d.y;
                })
                .on('contextmenu', this.graphService.menuNodes.contextMenu(
                    this.graphService.menu.nodesConfig).bind(this));

            this.graphService.nodes.append("title")
                .text((d: Node) => {
                    return d.id;
                });

            this.graphService.simulation
                .nodes(json.nodes);
        } catch (e) {
            console.log(e);
        }
    }
}