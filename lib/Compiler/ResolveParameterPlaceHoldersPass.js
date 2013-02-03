var util = require('util');
var ParameterNotFoundError = JSymfony.DependencyInjection.Error.ParameterNotFoundError;

/**
 * Resolves all parameter placeholders "%somevalue%" to their real values.
 *
 * @constructor
 *
 * @implements {JSymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
function ResolveParameterPlaceHoldersPass() {

}

util.inherits(ResolveParameterPlaceHoldersPass, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * Processes the ContainerBuilder to resolve parameter placeholders
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 *
 * @throws JSymfony.DependencyInjection.ParameterNotFoundError
 */
ResolveParameterPlaceHoldersPass.prototype.process = function (containerBuilder) {
    var parameterBag = containerBuilder.getParameterBag();

    containerBuilder.getDefinitions().forEach(function (id, definition) {
        try {
            definition.setClass(parameterBag.resolveValue(definition.getClass()));
            definition.setArguments(parameterBag.resolveValue(definition.getArguments()));

            var calls = [];
            definition.getMethodCalls().forEach(function (call) {
                    calls.push(parameterBag.resolveValue(call))
            });
            definition.setMethodCalls(calls);

            definition.setProperties(parameterBag.resolveValue(definition.getProperties()));
        } catch (e) {
            if (e instanceof ParameterNotFoundError) {
                e.setSourceId(id);
            }
            throw e;
        }
    });

    var aliases = new JSymfony.Map();
    containerBuilder.getAliases().forEach(function (name, target) {
        aliases.set(parameterBag.resolveValue(name), parameterBag.resolveValue(target));
    });
    containerBuilder.setAliases(aliases);

    parameterBag.resolve();
};

JSymfony.DependencyInjection.Compiler.ResolveParameterPlaceHoldersPass = module.exports = ResolveParameterPlaceHoldersPass;
