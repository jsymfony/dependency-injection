var _ = require('lodash');

var Compiler = JSymfony.DependencyInjection.Compiler;
var InvalidArgumentError = JSymfony.DependencyInjection.Error.InvalidArgumentError;

/**
 * Compiler Pass Configuration
 *
 * This class has a default configuration embedded
 *
 * @constructor
 */
function PassConfig() {
    this._mergePass = new Compiler.MergeExtensionConfigurationPass();

    this._beforeOptimizationPasses = [];

    this._optimizationPasses = [
        //new Compiler.ResolveDefinitionTemplatesPass(),
        new Compiler.ResolveParameterPlaceHoldersPass(),
        new Compiler.CheckDefinitionValidityPass(),
        new Compiler.ResolveReferencesToAliasesPass(),
        new Compiler.ResolveInvalidReferencesPass(),
        new Compiler.AnalyzeServiceReferencesPass(true)
//        new Compiler.CheckCircularReferencesPass(),
//        new Compiler.CheckReferenceValidityPass()
    ];

    this._beforeRemovingPasses = [];

    this._removingPasses = [
//        new Compiler.RemovePrivateAliasesPass(),
//        new Compiler.RemoveAbstractDefinitionsPass(),
//        new Compiler.ReplaceAliasByActualDefinitionPass(),
//        new Compiler.RepeatedPass(array(
//            new Compiler.AnalyzeServiceReferencesPass(),
//            new Compiler.InlineServiceDefinitionsPass(),
//            new Compiler.AnalyzeServiceReferencesPass(),
//            new Compiler.RemoveUnusedDefinitionsPass()
//        )),
//        new Compiler.CheckExceptionOnInvalidReferenceBehaviorPass()
    ];

    this._afterRemovingPasses = [];
}

PassConfig.TYPE_AFTER_REMOVING = PassConfig.prototype.TYPE_AFTER_REMOVING = 'afterRemoving';
PassConfig.TYPE_BEFORE_OPTIMIZATION = PassConfig.prototype.TYPE_BEFORE_OPTIMIZATION = 'beforeOptimization';
PassConfig.TYPE_BEFORE_REMOVING = PassConfig.prototype.TYPE_BEFORE_REMOVING = 'beforeRemoving';
PassConfig.TYPE_OPTIMIZE = PassConfig.prototype.TYPE_OPTIMIZE = 'optimization';
PassConfig.TYPE_REMOVE = PassConfig.prototype.TYPE_REMOVE = 'removing';



/**
 * Returns all passes in order to be processed.
 *
 * @return {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} An array of all passes to process
 */
PassConfig.prototype.getPasses = function() {
    return [this._mergePass]
        .concat(this._beforeOptimizationPasses)
        .concat(this._optimizationPasses)
        .concat(this._beforeRemovingPasses)
        .concat(this._removingPasses)
        .concat(this._afterRemovingPasses)
    ;
};

/**
 *
 * @param {JSymfony.DependencyInjection.Compiler.CompilerPassInterface} pass
 * @param {string} type
 */
PassConfig.prototype.addPass = function (pass, type) {
    type = type || PassConfig.TYPE_BEFORE_OPTIMIZATION;
    var prop = '_' + type + 'Passes';
    if (!this.hasOwnProperty(prop)) {
        throw new InvalidArgumentError('Invalid type "' + type + '"');
    }

    this[prop].push(pass);
};

/**
 * Gets all passes for the AfterRemoving pass.
 *
 * @return {Array}
 */
PassConfig.prototype.getAfterRemovingPasses = function () {
    return this._afterRemovingPasses;
};


/**
 * Gets all passes for the BeforeOptimization pass.
 *
 * @return {Array}
 */
PassConfig.prototype.getBeforeOptimizationPasses = function () {
    return this._beforeOptimizationPasses;
};

/**
 * Gets all passes for the BeforeRemoving pass.
 *
 * @return {Array}
 */
PassConfig.prototype.getBeforeRemovingPasses = function () {
    return this._beforeRemovingPasses;
};

/**
 * Gets all passes for the Optimization pass.
 *
 * @return {Array}
 */
PassConfig.prototype.getOptimizationPasses = function () {
    return this._optimizationPasses;
};

/**
 * Gets all passes for the Removing pass.
 * @return {Array}
 */
PassConfig.prototype.getRemovingPasses = function () {
    return this._removingPasses;
};

/**
 * Gets all passes for the Merge pass.
 *
 * @return {JSymfony.DependencyInjection.Compiler.CompilerPassInterface}
 */
PassConfig.prototype.getMergePass = function () {
    return this._mergePass;
};

/**
 * Sets the Merge Pass.
 *
 * @param {JSymfony.DependencyInjection.Compiler.CompilerPassInterface} mergePass
 */
PassConfig.prototype.setMergePass = function (mergePass) {
    this._mergePass = mergePass;
};


/**
 * Sets the AfterRemoving passes.
 *
 * @param {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} passes
 */
PassConfig.prototype.setAfterRemovingPasses = function (passes) {
    this._afterRemovingPasses = passes;
};


/**
 * Sets the BeforeOptimization passes.
 *
 * @param {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} passes
 */
PassConfig.prototype.setBeforeOptimizationPasses = function (passes) {
    this._beforeOptimizationPasses = passes;
};

/**
 * Sets the BeforeRemoving passes.
 *
 * @param {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} passes
 */
PassConfig.prototype.setBeforeRemoving = function (passes) {
    this._beforeRemovingPasses = passes;
};


/**
 * Sets the Optimization passes.
 *
 * @param {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} passes
 */
PassConfig.prototype.setOptimizationPasses = function (passes) {
    this._optimizationPasses = passes;
};

/**
 * Sets the Removing passes.
 *
 * @param {Array.<JSymfony.DependencyInjection.Compiler.CompilerPassInterface>} passes
 */
PassConfig.prototype.setRemovingPasses = function (passes) {
    this._removingPasses = passes;
};

JSymfony.DependencyInjection.Compiler.PassConfig = module.exports = PassConfig;
