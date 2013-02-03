var ContainerBuilder = JSymfony.DependencyInjection.ContainerBuilder;

/**
 * Reference represents a service reference
 * @constructor
 * @param {string} serviceId
 * @param invalidBehavior The behavior when the service does not exist
 * @param strict Sets how this reference is validated
 */
function Reference(serviceId, invalidBehavior, strict) {
    this._serviceId = serviceId.toLowerCase();
    this._invalidBehavior = invalidBehavior || ContainerBuilder.ERROR_ON_INVALID_REFERENCE;
    this._strict = typeof strict === 'undefined' || strict;
}

Reference.prototype.toString = function () {
    return this._serviceId.toString();
};

Reference.prototype.getInvalidBehavior = function () {
    return this._invalidBehavior;
};

Reference.prototype.isStrict = function () {
    return this._strict;
};

JSymfony.DependencyInjection.Reference = module.exports = Reference;
