import './graph.scss';
import * as d3 from "d3";
import {Node} from "../node/node.model";
import {Observable} from "rxjs";
import {ContextMenu} from "../context-menu";

export class GraphService {
    private graph;

    private width;
    private height;

    private color = d3.scaleOrdinal(d3.schemeCategory20);

    private simulation;

    private menu;
    private menuGraph;
    private menuNodes;

    constructor(selector, menu) {
        this.graph = d3.select(selector);
        this.width = +this.graph.attr("width");
        this.height = +this.graph.attr("height");

        this.menu = menu;

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id((d: Node) => {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        this._initContextMenu();
        this._init();
    }

    private _initContextMenu() {
        this.menuGraph = new ContextMenu(d3);
        this.graph.on('contextmenu', this.menuGraph.contextMenu(this.menu.graphConfig));

        this.menuNodes = new ContextMenu(d3);
    }

    private _init() {
        let dataRequest = Observable.create((observer) => {
            if (localStorage.getItem('data')) {
                try {
                    observer.next(JSON.parse(localStorage.getItem('data')));
                    observer.complete();
                } catch (e) {
                    d3.json("data.json", (error, json: any) => {
                        if (error) throw error;
                        observer.next(json);
                        localStorage.setItem('data', JSON.stringify(json));
                        observer.complete();
                    });
                }
            } else {
                d3.json("data.json", (error, json: any) => {
                    if (error) throw error;
                    observer.next(json);
                    localStorage.setItem('data', JSON.stringify(json));
                    observer.complete();
                });
            }
        });

        dataRequest.subscribe((json: any) => {
            let node = this.graph.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(json.nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("style", "z-index: 2")
                .attr("fill", (d: Node) => {
                    return this.color(d.group);
                })
                .attr("cx", (d: Node) => {
                    return d.x;
                })
                .attr("cy", (d: Node) => {
                    return d.y;
                })
                .on('contextmenu', this.menuNodes.contextMenu(this.menu.nodesConfig));

            node.append("title")
                .text((d: Node) => {
                    return d.id;
                });

            this.simulation
                .nodes(json.nodes);
        });
    }
}