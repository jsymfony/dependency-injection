var util = require('util');
var parent = JSymfony.RuntimeError;

function RuntimeError(msg, code, previous) {
    parent.call(this, msg, code, previous)
}

util.inherits(RuntimeError, parent);

JSymfony.RuntimeError = module.exports = RuntimeError;
