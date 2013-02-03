var util = require('util');
var _ = require('lodash');
var InvalidArgumentError = JSymfony.DependencyInjection.Error.InvalidArgumentError;
var Alias = JSymfony.DependencyInjection.Alias;
var BadMethodCallError = JSymfony.DependencyInjection.Error.BadMethodCallError;
var RuntimeError = JSymfony.DependencyInjection.Error.RuntimeError;
var ParameterBag = JSymfony.DependencyInjection.ParameterBag;
var Scope = JSymfony.DependencyInjection.Scope;
var CompiledContainer = JSymfony.DependencyInjection.CompiledContainer;
var Definition = JSymfony.DependencyInjection.Definition;
var Reference = JSymfony.DependencyInjection.Reference;
var fn = JSymfony.fn;


/**
 * @param {JSymfony.DependencyInjection.ParameterBag} parameterBag
 * @param {JSymfony.DependencyInjection.Scope} scope
 *
 * @constructor
 */
function ContainerBuilder(parameterBag, scope) {
    this._extensions = new JSymfony.Map();
    this._definitions = new JSymfony.Map();
    this._aliases = new JSymfony.Map();
    this._extensionConfigs = new JSymfony.Map();
    this._compiler = null;
    this._parameterBag = parameterBag || new ParameterBag();
    this._frozen = false;
    this._scope = scope || new Scope(Scope.SCOPE_TOP);
    this._container = new CompiledContainer(this, this._scope);
}

ContainerBuilder.ERROR_ON_INVALID_REFERENCE = ContainerBuilder.prototype.ERROR_ON_INVALID_REFERENCE = 1;
ContainerBuilder.NULL_ON_INVALID_REFERENCE = ContainerBuilder.prototype.NULL_ON_INVALID_REFERENCE = 2;
ContainerBuilder.IGNORE_ON_INVALID_REFERENCE = ContainerBuilder.prototype.IGNORE_ON_INVALID_REFERENCE = 3;

ContainerBuilder.prototype.isFrozen = function () {
    return this._frozen;
};

ContainerBuilder.prototype.registerExtension = function (extension) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot register an extension in a frozen container builder');
    }
    this._extensions.set(extension.getAlias(), extension);
};

ContainerBuilder.prototype.getExtension = function (name) {
    if (!this._extensions.has(name)) {
        throw new InvalidArgumentError('Container extension "' + name + '" is not registered');
    }

    return this._extensions.get(name);
};

ContainerBuilder.prototype.getExtensions = function () {
    return this._extensions;
};

ContainerBuilder.prototype.hasExtension = function (name) {
    return this._extensions.has(name);
};

ContainerBuilder.prototype.loadFromExtension = function (extension, values) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot load from an extension on a frozen container builder');
    }

    if (this.hasExtension(extension)) {
        var  namespace = this.getExtension(extension).getAlias();
        this.getExtensionConfig(namespace).push(values);
    }

    return this;
};

ContainerBuilder.prototype.getCompiler = function() {
    if (null === this._compiler) {
        this._compiler = new JSymfony.DependencyInjection.Compiler();
    }

    return this._compiler;
};

ContainerBuilder.prototype.removeDefinition = function (id) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot remove definitions from a frozen container builder');
    }
    this._definitions.delete(id.toLowerCase());
};

ContainerBuilder.prototype.has = function (id) {
    id = id.toLowerCase();

    return this.hasDefinition(id) || this.hasAlias(id);
};

ContainerBuilder.prototype.getParameterBag = function () {
    return this._parameterBag;
};

ContainerBuilder.prototype.getParameter = function (name) {
    return this._parameterBag.get(name);
};

ContainerBuilder.prototype.hasParameter = function(name) {
    return this._parameterBag.has(name);
};

ContainerBuilder.prototype.setParameter = function(name, value) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot set parameter on a frozen container builder');
    }
    return this._parameterBag.set(name, value);
};


