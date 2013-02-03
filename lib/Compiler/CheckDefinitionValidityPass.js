var util = require('util');
var RuntimeError = JSymfony.DependencyInjection.Error.RuntimeError;
var fn = JSymfony.fn;
var Scope = JSymfony.DependencyInjection.Scope;

/**
 * This pass validates each definition individually only taking the information
 * into account which is contained in the definition itself.
 *
 * Later passes can rely on the following, and specifically do not need to
 * perform these checks themselves:
 *
 * - non synthetic, non abstract services always have a class set
 * - synthetic services are always public
 * - synthetic services are always of non-prototype scope
 *
 * @constructor
 *
 * @implements {JSymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
function CheckDefinitionValidityPass() {

}

util.inherits(CheckDefinitionValidityPass, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * Processes the ContainerBuilder to validate the Definition.
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
CheckDefinitionValidityPass.prototype.process = function (containerBuilder) {
    containerBuilder.getDefinitions().forEach(function (id, definition) {
        if (definition.isSynthetic() && !definition.isPublic()) {
            throw new RuntimeError(fn.sprintf('A synthetic service ("%s") must be public.', id));
        }

        // synthetic service has non-prototype scope
        if (definition.isSynthetic() && definition.getScope().isPrototype()) {
            throw new RuntimeError(fn.sprintf('A synthetic service ("%s") cannot be of scope "prototype".', id));
        }

        // non-synthetic, non-abstract service has class
        if (!definition.isAbstract() && !definition.isSynthetic() && !definition.getClass()) {
            if (definition.getFactoryObject() || definition.getFactoryService()) {
                throw new RuntimeError(fn.sprintf(
                    'Please add the class to service "%s" even if it is constructed by a factory ' +
                    'since we might need to add method calls based on compile-time checks.',
                    id
                ));
            }

            throw new RuntimeError(fn.sprintf(
                'The definition for "%s" has no class. If you intend to inject ' +
                'this service dynamically at runtime, please mark it as synthetic=true. ' +
                'If this is an abstract definition solely used by child definitions, ' +
                'please add abstract=true, otherwise specify a class to get rid of this error.',
               id
            ));
        }
    });
};


JSymfony.DependencyInjection.Compiler.CheckDefinitionValidityPass = module.exports = CheckDefinitionValidityPass;
