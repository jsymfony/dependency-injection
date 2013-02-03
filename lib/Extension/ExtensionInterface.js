/**
 * @interface
 */
function ExtensionInterface() {

}

/**
 * Loads a specific configuration.
 *
 * @param {Array} config An array of configuration values
 * @param {JSymfony.DependencyInjection.ContainerBuilder} container A ContainerBuilder instance
 */
ExtensionInterface.prototype.load = function (config, container) {};

/**
 * Returns the alias to use in config files
 * @return {string} The alias
 */
ExtensionInterface.prototype.getAlias = function () {};

JSymfony.DependencyInjection.Extension.ExtensionInterface = module.exports = ExtensionInterface;
