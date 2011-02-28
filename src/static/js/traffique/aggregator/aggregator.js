goog.provide('traffique.aggregator.Aggregator');

/**
 * A Traffique aggregator
 * @interface
 */
traffique.aggregator.Aggregator = function() {};

/**
 * Adds extra information to the visitor-information, which can
 * be used by one or more modules.
 */
traffique.aggregator.Aggregator.prototype.update = function(visitor, callback) {};
