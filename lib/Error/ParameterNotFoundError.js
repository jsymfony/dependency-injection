var util = require('util');
var parent = JSymfony.DependencyInjection.Error.InvalidArgumentError;
var fn = JSymfony.fn;

/**
 * This exception is thrown when a non-existent parameter is used.
 * 
 * @param {string} key The requested parameter key
 * @param {string} sourceId The service id that references the non-existent parameter
 * @param {string} sourceKey The parameter key that references the non-existent parameter
 * @constructor
 */
function ParameterNotFoundError(key, sourceId, sourceKey) {
    parent.call(this);
    this._key = key;
    this._sourceId = sourceId || null;
    this._sourceKey = sourceKey || null;
    this.updateRepr();
}

util.inherits(ParameterNotFoundError, parent);

ParameterNotFoundError.prototype.name = 'ParameterNotFoundError';

ParameterNotFoundError.prototype.updateRepr = function () {
    if (null !== this._sourceId) {
        this.message = fn.sprintf('The service "%s" has a dependency on a non-existent parameter "%s".', this._sourceId, this._key);
    } else if (null !== this._sourceKey) {
        this.message = fn.sprintf('The parameter "%s" has a dependency on a non-existent parameter "%s".', this._sourceKey, this._key);
    } else {
        this.message = fn.sprintf('You have requested a non-existent parameter "%s".', this._key);
    }
};

ParameterNotFoundError.prototype.getKey = function () {
    return this._key;
};

ParameterNotFoundError.prototype.getSourceId = function () {
    return this._sourceId;
};

ParameterNotFoundError.prototype.getSourceKey = function () {
    return this._sourceKey;
};

ParameterNotFoundError.prototype.setSourceId = function (sourceId) {
    this._sourceId = sourceId;
    this.updateRepr();
};

ParameterNotFoundError.prototype.setSourceKey = function (sourceKey) {
    this._sourceKey = sourceKey;
    this.updateRepr();
};


JSymfony.DependencyInjection.Error.ParameterNotFoundError = module.exports = ParameterNotFoundError;
