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

    private menuNodesConfig = [
        {
            title: 'Item #1',
            action: function (elm, d, i) {
                console.log('Item #1 clicked!');
                console.log('The data for this circle is: ' + d);
            }
        },
        {
            title: 'Item #2',
            action: function (elm, d, i) {
                console.log('You have clicked the second item!');
                console.log('The data for this circle is: ' + d);
            }
        }
    ];
    private menuNodes;

    constructor(selector, width?, height?) {
        this.graph = d3.select(selector);
        this.width = width || +this.graph.attr("width");
        this.height = height || +this.graph.attr("height");

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
                .attr("fill", (d: Node) => {
                    return this.color(d.group);
                })
                .attr("cx", (d: Node) => {
                    return d.x;
                })
                .attr("cy", (d: Node) => {
                    return d.y;
                })
                .on('contextmenu', this.menuNodes.contextMenu(this.menuNodesConfig));

            node.append("title")
                .text((d: Node) => {
                    return d.id;
                });

            this.simulation
                .nodes(json.nodes);
        });
    }
}