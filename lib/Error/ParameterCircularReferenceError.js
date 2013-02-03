//notFinished
var util = require('util');
var parent = JSymfony.Error;

function ParameterCircularReferenceError(parameters) {
    parent.call(this, fn.sprintf('Circular reference detected for parameter "%s" ("%s" > "%s").', parameters[0], parameters.join('" > "'), parameters[0]))
}

util.inherits(ParameterCircularReferenceError, parent);

ParameterCircularReferenceError.prototype.message = 'Circular reference detected for parameter';
ParameterCircularReferenceError.prototype.name = 'ParameterCircularReferenceError';

JSymfony.DependencyInjection.ParameterCircularReferenceError = module.exports = ParameterCircularReferenceError;
