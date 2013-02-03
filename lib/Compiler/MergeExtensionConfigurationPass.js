var util = require('util');

function MergeExtensionConfigurationPass() {

}

util.inherits(MergeExtensionConfigurationPass, JSymfony.DependencyInjection.Compiler.CompilerPassInterface);

/**
 * @param {JSymfony.DependencyInjection.ContainerBuilder} containerBuilder
 */
MergeExtensionConfigurationPass.prototype.process = function (containerBuilder) {
    var parameters = containerBuilder.getParameterBag().all();
    var definitions = containerBuilder.getDefinitions();
    var aliases = containerBuilder.getAliases();

    containerBuilder.getExtensions().forEach(function (name, extension) {
        var config = containerBuilder.getExtensionConfig(name);
        config = containerBuilder.getParameterBag().resolveValue(config);

        var tmpContainerBuilder = new JSymfony.DependencyInjection.ContainerBuilder(containerBuilder.getParameterBag(), containerBuilder.getScope());
        tmpContainerBuilder.setContainer(containerBuilder.getContainer());
        extension.load(config, tmpContainerBuilder);
        containerBuilder.merge(tmpContainerBuilder);
    });

    containerBuilder.addDefinitions(definitions);
    containerBuilder.addAliases(aliases);
    containerBuilder.getParameterBag().add(parameters);
};

JSymfony.DependencyInjection.Compiler.MergeExtensionConfigurationPass = module.exports = MergeExtensionConfigurationPass;
