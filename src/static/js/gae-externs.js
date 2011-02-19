/**
 * @externs
 */

/**
 * Suppresses the compiler warning when multiple externs files declare the
 * goog namespace.
 * @suppress {duplicate}
*/
var goog = {};

goog.appengine = {};

/**
 * @constructor
 */
goog.appengine.Channel = function(token) {};
/**
 * @return {goog.appengine.Socket}
 */
goog.appengine.Channel.prototype.open = function(optional_handler) {};
/**
 * @return {goog.appengine.Socket}
 */
goog.appengine.Socket = function() {};

goog.appengine.Socket.prototype.onopen;
goog.appengine.Socket.prototype.onclose;
goog.appengine.Socket.prototype.onmessage;
goog.appengine.Socket.prototype.onerror;