/**
 * Merges a ContainerBuilder with the current ContainerBuilder configuration.
 *
 * Service definitions overrides the current defined ones.
 *
 * But for parameters, they are overridden by the current ones. It allows
 * the parameters passed to the container constructor to have precedence
 * over the loaded ones.
 *
 *
 * @param {ContainerBuilder} container
*/
ContainerBuilder.prototype.merge = function (container) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot merge on a frozen container builder');
    }

    this.addDefinitions(container.getDefinitions());
    this.addAliases(container.getAliases());

    this.getParameterBag().add(container.getParameterBag());

    var self = this;
    this._extensions.forEach(function (name) {
        var cfg = self.getExtensionConfig(name);
        self._extensionConfigs.set(name, cfg.concat(container.getExtensionConfig(name)));
    });
};

ContainerBuilder.prototype.getExtensionConfig = function (name) {
    if (!this._extensionConfigs.has(name)) {
        this._extensionConfigs.set(name, []);
    }

    return this._extensionConfigs.get(name);
};

ContainerBuilder.prototype.prependExtensionConfig = function (name, config) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot prepend extension config on a frozen container builder');
    }
    var cfg = this._extensionConfigs.get(name);
    this._extensionConfigs.set([config].concat(cfg));
};

ContainerBuilder.prototype.compile = function () {
    if (this.isFrozen()) {
        return;
    }

    this.getCompiler().compile(this);
    this._parameterBag.resolve();
};

ContainerBuilder.prototype.getServiceIds = function () {
    return _.uniq([].concat(this.getDefinitions().keys())
                    .concat(this.getAliases().keys()));
};

ContainerBuilder.prototype.addAliases = function (aliases) {
    var self = this;
    aliases.forEach(function (alias, id) {
        self.setAlias(alias, id);
    });
};

ContainerBuilder.prototype.setAliases = function (aliases) {
    this._aliases.clear();
    this.addAliases(aliases);
};

ContainerBuilder.prototype.setAlias = function (alias, id) {
    alias = alias.toString().toLowerCase();

    if (typeof id === 'string') {
        id = new Alias(id);
    } else if (!id instanceof Alias) {
        throw new InvalidArgumentError('id must be a string');
    }

    if (alias === id.toString().toLowerCase()) {
        throw new InvalidArgumentError('An alias can not reference itself, got a circular reference on "' + alias + '".');
    }

    this._aliases.set(alias, id);
};


ContainerBuilder.prototype.removeAlias = function (id) {
    this._aliases.delete(id.toString().toLowerCase());
};

ContainerBuilder.prototype.hasAlias = function (id) {
    return this._aliases.has(id.toString().toLowerCase());
};

ContainerBuilder.prototype.getAliases = function () {
    return this._aliases;
};

ContainerBuilder.prototype.getAlias = function (id) {
    id = id.toLowerCase();

    if (!this.hasAlias(id)) {
        throw new InvalidArgumentError('The service alias "' + id + '" does not exist.');
    }
    return this._aliases.get(id);
};

ContainerBuilder.prototype.register = function(id, className) {
    return this.setDefinition(id, new Definition(className));
};

ContainerBuilder.prototype.addDefinitions = function (definitions) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot add definitions on a frozen container builder');
    }
    var self = this;
    definitions.forEach(function (id, definition) {
        self.setDefinition(id, definition);
    });
};

ContainerBuilder.prototype.setDefinitions = function (definitions) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Cannot set definitions on a frozen container builder');
    }
    this._definitions.clear();
    this.addDefinitions(definitions);
};

ContainerBuilder.prototype.getDefinitions = function () {
    return this._definitions;
};


ContainerBuilder.prototype.setDefinition = function (id, definition) {
    if (this.isFrozen()) {
        throw new BadMethodCallError('Adding definition to a frozen container is not allowed');
    }

    this.removeAlias(id.toLowerCase());
    this._definitions.set(id.toLowerCase(), definition);
    return this;
};

ContainerBuilder.prototype.hasDefinition = function(id) {
    return this._definitions.has(id.toLowerCase());
};

ContainerBuilder.prototype.getDefinition = function(id) {
    id = id.toLowerCase();
    if (!this.hasDefinition(id)) {
        throw new InvalidArgumentError('The service definition "' + id + '" does not exist');
    }
    return this._definitions.get(id);
};

ContainerBuilder.prototype.findDefinition = function (id) {
    while (this.hasAlias(id)) {
        id = this.getAlias(id);
    }

    return this.getDefinition(id);
};


