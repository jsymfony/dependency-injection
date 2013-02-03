var _ = require('lodash');
var util = require('util');
var RuntimeError = JSymfony.DependencyInjection.Error.RuntimeError;
var Reference = JSymfony.DependencyInjection.Reference;
var ContainerBuilder = JSymfony.DependencyInjection.ContainerBuilder;

/**
 * Replaces all references to aliases with references to the actual service.
 *
 * @constructor
 *
 * @implements {JSymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
function ResolveInvalidReferencesPass() {

}

util.inherits(ResolveInvalidReferencesPass, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * Processes the ContainerBuilder to replace references to aliases with actual service references
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
ResolveInvalidReferencesPass.prototype.process = function (containerBuilder) {
    var self = this;
    containerBuilder.getDefinitions().forEach(function (name, definition) {
        if (definition.isSynthetic() || definition.isAbstract()) {
            return;
        }
        definition.setArguments(self.processArguments(containerBuilder, definition.getArguments(), false));
        var calls = [];
        definition.getMethodCalls().forEach(function (call) {
            try {
                calls.push([call[0], self.processArguments(containerBuilder, call[1], true)]);
            } catch (e) {
                if (e instanceof  RuntimeError) {
                    // this call is simply removed
                } else {
                    throw e;
                }
            }
        });

        var properties = {};
        var props = definition.getProperties();
        for (var name in props) {
            if (!props.hasOwnProperty(name)) {
                continue;
            }
            try {
                var value = props[name];
                value = this.processArguments(containerBuilder, [value], true);
                properties[name] = value[0];
            } catch (e) {
                if (e instanceof  RuntimeError) {
                    // this call is simply removed
                } else {
                    throw e;
                }
            }
        }
        definition.setProperties(properties);
    });
};

/**
 * Processes arguments to determine invalid references.
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 * @param {Array|Object} arguments
 * @param {boolean} inMethodCall
 * @return {Array|Object}
 */
ResolveInvalidReferencesPass.prototype.processArguments = function (containerBuilder, args, inMethodCall) {
    for (var k in args) {
        if (!args.hasOwnProperty(k)) {
            continue;
        }
        var argument = args[k];
        if (_.isArray(argument) || _.isPlainObject(argument)) {
            args[k] = this.processArguments(containerBuilder, argument, inMethodCall);
        } else if (argument instanceof  Reference) {
            var id = argument.toString();
            var invalidBehavior = argument.getInvalidBehavior();
            var exists = containerBuilder.has(id) || containerBuilder.getContainer().has(id);
            if (exists && ContainerBuilder.ERROR_ON_INVALID_REFERENCE != invalidBehavior) {
                args[k] = new Reference(id, ContainerBuilder.ERROR_ON_INVALID_REFERENCE, argument.isStrict());
            } else if (!exists && ContainerBuilder.NULL_ON_INVALID_REFERENCE == invalidBehavior) {
                args[k] = null;
            } else if (!exists && ContainerBuilder.IGNORE_ON_INVALID_REFERENCE != invalidBehavior) {
                if (inMethodCall) {
                    throw new RuntimeError('Method shouldn\'t be called.');
                }
                args[k] = null;
            }
        }
    }
    return args;
};

JSymfony.DependencyInjection.Compiler.ResolveInvalidReferencesPass = module.exports = ResolveInvalidReferencesPass;
