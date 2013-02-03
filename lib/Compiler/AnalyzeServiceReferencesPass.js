var _ = require('lodash');
var util = require('util');
var Reference = JSymfony.DependencyInjection.Reference;
var Definition = JSymfony.DependencyInjection.Definition;
var ContainerBuilder = JSymfony.DependencyInjection.ContainerBuilder;

/**
 * Run this pass before passes that need to know more about the relation of
 * your services.
 *
 * This class will populate the ServiceReferenceGraph with information. You can
 * retrieve the graph in other passes from the compiler.
 *
 * @constructor
 *
 * @param {boolean=} onlyConstructorArguments
 *
 * @implements {JSymfony.DependencyInjection.Compiler.RepeatablePassInterface}
 */
function AnalyzeServiceReferencesPass(onlyConstructorArguments) {
    this._onlyConstructorArguments = !!onlyConstructorArguments;
    this._repeatedPass = null;
    this._currentId = null;
    this._containerBuilder = null;
    this._currentDefinition = null;
    this._graph = null;
}

util.inherits(AnalyzeServiceReferencesPass, JSymfony.DependencyInjection.Compiler.RepeatablePassInterface);

/**
 * @inheritDoc
 */
AnalyzeServiceReferencesPass.prototype.setRepeatedPass = function (repeatedPass) {
    this._repeatedPass = repeatedPass;
};

/**
 * Processes a ContainerBuilder object to populate the service reference graph.
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
AnalyzeServiceReferencesPass.prototype.process = function (containerBuilder) {
    this._containerBuilder = containerBuilder;
    this._graph = containerBuilder.getCompiler().getServiceReferenceGraph();
    this._graph.clear();

    var self = this;
    containerBuilder.getDefinitions().forEach(function (id, definition) {
        if (definition.isSynthetic() || definition.isAbstract()) {
            return;
        }

        self._currentId = id;
        self._currentDefinition = definition;
        self.processArguments(definition.getArguments());

        if (!self._onlyConstructorArguments) {
            self.processArguments(definition.getMethodCalls());
            self.processArguments(definition.getProperties());
            if (definition.getConfigurator()) {
                self.processArguments([definition.getConfigurator()]);
            }
        }
    });

    containerBuilder.getAliases().forEach(function (id, alias) {
        self._graph.connect(id, alias, alias.toString(), self.getDefinition(alias.toString()), null);
    });
};

/**
 * Processes service definitions for arguments to find relationships for the service graph.
 *
 * @param {*} args
 */
AnalyzeServiceReferencesPass.prototype.processArguments = function (args) {
    for (var i in args) {
        if (!args.hasOwnProperty(i)) {
            continue;
        }
        var argument = args[i];

        if (_.isArray(argument) || _.isPlainObject(argument)) {
            this.processArguments(argument);
        } else if (argument instanceof Reference) {
            this._graph.connect(
                this._currentId,
                this._currentDefinition,
                this.getDefinitionId(argument.toString()),
                this.getDefinition(argument.toString()),
                argument
            )
        } else if (argument instanceof Definition) {
            this.processArguments(argument.getArguments());
            this.processArguments(argument.getMethodCalls());
            this.processArguments(argument.getProperties());
        }
    }
};

/**
 * Returns a service definition given the full name or an alias.
 *
 * @param {string} id A full id or alias for a service definition.
 *
 * @return {Definition?}
 */
AnalyzeServiceReferencesPass.prototype.getDefinition = function (id) {
    id = this.getDefinitionId(id);
    return id ? this._containerBuilder.getDefinition(id) : null;
};

AnalyzeServiceReferencesPass.prototype.getDefinitionId = function(id) {
    while (this._containerBuilder.hasAlias(id)) {
        id = this._containerBuilder.getAlias(id).toString();
    }

    if (!this._containerBuilder.hasDefinition(id)) {
        return null;
    }

    return id;
};



JSymfony.DependencyInjection.Compiler.AnalyzeServiceReferencesPass = module.exports = AnalyzeServiceReferencesPass;
