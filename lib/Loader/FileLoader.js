var util = require('util');

var BaseFileLoader = JSymfony.Config.Loader.FileLoader;

/**
 * FileLoader is the abstract class used by all built-in loaders that are file based.
 *
 * @abstract
 * @constructor
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 * @param {JSymfony.Config.FileLocatorInterface} locator
 *
 * @extends {JSymfony.Config.Loader.FileLoader}
 */
function FileLoader(containerBuilder, locator) {
    this._containerBuilder = containerBuilder;
    BaseFileLoader.call(this, locator);
}

util.inherits(FileLoader, BaseFileLoader);

JSymfony.DependencyInjection.Loader.FileLoader = module.exports = FileLoader;
