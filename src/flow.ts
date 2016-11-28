import {GraphService} from "./components/graph/graph";
import {NodeService} from "./components/node/node.service";

class Flow {
    private graphService: GraphService;
    private nodeService: NodeService;

    constructor() {
        this.graphService = new GraphService("#graph");
        this.nodeService = new NodeService(this.graphService);
    }
}

new Flow();