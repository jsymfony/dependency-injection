var ServiceReferenceGraphEdge = JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphEdge;
var Alias = JSymfony.DependencyInjection.Alias;
var Definition = JSymfony.DependencyInjection.Definition;
/**
 * Represents a node in your service graph.
 *
 * Value is typically a definition, or an alias.
 *
 * @constructor
 * @param {string} id
 * @param {*} value
 */
function ServiceReferenceGraphNode(id, value) {
    this._id = id;
    this._value = value;
    this._inEdges = [];
    this._outEdges = [];
}

/**
 * Adds an in edge to this node
 *
 * @param {ServiceReferenceGraphEdge} edge
 */
ServiceReferenceGraphNode.prototype.addInEdge = function (edge) {
    this._inEdges.push(edge);
};

/**
 * Adds an out edge to this node
 *
 * @param {ServiceReferenceGraphEdge} edge
 */
ServiceReferenceGraphNode.prototype.addOutEdge = function (edge) {
    this._outEdges.push(edge);
};

/**
 * Checks if the value of this node is a Alias.
 *
 * @return {boolean}
 */
ServiceReferenceGraphNode.prototype.isAlias = function () {
    return this._value instanceof Alias;
};


/**
 * Checks if the value of this node is a Definition.
 *
 * @return {boolean}
 */
ServiceReferenceGraphNode.prototype.isDefinition = function () {
    return this._value instanceof Definition;
};

/**
 * Returns the identifier.
 *
 * @return {string}
 */
ServiceReferenceGraphNode.prototype.getId = function () {
    return this._id;
};

/**
 * Returns the in edges
 *
 * @return {Array}
 */
ServiceReferenceGraphNode.prototype.getInEdges = function () {
    return this._inEdges;
};

/**
 * Returns the out edges
 *
 * @return {Array}
 */
ServiceReferenceGraphNode.prototype.getOutEdges = function () {
    return this._outEdges;
};

/**
 * Returns the value of this Node
 *
 * @return {*}
 */
ServiceReferenceGraphNode.prototype.getValue = function () {
    return this._value;
};

JSymfony.DependencyInjection.Compiler.ServiceReferenceGraphNode = module.exports = ServiceReferenceGraphNode;
