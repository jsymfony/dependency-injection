var util = require('util');
var parent = JSymfony.RuntimeError;

function ServiceCircularReferenceError(serviceId, path) {
    this._serviceId = serviceId;
    this._path = path;
    var message = JSymfony.fn.sprintf('Circular reference detected for service "%s", path: "%s".', serviceId, path.join(' -> '));

    parent.call(this, message)
}

util.inherits(ServiceCircularReferenceError, parent);

ServiceCircularReferenceError.prototype.getServiceId = function () {
    return this._serviceId;
};

ServiceCircularReferenceError.prototype.getPath = function () {
    return this._path;
};

JSymfony.DependencyInjection.Error.ServiceCircularReferenceError = module.exports = ServiceCircularReferenceError;
