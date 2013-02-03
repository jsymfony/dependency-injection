var util = require('util');
var parent = JSymfony.InvalidArgumentError;

function InvalidArgumentError(message) {
    parent.call(this, message)
}

util.inherits(InvalidArgumentError, parent);

JSymfony.DependencyInjection.Error.InvalidArgumentError = module.exports = InvalidArgumentError;
