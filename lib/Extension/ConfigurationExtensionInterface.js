/**
 * ConfigurationExtensionInterface is the interface implemented by container extension classes.
 *
 * @interface
 */
function ConfigurationExtensionInterface() {

}

/**
 * Returns extension configuration
 *
 * @param {Array} config An array of configuration values
 * @param {JSymfony.DependencyInjection.ContainerBuilder} container A ContainerBuilder instance
 *
 * @return {JSymfony.Config.Definition.ConfigurationInterface?} The configuration or null
 */
ConfigurationExtensionInterface.prototype.getConfiguration = function (config, container) {};

JSymfony.DependencyInjection.Extension.ConfigurationExtensionInterface = module.exports = ConfigurationExtensionInterface;
