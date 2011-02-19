goog.provide('traffique.module.Module');

/**
 * A Traffique module
 * @interface
 */
traffique.module.Module = function() {};

/**
 * Updates the module's visual representation
 */
traffique.module.Module.prototype.update = function() {};

/**
 * Freezes the module's visual representation
 */
traffique.module.Module.prototype.freeze = function() {};

/**
 * Thaws the module's visual representation
 */
traffique.module.Module.prototype.thaw = function() {};

/**
 * Notifies a module of a new visitor
 * @param {{i: string}} Visitor information where i = IP address.
 */
traffique.module.Module.prototype.onVisitor = function(data) {};
