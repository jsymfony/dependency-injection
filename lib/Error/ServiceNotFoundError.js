var util = require('util');
var parent = JSymfony.InvalidArgumentError;

function ServiceNotFoundError(id, sourceId) {
    this._id = id;
    this._sourceId = sourceId;
    var message;

    if (!sourceId) {
        message = JSymfony.fn.sprintf('You have requested a non-existent service "%s".', id);
    } else {
        message = JSymfony.fn.sprintf('The service "%s" has a dependency on a non-existent service "%s".', sourceId, id);
    }

    parent.call(this, message)
}

util.inherits(ServiceNotFoundError, parent);

ServiceNotFoundError.prototype.name = 'ServiceNotFoundError';

ServiceNotFoundError.prototype.getId = function () {
    return this._id;
};

ServiceNotFoundError.prototype.getSourceId = function () {
    return this._sourceId;
};

JSymfony.DependencyInjection.Error.ServiceNotFoundError = module.exports = ServiceNotFoundError;
