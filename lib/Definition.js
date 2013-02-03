//notFinished
var fn = JSymfony.fn;
var DI = JSymfony.DependencyInjection;
/**
 * Definition represents a service definition.
 *
 * @constructor
 *
 * @param {string} className The service class
 * @param {Array} args An array of arguments to pass to the service constructor
 */
function Definition(className, args) {
    this._class = className;
    this._arguments = fn.castArray(args);
    this._properties = {};
    this._calls = [];
    this._tags = {};
    this._scope = new DI.Scope(DI.Scope.SCOPE_TOP);
    this._synthetic = false;
    this._public = true;
    this._abstract = false;
}

/**
 * @protected
 */
Definition.prototype._scope = null;
/**
 * @protected
 */
Definition.prototype._class = null;
/**
 * @protected
 */
Definition.prototype._configurator = null;
/**
 * @protected
 */
Definition.prototype._arguments = [];
/**
 * @protected
 */
Definition.prototype._calls = [];
/**
 * @protected
 */
Definition.prototype._factoryMethod = null;
/**
 * @protected
 */
Definition.prototype._factoryService = null;
/**
 * @protected
 */
Definition.prototype._factoryObject = null;
/**
 * @protected
 */
Definition.prototype._properties = null;


Definition.prototype.setFactoryObject = function (factory) {
    this._factoryObject = factory;
    return this;
};

Definition.prototype.getFactoryObject = function () {
    return this._factoryObject;
};

Definition.prototype.setFactoryMethod = function (method) {
    this._factoryMethod = method;
    return this;
};

Definition.prototype.getFactoryMethod = function () {
    return this._factoryMethod;
};

Definition.prototype.setFactoryService = function (service) {
    this._factoryService = service;
    return this;
};

Definition.prototype.getFactoryService = function () {
    return this._factoryService;
};

Definition.prototype.getClass = function () {
    return this._class;
};

Definition.prototype.setClass = function (className) {
    this._class = className;
    return this;
};

Definition.prototype.setArguments = function (args) {
    this._arguments = fn.castArray(args);
    return this;
};

Definition.prototype.getArguments = function () {
    return this._arguments;
};

Definition.prototype.setProperties = function (properties) {
    this._properties = properties;
    return this;
};

Definition.prototype.getProperties = function () {
    return this._properties;
};

Definition.prototype.setProperty = function (name, value) {
    this._properties[name] = value;
    return this;
};

Definition.prototype.addArgument = function (arg) {
    this._arguments.push(arg);
    return this;
};

Definition.prototype.replaceArgument = function (index, arg) {
    if (index < 0 || index > this._arguments.length - 1) {
        throw new JSymfony.DependencyInjection.Error.OutOfBoundsError(fn.sprintf('The index "%d" is not in the range [0, %d].', index, this._arguments.length - 1));
    }
    this._arguments.push(arg);
    return this;
};

Definition.prototype.getArgument = function (index) {
    if (index < 0 || index > this._arguments.length - 1) {
        throw new JSymfony.DependencyInjection.Error.OutOfBoundsError(fn.sprintf('The index "%d" is not in the range [0, %d].', index, this._arguments.length - 1));
    }
    return this._arguments[index];
};

/**
 * example: setMethodCalls([['setMailer', [['arg1'], ['arg2']]], ['setData', [['some_arg']]]])
 *
 * @param {Array.<Array.<string, Array>>} calls
 * @return {*}
 */
Definition.prototype.setMethodCalls = function (calls) {
    this._calls = [];

    var self = this;

    calls.forEach(function (call) {
        self.addMethodCall(call[0], call[1]);
    });

    return this;
};

Definition.prototype.addMethodCall = function (method, args) {
    if (!method) {
        throw new Core.DependencyInjection.Error.InvalidArgumentError('Method name cannot be empty');
    }

    this._calls.push([method, args]);

    return this;
};

Definition.prototype.removeMethodCall = function (method) {
    for (var i = this._calls.length -1; i >= 0; i--) {
        var call = this._calls[i];
        if (call[0] == method) {
            this._calls.splice(i, 1);
        }
    }
    return this;
};

Definition.prototype.hasMethodCall = function (method) {
    for (var i = 0; i < this._calls.length; i++) {
        if (this._calls[i][0] == method) {
            return true;
        }
    }
    return false;
};

Definition.prototype.getMethodCalls = function () {
    return this._calls;
};

Definition.prototype.setTags = function (tags) {
    this._tags = tags;

    return this;
};

Definition.prototype.getTags = function () {
    return this._tags;
};

/**
 *
 * @param {string} name
 *
 * @return [] An array of attributes
 */
Definition.prototype.getTag = function (name) {
    return this.hasTag(name) ? this._tags[name] : {};
};

Definition.prototype.addTag = function (name, attributes) {
    if (!this.hasTag(name)) {
        this._tags[name] = [];
    }

    if (attributes) {
        this._tags[name].push(attributes);
    }

    return this;
};



Definition.prototype.hasTag = function (name) {
    return this._tags.hasOwnProperty(name);
};

Definition.prototype.clearTag = function (name) {
    delete this._tags[name];
    return this;
};

Definition.prototype.clearTags = function () {
    this._tags = {};
    return this;
};

Definition.prototype.setScope = function (scope) {
    this._scope = scope;
};

Definition.prototype.getScope = function () {
    return this._scope;
};

Definition.prototype.setAbstract = function (isAbstract) {
    this._abstract = !!isAbstract;
};

Definition.prototype.isAbstract = function () {
    return this._abstract;
};

Definition.prototype.setPublic = function (isPublic) {
    this._public = !!isPublic;
};

Definition.prototype.isPublic = function () {
    return this._public;
};

Definition.prototype.setSynthetic = function (synthetic) {
    this._synthetic = !!synthetic;
};

Definition.prototype.isSynthetic = function () {
    return this._synthetic;
};

Definition.prototype.setConfigurator = function (configurator) {
    this._configurator = configurator;
    return this;
};

Definition.prototype.getConfigurator = function () {
    return this._configurator;
};

JSymfony.DependencyInjection.Definition = module.exports = Definition;
