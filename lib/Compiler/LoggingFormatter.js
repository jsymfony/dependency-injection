var CompilerPassInterface = JSymfony.DependencyInjection.Compiler.CompilerPassInterface;
var fn = JSymfony.fn;
/**
 * Used to format logging messages during the compilation.
 *
 * @constructor
 */
function LoggingFormatter() {

}

LoggingFormatter.prototype.formatRemoveService = function(pass, id, reason) {
    return this.format(pass, fn.sprintf('Removed service "%s"; reason: %s', id, reason));
};

LoggingFormatter.prototype.formatInlineService = function(pass, id, target) {
    return this.format(pass, fn.sprintf('Inlined service "%s" to "%s".', id, target));
};

LoggingFormatter.prototype.formatUpdateReference = function(pass, serviceId, oldDestId, newDestId) {
    return this.format(pass, fn.sprintf('Changed reference of service "%s" previously pointing to "%s" to "%s".', serviceId, oldDestId, newDestId));
};

LoggingFormatter.prototype.formatResolveInheritance = function(pass, childId, parentId) {
    return this.format(pass, fn.sprintf('Resolving inheritance for "%s" (parent: %s).', childId, parentId));
};

LoggingFormatter.prototype.format = function(pass, message) {
    return fn.sprintf('%s: %s', pass.constructor.name, message);
};

JSymfony.DependencyInjection.Compiler.LoggingFormatter = module.exports = LoggingFormatter;
