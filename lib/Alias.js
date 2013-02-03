/**
 * Alias
 *
 * @param {string} id
 * @param {boolean} isPublic
 * @constructor
 */
function Alias(id, isPublic) {
    this._id = id.toLowerCase();
    this._public = typeof isPublic === 'undefined' || isPublic;
}

/**
 * Checks if this DI Alias should be public or not.
 *
 * @return {boolean}
 */
Alias.prototype.isPublic = function () {
    return this._public;
};

/**
 *
 * Sets if this Alias is public.
 *
 * @param {boolean} bool
 */
Alias.prototype.setPublic = function (bool) {
    this._public = !!bool;
};

/**
 * Returns the Id of this alias.
 *
 * @return {string}
 */
Alias.prototype.toString = function () {
    return this._id;
};

JSymfony.DependencyInjection.Alias = module.exports = Alias;
