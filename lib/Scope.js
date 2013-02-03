var DI = JSymfony.DependencyInjection;

function Scope(name) {
    this._name = name ? name.toString().toLowerCase() : Scope.SCOPE_TOP;
    this._parent = null;
    this._children = new JSymfony.Map();
}

Scope.SCOPE_TOP = 'top';
Scope.SCOPE_PROTOTYPE = 'prototype';

Scope.prototype.getParent = function () {
    return this._parent;
};

Scope.prototype.setParent = function (parent) {
    this._parent = parent || null;
};

Scope.prototype.getChildren = function () {
    return this._children;
};

Scope.prototype.addChild = function (children) {
    this._children.set(children.getName(), children);
    children.setParent(this);
};

Scope.prototype.getChild = function (name) {
    if (!this.hasChild(name)) {
        throw new DI.Error.InvalidArgumentError('Child scope "' + name + '" not found in "' + this.getFullName() + '"');
    }
    return this._children.get(name);
};

Scope.prototype.hasChild = function (name) {
    return this._children.has(name);
};

Scope.prototype.isTop = function () {
    return this._name == Scope.SCOPE_TOP;
};

Scope.prototype.isPrototype = function () {
    return this._name == Scope.SCOPE_PROTOTYPE;
};

Scope.prototype.getName = function () {
    return this._name;
};

Scope.prototype.isEqual = function (scope) {
    return this._name == scope.getName();
};

Scope.prototype.hasParent = function () {
    return this._parent !== null;
};

Scope.prototype.getFullName = function () {
    var name = this._name;
    if (this.hasParent()) {
        name = this.getParent() + '.' + name;
    }
    return name;
};

JSymfony.DependencyInjection.Scope = module.exports = Scope;
