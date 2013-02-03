var util = require('util');
var parent = JSymfony.OutOfBoundsError;

function OutOfBoundsError(message) {
    parent.call(this, message)
}

util.inherits(OutOfBoundsError, parent);

JSymfony.DependencyInjection.Error.OutOfBoundsError = module.exports = OutOfBoundsError;
