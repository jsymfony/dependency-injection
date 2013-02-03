//notFinished
var _ = require('lodash');
var ParameterCircularReferenceError =  JSymfony.DependencyInjection.Error.ParameterCircularReferenceError;
var ParameterNotFoundError = JSymfony.DependencyInjection.Error.ParameterNotFoundError;

function ParameterBag(data) {
    this._parameters = {};
    this.add(data);
    this._resolved = false;
}

ParameterBag.prototype.get = function (name) {
    name = name.toLowerCase();
    if (!this.has(name)) {
        throw new ParameterNotFoundError(name);
    }

    return this._parameters[name];
};

ParameterBag.prototype.all = function () {
    return _.clone(this._parameters);
};

ParameterBag.prototype.set = function (name, value) {
    this._parameters[name.toLowerCase()] = value;
    return this;
};

ParameterBag.prototype.has = function (name) {
    return this._parameters.hasOwnProperty(name.toLowerCase());
};

ParameterBag.prototype.remove = function (name) {
    delete this._parameters[name.toLowerCase()];
};

ParameterBag.prototype.add = function (data) {
    var self = this;
    if (data instanceof ParameterBag) {
        data = data.all();
    }
    if (_.isPlainObject(data) || _.isArray(data)) {
        Object.keys(data).forEach(function (key) {
            self._parameters[key.toLowerCase()] = data[key];
        });
    }
};

/**
* Replaces parameter placeholders (%name%) by their values for all parameters.
*/
ParameterBag.prototype.resolve = function () {
    if (this._resolved) {
        return;
    }
    var params = {};

    for (var key in this._parameters) {
        if (!this._parameters.hasOwnProperty(key)) {
            continue;
        }

        var value = this._parameters[key];
        value = this.resolveValue(value);
        params[key] = this.unescapeValue(value);
    }

    this._parameters = params;

    this._resolved = true;
};

ParameterBag.prototype.resolveValue = function(value, resolving) {
    resolving = resolving || {};

    var self = this;
    if (_.isPlainObject(value)) {
        var args = {};
        _.forOwn(value, function (v, k) {
            args[self.resolveValue(k, resolving)] = self.resolveValue(v, resolving);
        });
        return args;
    } else if (_.isArray(value)) {
        return value.map(function (v) {
            return self.resolveValue(v, resolving);
        });
    }

    if (typeof value !== 'string') {
        return value;
    }

    return this.resolveString(value, resolving);
};

ParameterBag.prototype.resolveString = function (value, resolving) {
    var match = value.match(/^%([^%\s]+)%$/);
    if (match) {
        var key = match[1].toLowerCase();
        if (resolving.hasOwnProperty(key)) {
            throw new ParameterCircularReferenceError(Object.keys(resolving));
        }
        resolving[key] = true;
        return this.resolved ? this.get(key) : this.resolveValue(this.get(key), resolving);
    }

    var self = this;
    return value.replace(/%%|%([^%\s]+)%/g, function (str, key) {
        // skip %%
        if (typeof key === 'undefined') {
            return '%%';
        }
        if (resolving.hasOwnProperty(key)) {
            throw new ParameterCircularReferenceError(Object.keys(resolving));
        }
        var resolved = self.get(key);

        if (typeof resolved !== 'number' && typeof resolved !== 'string') {
            throw new JSymfony.RuntimeError(fn.sprintf('A string value must be composed of strings and/or numbers, but found parameter "%s" of type %s inside string value "%s".', key, typeof resolved, value));
        }
        resolved = resolved.toString();
        resolving[key] = true;
        return self.isResolved() ? resolved : self.resolveString(resolved, resolving);
    });
};

ParameterBag.prototype.isResolved = function () {
    return this._resolved;
};

ParameterBag.prototype.escapeValue = function(value) {
    if (typeof value === 'string') {
        return value.replace(/%/g, '%%');
    }

    var self = this;

    if (_.isPlainObject(value)) {
        var result = {};
        _.forOwn(value, function (value, key) {
            result[key] = self.escapeValue(value);
        });
        return result;
    } else if (_.isArray(value)) {
        return value.map(function (val) {
            return self.escapeValue(val);
        });
    }

    return value;
};

ParameterBag.prototype.unescapeValue = function(value) {
    if (typeof value === 'string') {
        return value.replace(/%%/g, '%');
    }

    var self = this;

    if (_.isPlainObject(value)) {
        var result = {};
        _.forOwn(value, function (value, key) {
            result[key] = self.unescapeValue(value);
        });
        return result;
    } else if (_.isArray(value)) {
        return value.map(function (val) {
            return self.unescapeValue(val);
        });
    }

    return value;
};

JSymfony.DependencyInjection.ParameterBag = module.exports = ParameterBag;
