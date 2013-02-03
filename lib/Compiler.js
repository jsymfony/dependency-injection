var PassConfig = JSymfony.DependencyInjection.Compiler.PassConfig;

/**
 * @constructor
 */
function Compiler() {
    this._passConfig = new PassConfig();
    this._serviceReferenceGraph = new JSymfony.DependencyInjection.Compiler.ServiceReferenceGraph();
    this._loggingFormatter = new JSymfony.DependencyInjection.Compiler.LoggingFormatter();
    this._log = [];
}

/**
 * Returns the PassConfig
 *
 * @return {JSymfony.DependencyInjection.Compiler.PassConfig?} The PassConfig instance
 */
Compiler.prototype.getPassConfig = function () {
    return this._passConfig;
};

/**
 * Returns the ServiceReferenceGraph.
 *
 * @return {JSymfony.DependencyInjection.Compiler.ServiceReferenceGraph}
 */
Compiler.prototype.getServiceReferenceGraph = function () {
    return this._serviceReferenceGraph;
};

/**
 * Returns the logging formatter which can be used by compilation passes.
 *
 * @return {JSymfony.DependencyInjection.Compiler.LoggingFormatter}
 */
Compiler.prototype.getLoggingFormatter = function () {
    return this._loggingFormatter;
};

/**
 * Adds a pass to the PassConfig
 *
 * @param {JSymfony.DependencyInjection.Compiler.CompilerPassInterface} pass
 * @param {string} type The type of the pass
 */
Compiler.prototype.addPass = function (pass, type) {
    this._passConfig.addPass(pass, type || PassConfig.TYPE_BEFORE_OPTIMIZATION);
};

/**
 * Adds a log message
 * @param string
 */
Compiler.prototype.addLogMessage = function (string) {
    this._log.push(string);
};

/**
 * Returns the log
 *
 * @return {Array.<string>}
 */
Compiler.prototype.getLog = function () {
    return this._log;
};

/**
 * Run the Compiler and process all Passes.
 *
 * @param {JSymfony.DependencyInjection.ContainerBuilder} container
 */
Compiler.prototype.compile = function (container) {
    this._passConfig.getPasses().forEach(function (pass) {
        pass.process(container);
    });
};

JSymfony.DependencyInjection.Compiler = module.exports = Compiler;
