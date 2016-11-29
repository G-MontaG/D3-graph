import {GraphService} from "./components/graph/graph";
import {NodeService} from "./components/node/node.service";

export class Flow {
    private graphService: GraphService;
    private nodeService: NodeService;

    private menu = {
        graphConfig: [
            {
                title: 'Add',
                action: this.addNode.bind(this)
            }
        ],
        nodesConfig: [
            {
                title: 'Remove',
                action: null
            }
        ]
    };

    constructor() {
        this.graphService = new GraphService("#graph", this.menu);
        this.nodeService = new NodeService(this.graphService);
    }

    public addNode(event: MouseEvent, i: number) {
        console.log(this);
        this.nodeService.addNode(event, i)
    }
}

let flow = new Flow();