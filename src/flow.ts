import {GraphService} from "./components/graph/graph";
import {NodeService} from "./components/node/node.service";

class Flow {
    private graphService: GraphService;
    private nodeService: NodeService;

    private menu = {
        graphConfig: [
            {
                title: 'Add',
                action: this.addNode
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

    public addNode(elm, node: Node, i) {

    }
}

new Flow();