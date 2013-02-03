var util = require('util');

var Container = JSymfony.DependencyInjection.Container;
var ContainerBuilder = JSymfony.DependencyInjection.ContainerBuilder;
var ServiceCircularReferenceError = JSymfony.DependencyInjection.Error.ServiceCircularReferenceError;
var InvalidArgumentError = JSymfony.DependencyInjection.Error.InvalidArgumentError;
/**
 *
 * @param containerBuilder
 * @param scope
 * @param parent
 * @extends {JSymfony.DependencyInjection.Container}
 * @constructor
 */
function CompiledContainer(containerBuilder, scope, parent) {
    this._containerBuilder = containerBuilder;
    this._scope = scope;
    this._parent = parent || null;
    this._services = new JSymfony.Map();
    this._services.set('service_container', this);
    this._loading = new JSymfony.Map();
}

util.inherits(CompiledContainer, Container);

CompiledContainer.prototype.compile = function () {};

CompiledContainer.prototype.isFrozen = function () {
    return true;
};

CompiledContainer.prototype.getParameterBag = function () {
    return this._containerBuilder.getParameterBag();
};

CompiledContainer.prototype.getParameter = function (name) {
    return this._containerBuilder.getParameter(name);
};

CompiledContainer.prototype.hasParameter = function (name) {
    return this._containerBuilder.hasParameter(name);
};

CompiledContainer.prototype.setParameter = function (name, value) {
    this._containerBuilder.setParameter(name, value);
};

CompiledContainer.prototype.has = function (id) {
    return this.hasOwn(id) ||  this.hasParent() && this.getParent().has(id);
};

CompiledContainer.prototype.hasOwn = function (id) {
    return Container.prototype.has.call(this, id);
};

CompiledContainer.prototype.getOwn = function (id) {
    return Container.prototype.get.call(this, id);
};


CompiledContainer.prototype.get = function (id, invalidBehavior) {
    invalidBehavior = invalidBehavior || ContainerBuilder.ERROR_ON_INVALID_REFERENCE;

    id = id.toString().toLowerCase();

    if (!this.has(id)) {
        if (this._loading.has(id)) {
            throw new ServiceCircularReferenceError(id, this._loading.keys())
        }

        if (this._containerBuilder.hasAlias(id)) {
            return this.get(this._containerBuilder.getAlias(id));
        }

        try {
            var definition = this._containerBuilder.getDefinition(id);
        } catch (e) {
            if (e instanceof InvalidArgumentError && invalidBehavior !== ContainerBuilder.ERROR_ON_INVALID_REFERENCE) {
                return null;
            } else {
                throw e;
            }
        }

        this._loading.set(id, true);

        var service = this._containerBuilder.createService(id, definition, this);

        this._loading.delete(id);

        return service;
    } else {
        var node = this;
        while (!node.hasOwn(id)) {
            node = node.getParent();
        }
        return node.getOwn(id);
    }
};

CompiledContainer.prototype.getServiceIds = function () {
    var ids = Container.prototype.getServiceIds.call(this);
    if (this.hasParent()) {
        return ids.concat(this.getParent().getServiceIds());
    }
    return ids;
};

CompiledContainer.prototype.getContainerBuilder = function () {
   return this._containerBuilder;
};

CompiledContainer.prototype.getScope = function () {
    return this._scope;
};

CompiledContainer.prototype.hasParent = function () {
    return this._parent !== null;
};

CompiledContainer.prototype.getParent = function () {
    return this._parent;
};

CompiledContainer.prototype.enterScope = function (name) {
    var scope = this.getScope().getChild(name);
    return new CompiledContainer(this._containerBuilder, scope, this);
};

JSymfony.DependencyInjection.CompiledContainer = module.exports = CompiledContainer;
