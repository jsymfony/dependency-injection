/**
 * Interface that must be implemented by compilation passes
 * @interface
 */
function CompilerPassInterface() {

}

/**
 * You can modify the container here
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
CompilerPassInterface.prototype.process = function (containerBuilder) {
    throw new JSymfony.NotImplementedError(this, 'process');
};

JSymfony.DependencyInjection.Compiler.CompilerPassInterface = module.exports = CompilerPassInterface;
