var fn = JSymfony.fn;

/**
 * Provides useful features shared by many extensions
 *
 * @constructor
 *
 * @implements JSymfony.DependencyInjection.Extension.ExtensionInterface
 * @implements JSymfony.DependencyInjection.Extension.ConfigurationExtensionInterface
 */
function Extension() {

}

Extension.prototype.load = function (configs, container) {
    throw new JSymfony.Error('Not implemented');
};

/**
 * Returns the recommended alias to use in config files
 *
 * This convention is to remove the "Extension" postfix from the class
 * name and then lowercase and underscore the result.
 *
 * Example: AcmeHelloExtension -> acme_hello
 *
 * This can be overridden in a sub-class to specify the alias manually
 *
 * @return {string} The alias
 *
 * @throws JSymfony.BadMethodCallError When the extension name does not follow conventions
 */
Extension.prototype.getAlias = function () {
    var className = this.constructor.name;
    if (className.slice(-9) != 'Extension') {
        throw new JSymfony.BadMethodCallError('Extension "' + className + '" does not follow the naming convention "zzzExtension"; you must overwrite the getAlias() method.');
    }

    return fn.camelCaseToUnderscore(className.slice(0, -9));
};

/**
 * Processes configs with configuration
 * @param {JSymfony.Config.Definition.ConfigurationInterface} configuration
 * @param {Array} configs
 * @return {Object} The processed configuration
 */
Extension.prototype.processConfiguration = function (configuration, configs) {
    var processor = new JSymfony.Config.Definition.Processor();
    return processor.processConfiguration(configuration, configs);
};

/**
 * @inheritDoc
 */
Extension.prototype.getConfiguration = function () {
    var DI = this.constructor.__autoload.getParent();

    if (!DI) {
        throw new JSymfony.RuntimeError('Invalid extension "' + this.constructor.name + '"');
    }

    var Configuration = DI.Configuration;

    if (Configuration) {
        return new Configuration();
    }
    throw new JSymfony.RuntimeError('Configuration for "' + this.constructor.name + '" not found');
};

JSymfony.DependencyInjection.Extension.Extension = module.exports = Extension;
