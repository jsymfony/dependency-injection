var fn = JSymfony.fn;
var InvalidArgumentError = JSymfony.DependencyInjection.Error.InvalidArgumentError;
var ServiceReferenceGraphNode = JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode;
var ServiceReferenceGraphEdge = JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphEdge;

/**
 * This is a directed graph of your services.
 *
 * @constructor
 */
function ServiceReferenceGraph() {
    this._nodes = {};
}

/**
 * Checks if the graph has a specific node.
 *
 * @param {string} id
 * @return {boolean}
 */
ServiceReferenceGraph.prototype.hasNode = function (id) {
    return this._nodes.hasOwnProperty(id);
};

/**
 *
 * @param {string} id
 *
 * @return {JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode}
 */
ServiceReferenceGraph.prototype.getNode = function (id) {
    if (!this.hasNode(id)) {
        throw new InvalidArgumentError(fn.sprintf('There is no node with id "%s".', id))
    }

    return this._nodes[id];
};

/**
 * Returns all nodes.
 *
 * @return {Object.<string, ServiceReferenceGraphNode>}
 */
ServiceReferenceGraph.prototype.getNodes = function () {
    return this._nodes;
};

/**
 * Clears all nodes
 */
ServiceReferenceGraph.prototype.clear = function () {
    this._nodes = {};
};

/**
 * Connects 2 nodes together in the Graph.
 *
 * @param {string} sourceId
 * @param {string} sourceValue
 * @param {string} destId
 * @param {string} destValue
 * @param {string} reference
 */
ServiceReferenceGraph.prototype.connect = function (sourceId, sourceValue, destId, destValue, reference) {
    var sourceNode = this._createNode(sourceId, sourceValue);
    var destNode = this._createNode(destId, destValue);
    var edge = new ServiceReferenceGraphEdge(sourceNode, destNode, reference);

    sourceNode.addOutEdge(edge);
    destNode.addInEdge(edge);
};

/**
 * Creates a graph node
 *
 * @param {string} id
 * @param {string} value
 * @private
 */
ServiceReferenceGraph.prototype._createNode = function (id, value) {
    if (this.hasNode(id) && this._nodes[id].getValue() === value) {
        return this._nodes[id];
    }

    return this._nodes[id] = new ServiceReferenceGraphNode(id, value);
};


JSymfony.DependencyInjection.Compiler.ServiceReferenceGraph = module.exports = ServiceReferenceGraph;
