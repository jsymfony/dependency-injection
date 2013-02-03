var path = require('path');
var _ = require('lodash');
var util = require('util');
var fn = JSymfony.fn;

var DI = JSymfony.DependencyInjection;
var InvalidArgumentError = DI.Error.InvalidArgumentError;
var FileLoader = DI.Loader.FileLoader;
var ContainerBuilder = DI.ContainerBuilder;
var Alias = DI.Alias;

/**
 * JsFileLoader loads JS files service definitions
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 * @param {JSymfony.Config.FileLocatorInterface} locator
 *
 * @constructor
 * @extends {JSymfony.DependencyInjection.Loader.FileLoader}
 */
function JsFileLoader(containerBuilder, locator) {
    FileLoader.call(this, containerBuilder, locator);
}

util.inherits(JsFileLoader, FileLoader);

/**
 * Loads a js file
 *
 * @param {string} file
 * @param {string} type
 */
JsFileLoader.prototype.load = function (file, type) {
    var path = this._locator.locate(file);

    var content = this.loadFile(path);

    if (!content) {
        return;
    }

    this.parseImports(content, file);

    if (_.isPlainObject(content.parameters)) {
        var self = this;
        _.forOwn(content.parameters, function (value, key) {
            self._containerBuilder.setParameter(key, self.resolveServices(value));
        });
    }

    this.loadFromExtensions(content);

    this.parseDefinitions(content, file);
};

/**
 * Returns true if this class supports the given resource.
 *
 * @param {string} file
 * @param {string} type
 *
 * @return {boolean}
 */
JsFileLoader.prototype.supports = function (file, type) {
    return typeof file === 'string' && path.extname(file) === '.js';
};

/**
 * Parses all imports
 *
 * @param {Object} content
 * @param {string} file
 */
JsFileLoader.prototype.parseImports = function (content, file) {
    if (!content.hasOwnProperty('imports')) {
        return;
    }

    var self = this;
    content.imports.forEach(function (item) {
        self.setCurrentDir(path.dirname(file));
        self.import(item.resource, null, file);
    });
};

/**
 * Parses definitions
 *
 * @param {Object} content
 * @param {string} file
 */
JsFileLoader.prototype.parseDefinitions = function(content, file) {
    if (!content.hasOwnProperty('services')) {
        return;
    }

    var self = this;
    _.forOwn(content.services, function (service, id) {
        self.parseDefinition(id, service, file);
    });
};

/**
 * Parses a definition
 *
 * @param {string} id
 * @param {Object} service
 * @param {string} file
 */
JsFileLoader.prototype.parseDefinition = function (id, service, file) {

    if (typeof service === 'string' && service[0] === '@') {
        this._containerBuilder.setAlias(id, service.slice(1));
        return;
    } else if (service.alias) {
        var isPublic = !service.hasOwnProperty('public') || service.public;
        this._containerBuilder.setAlias(id, new Alias(service.alias, isPublic));
        return;
    }



    var definition = new DI.Definition();
    if (service.class) {
        definition.setClass(service.class);
    }

    if (service.scope) {
        definition.setScope(new DI.Scope(service.scope));
    }

    if (service.factory_object) {
        definition.setFactoryObject(service.factory_object);
    }

    if (service.factory_service) {
        definition.setFactoryService(service.factory_service);
    }

    if (service.factory_method) {
        definition.setFactoryMethod(service.factory_method);
    }

    if (service.arguments) {
        definition.setArguments(this.resolveServices(service.arguments));
    }

    if (service.hasOwnProperty('synthetic')) {
        definition.setSynthetic(service.synthetic);
    }

    if (service.hasOwnProperty('public')) {
        definition.setPublic(service.public);
    }

    if (service.hasOwnProperty('abstract')) {
        definition.setAbstract(service.abstract);
    }

    if (service.properties) {
        definition.setProperties(this.resolveServices(service.properties));
    }

    if (service.configurator) {
        definition.setConfigurator(service.configurator);
    }

    var self = this;
    if (service.calls) {
        service.calls.forEach(function (call) {

            var args = call.length > 1 ? self.resolveServices(call[1]) : [];
            definition.addMethodCall(call[0], args);
        });
    }

    if (service.tags) {
        if (!_.isArray(service.tags) && !_.isPlainObject(service.tags)) {
            throw new InvalidArgumentError(fn.sprintf(
                'Parameter "tags" must be an array for service "%s" in %s.',
                id, file
            ));
        }

        for (var key in service.tags) {
            if (!service.tags.hasOwnProperty(key)) {
                continue;
            }
            var tag = service.tags[key];
            if (!_.isPlainObject(tag)) {
                throw new InvalidArgumentError(fn.sprintf(
                    'Each "tag" must be an associative array for service "%s" in %s.',
                    id, file
                ));
            }

            if (!tag.hasOwnProperty('name')) {
                throw new InvalidArgumentError(fn.sprintf(
                    'A "tags" entry is missing a "name" key for service "%s" in %s.',
                    id, file
                ));
            }

            var name = tag.name;
            delete tag.name;

            for (var attribute in tag) {
                if (!tag.hasOwnProperty(attribute)) {
                    continue;
                }

                var value = tag[attribute];

                if (!fn.isScalar(value)) {
                    throw new InvalidArgumentError(fn.sprintf(
                        'A "tags" attribute must be of a scalar-type for service "%s", tag "%s" in %s.',
                        id, name, file
                    ));
                }
            }

            definition.addTag(name, tag);
        }
    }

    this._containerBuilder.setDefinition(id, definition);
};

/**
 * Loads a js file
 * @param {string} path
 *
 * @return {Object}
 */
JsFileLoader.prototype.loadFile = function (path) {
    try {
        return require(path);
    } catch (e) {
        throw new JSymfony.Config.Error.FileLoaderLoadError(path, null, null, e);
    }
};

/**
 * Resolves services
 *
 * @param {*} value
 * @return {*}
 */
JsFileLoader.prototype.resolveServices = function(value) {
    var self = this;
    if (_.isArray(value)) {
        return value.map(function (val) {
            return self.resolveServices(val);
        });
    }
    if (typeof value === 'string' && value[0] === '@') {
        var invalidBehavior;
        var strict = true;
        if (value.indexOf('@?') === 0) {
            value = value.slice(2);
            invalidBehavior = ContainerBuilder.IGNORE_ON_INVALID_REFERENCE
        } else {
            value = value.slice(1);
            invalidBehavior = ContainerBuilder.ERROR_ON_INVALID_REFERENCE;
        }

        if (value.slice(-1) === '=') {
            value = value.slice(0, -1);
            strict = false;
        }
        return new DI.Reference(value, invalidBehavior, strict);
    }

    return value;
};

/**
 * Loads from extensions
 *
 * @param {Object} content
 */
JsFileLoader.prototype.loadFromExtensions = function(content) {
    var self = this;
    _.forOwn(content, function (values, namespace) {
        if (['imports', 'parameters', 'services'].indexOf(namespace) != -1) {
            return;
        }

        self._containerBuilder.loadFromExtension(namespace, values);
    });
};

JSymfony.DependencyInjection.Loader.JsFileLoader = module.exports = JsFileLoader;
