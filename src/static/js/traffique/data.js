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
	this.aggregators = [];
	
	this.init(token);
}

traffique.Data.prototype.registerAggregator = function(aggregator)
{
	this.aggregators.push(aggregator);
}

traffique.Data.prototype.notifyAll_ = function(visitorInfo)
{
	// Distribute the message over all modules
	var modules = traffique.Manager.getInstance().getModules();
	for (i in modules)
	{
		modules[i].onVisitor(visitorInfo);
	}
}

traffique.Data.prototype.onMessage_ = function(json)
{
	// Parse the json (trusted source, hence unsafe parse)
	var visitorInfo = goog.json.unsafeParse(json.data);
	
	// Run all aggregators in parallel
	var nCompleted = 0;
	var total = this.aggregators.length;
	var that = this;
	for (i in this.aggregators)
	{
		this.aggregators[i].update(visitorInfo,
			function()
			{
				// Update completed counter
				nCompleted++;
				
				if (nCompleted >= total)
				{
					// All aggregators are finished => notify all modules
					that.notifyAll_(visitorInfo);
				}
			}
		);
	}
}

/**
 * @param {string} the App Engine channel-token
 */
traffique.Data.prototype.init = function(token)
{
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
	var that = this;
	socket.onmessage = function (json) { that.onMessage_(json); };
}
