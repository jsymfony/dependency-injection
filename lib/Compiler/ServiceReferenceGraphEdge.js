var ServiceReferenceGraphNode = JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode;

/**
 * Represents an edge in your service graph.
 *
 * Value is typically a reference.
 *
 * @constructor
 * @param {ServiceReferenceGraphNode} sourceNode
 * @param {ServiceReferenceGraphNode} destNode
 * @param {string} value
 *
 */
function ServiceReferenceGraphEdge(sourceNode, destNode, value) {
    this._sourceNode = sourceNode;
    this._destNode = destNode;
    this._value = value;
}

/**
 * Returns the value of the edge
 *
 * @return {ServiceReferenceGraphNode}
 */
ServiceReferenceGraphEdge.prototype.getValue = function () {
    return this._value;
};

/**
 * Returns the source node
 *
 * @return {ServiceReferenceGraphNode}
 */
ServiceReferenceGraphEdge.prototype.getSourceNode = function () {
    return this._sourceNode;
};

/**
 * Returns the destination node
 *
 * @return {ServiceReferenceGraphNode}
 */
ServiceReferenceGraphEdge.prototype.getDestNode = function () {
    return this._destNode;
};

JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphEdge = module.exports = ServiceReferenceGraphEdge;