ContainerBuilder.prototype.createService = function (id, definition, container) {
    var targetContainer = container;
    var definitionScope = definition.getScope();

    if (!definitionScope.isPrototype()) {

        while (!targetContainer.getScope().isEqual(definitionScope)) {
            if (!targetContainer.hasParent()) {
                throw new RuntimeError('You tried to create a service of an inactive scope');
            }
            targetContainer = targetContainer.getParent();
        }
    }

    var parameterBag = this.getParameterBag();

    var args = this.resolveServices(parameterBag.unescapeValue(parameterBag.resolveValue(definition.getArguments())), container);

    var service;
    if (definition.getFactoryMethod()) {
        var factory;
        if (definition.getFactoryObject()) {
            factory = parameterBag.resolveValue(definition.getFactoryObject());
            factory = fn.getDepthKey(factory, global, null);
            if (!factory) {
                throw new RuntimeError('Cannot create service "' + id + '" - factory object not found');
            }
        } else if (definition.getFactoryService()) {
            factory = container.get(parameterBag.resolveValue(definition.getFactoryService()));
        } else {
            throw new RuntimeError('Cannot create service from factory method without a factory service or factory object.');
        }

        service = factory[definition.getFactoryMethod()].apply(factory, args);
    } else {
        var className = parameterBag.resolveValue(definition.getClass());
        var constructor = fn.getDepthKey(className, global, null);
        if (!constructor) {
            throw new RuntimeError('Cannot create service "' + id + '" - class "' + className + '" not found');
        }
        service = fn.construct(constructor, args);
    }


    var self = this;
    definition.getMethodCalls().forEach(function (call) {
        var services = self.getServiceConditionals(call[1]);
        for (var i = 0; i < services.length; i++) {
            if (!this.has(services[i])) {
                return;
            }
        }

        service[call[0]].apply(service, self.resolveServices(parameterBag.resolveValue(call[1]), container));
    });

    var properties = this.resolveServices(parameterBag.resolveValue(definition.getProperties()), container);
    for (var name in properties) {
        if (!properties.hasOwnProperty(name)) {
            continue;
        }
        service[name] = properties[name];
    }


    var configurator = definition.getConfigurator();
    if (configurator) {
        fn.call(configurator, service);
    }

    if (!definitionScope.isPrototype() && id) {
        targetContainer.set(id, service);
    }

    return service;
};

/**
 * Replaces service references by the real service instance
 */
ContainerBuilder.prototype.resolveServices = function(value, container) {
    if (_.isPlainObject(value) || _.isArray(value)) {
        var self = this;
        Object.keys(value).forEach(function (key) {
            value[key] = self.resolveServices(value[key], container);
        });
    } else if (value instanceof Reference) {
        value = container.get(value.toString(), value.getInvalidBehavior());
    } else if (value instanceof Definition) {
        value = this.createService(null, value, container);
    }

    return value;
};

/**
 * Returns service ids for a given tag.
 *
 * @param {string} name
 *
 * @return {Object}
 */
ContainerBuilder.prototype.findTaggedServiceIds = function (name) {
    var tags = {};

    this._definitions.forEach(function (id, definition) {
        if (definition.hasTag(name)) {
            tags[id] = definition.getTag(name);
        }
    });

    return tags;
};

/**
 * Returns all tags the defined services use.
 *
 * @return {Array}
 */
ContainerBuilder.prototype.findTags = function () {
    var tags = [];
    this._definitions.forEach(function (id, definition) {
        tags = tags.concat(Object.keys(definition.getTags()));
    });
    return _.uniq(tags);
};

ContainerBuilder.prototype.setContainer = function (container) {
    this._container = container;
};

ContainerBuilder.prototype.getContainer = function () {
    return this._container;
};


ContainerBuilder.prototype.getScope = function () {
    return this._scope;
};

ContainerBuilder.prototype.getServiceConditionals = function (value) {
    var services = [];
    var self = this;
    if (util.isArray(value)) {
        value.forEach(function (v) {
            services = _.uniq(services.concat(self.getServiceConditionals(v)))
        });
    } else if (value instanceof Reference && value.getInvalidBehavior() === ContainerBuilder.IGNORE_ON_INVALID_REFERENCE) {
        services.push(value.toString());
    }
    return services;
};


JSymfony.DependencyInjection.ContainerBuilder = module.exports = ContainerBuilder;
