var _ = require('lodash');
var util = require('util');
var Alias = JSymfony.DependencyInjection.Alias;
var Reference = JSymfony.DependencyInjection.Reference;

/**
 * Replaces all references to aliases with references to the actual service.
 *
 * @constructor
 *
 * @implements JSymfony.DependencyInjection.Compiler.CompilerPassInterface
 */
function ResolveReferencesToAliasesPass() {

}

util.inherits(ResolveReferencesToAliasesPass, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * Processes the ContainerBuilder to replace references to aliases with actual service references
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
ResolveReferencesToAliasesPass.prototype.process = function (containerBuilder) {
    var self = this;
    containerBuilder.getDefinitions().forEach(function (id, definition) {
        if (definition.isSynthetic() || definition.isAbstract()) {
            return;
        }
        definition.setArguments(self.processArguments(containerBuilder, definition.getArguments()));
        definition.setMethodCalls(self.processArguments(containerBuilder, definition.getMethodCalls()));
        definition.setProperties(self.processArguments(containerBuilder, definition.getProperties()));
    });

    containerBuilder.getAliases().forEach(function (id, alias) {
        var aliasId = alias.toString();
        var defId = self.findDefinitionId(containerBuilder, aliasId);
        if (aliasId != defId) {
            containerBuilder.setAlias(id, new Alias(defId, alias.isPublic()));
        }
    });
};

/**
 * Processes the arguments to replace aliases
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 * @param {Array|Object} arguments
 *
 * @return {Array|Object}
 */
ResolveReferencesToAliasesPass.prototype.processArguments = function (containerBuilder, args) {
    var self = this;
    for (var k in args) {
        if (!args.hasOwnProperty(k)) {
            continue;
        }
        var argument = args[k];
        if (_.isArray(argument) || _.isPlainObject(argument)) {
            args[k] = self.processArguments(containerBuilder, argument);
        } else if (argument instanceof Reference) {
            var id = argument.toString();
            var defId = self.findDefinitionId(containerBuilder, id);
            if (defId != id) {
                args[k] = new Reference(defId, argument.getInvalidBehavior(), argument.isStrict());
            }
        }
    }

    return args;
};

ResolveReferencesToAliasesPass.prototype.findDefinitionId = function (containerBuilder, id) {
    while (containerBuilder.hasAlias(id)) {
        id = containerBuilder.getAlias(id).toString();
    }
    return id;
};

JSymfony.DependencyInjection.Compiler.ResolveReferencesToAliasesPass = module.exports = ResolveReferencesToAliasesPass;
