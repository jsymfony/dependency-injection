var ContainerBuilder = JSymfony.DependencyInjection.ContainerBuilder;
var DI = JSymfony.DependencyInjection;


/**
 * Container is a dependency injection container.
 *
 * It gives access to object instances (services).
 *
 * Services and parameters are simple key/pair stores.
 *
 * Parameter and service keys are case insensitive.
 *
 * A service id can contain lowercased letters, digits, underscores, and dots.
 * Underscores are used to separate words, and dots to group services
 *
 * @constructor
 *
 * @param {JSymfony.DependencyInjection.ParameterBag} parameterBag
 */
function Container(parameterBag) {
    this._parameterBag = parameterBag || new DI.ParameterBag();
    this._services = new JSymfony.Map();
    this._frozen = false;

    this.set('service_container', this);
}

Container.prototype.compile = function () {
    this._parameterBag.resolve();
    this._frozen = true;
};

Container.prototype.isFrozen = function () {
    return this._frozen;
};

Container.prototype.getParameterBag = function () {
    return this._parameterBag;
};

Container.prototype.getParameter = function (name) {
    return this._parameterBag.get(name);
};

Container.prototype.hasParameter = function(name) {
    return this._parameterBag.has(name);
};

Container.prototype.setParameter = function(name, value) {
    return this._parameterBag.set(name, value);
};

Container.prototype.set = function (id, service) {
    id = id.toLowerCase();

    this._services.set(id, service);
};

Container.prototype.has = function (id) {
    id = id.toLowerCase();
    return this._services.has(id);
};

Container.prototype.get = function (id, invalidBehavior) {
    invalidBehavior = invalidBehavior || ContainerBuilder.ERROR_ON_INVALID_REFERENCE;
    id = id.toLowerCase();

    if (!this._services.has(id)) {
        if (invalidBehavior == ContainerBuilder.ERROR_ON_INVALID_REFERENCE) {
            throw new DI.Error.ServiceNotFoundError(id);
        } else {
            return null;
        }
    }

    return this._services.get(id);
};

Container.prototype.getServiceIds = function () {
    return  this._services.keys();
};

JSymfony.DependencyInjection.Container = module.exports = Container;
