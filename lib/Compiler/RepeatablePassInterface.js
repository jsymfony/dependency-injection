var util = require('util');
/**
 * Interface that must be implemented by passes that are run as part of an RepeatedPass
 * @interface
 * @extends {JSymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
function RepeatablePassInterface() {

}

util.inherits(RepeatablePassInterface, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * Sets the RepeatedPass interface.
 *
 * @param {JSymfony.DependencyInjection.Compiler.RepeatedPass} repeatedPass
 */
RepeatablePassInterface.prototype.setRepeatedPass = function (repeatedPass) {};


JSymfony.DependencyInjection.Compiler.RepeatablePassInterface = module.exports = RepeatablePassInterface;
