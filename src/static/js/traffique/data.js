/*
 * Traffique: live visitor statistics on App Engine
 * Copyright (C) 2011 Jean Joskin <jeanjoskin.com>
 *
 * Traffique is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Traffique is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Traffique. If not, see <http://www.gnu.org/licenses/>.
 */

///////////////////////////////////////////////////////////////////////////////
// Data aquisition
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.data');

goog.require('traffique.Manager');
goog.require('goog.json');

/**
 * @constructor
 */
traffique.Data = function(token)
{
	this.init(token);
}

traffique.Data.onMessage = function(msgJson)
{
	// Parse the json (trusted source, hence unsafe)
	var msg = goog.json.unsafeParse(msgJson.data);
	
	// Distribute the message over all modules
	var modules = traffique.Manager.getInstance().getModules();
	for (i in modules)
	{
		modules[i].onVisitor(msg);
	}
}

/**
 * @param {string} the App Engine channel-token
 */
traffique.Data.prototype.init = function(token)
{
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
	socket.onmessage = traffique.Data.onMessage;
}
