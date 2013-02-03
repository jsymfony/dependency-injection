require('../index.js');

var containerBuilder = new JSymfony.DependencyInjection.ContainerBuilder();
var locator = new JSymfony.Config.FileLocator(__dirname + '/config');
var loader = new JSymfony.DependencyInjection.Loader.YamlFileLoader(containerBuilder, locator);

loader.load('services.yml');

var container = containerBuilder.getContainer();

console.log(container.getParameter('test'));
console.log(container.get('test_service').constructor.name);