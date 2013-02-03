require('js-yaml');

var fs = require('fs');
var path = require('path');
var util = require('util');
var DI = JSymfony.DependencyInjection;
var debug = require('debug')('JSymfony.DependencyInjection.Loader.YamlFileLoader');

function YamlFileLoader(containerBuilder, locator) {
    DI.Loader.JsFileLoader.apply(this, Array.prototype.slice.call(arguments));
}

util.inherits(YamlFileLoader, DI.Loader.JsFileLoader);

YamlFileLoader.prototype.supports = function (file, type) {
    if (typeof file !== 'string') {
        return false;
    }
    var ext = path.extname(file);
    return  ext === '.yml' || ext === '.yaml';
};

JSymfony.DependencyInjection.Loader.YamlFileLoader = module.exports = YamlFileLoader;
