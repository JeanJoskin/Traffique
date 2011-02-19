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

goog.provide('traffique.ping');

goog.require('goog.net.XhrIo');

/** @const */ traffique.ping.interval = 4 * 60 * 1000;  // 4 minutes
/** @const */ traffique.ping.retryInterval = 5000;  // 5 seconds
traffique.ping.xhr = null;
traffique.ping.timer = null;

traffique.ping.start = function()
{
	clearTimeout(traffique.ping.timer);
	traffique.ping.xhr = new goog.net.XhrIo();
	traffique.ping.xhr.setTimeoutInterval(5000);
	traffique.ping.timer = setTimeout(traffique.ping.ping_, traffique.ping.interval);
	
	goog.events.listen(traffique.ping.xhr, goog.net.EventType.SUCCESS, 
		traffique.ping.pingSuccess_);
	goog.events.listen(traffique.ping.xhr, goog.net.EventType.ERROR, 
		traffique.ping.pingFail_);
}

traffique.ping.stop = function()
{
	clearTimeout(traffique.ping.timer);
}

traffique.ping.pingSuccess_ = function()
{
	clearTimeout(traffique.ping.timer);
	traffique.ping.timer = setTimeout(traffique.ping.ping_, traffique.ping.interval);
}

traffique.ping.pingFail_ = function()
{
	// Network problems. Wait. Then try again.
	// E.g. if a laptop is waking, the ping is immediately sent, when using a
	// wireless connection, the connection is often not established yet.
	clearTimeout(traffique.ping.timer);
	traffique.ping.timer = setTimeout(traffique.ping.ping_, traffique.ping.retryInterval);
}

traffique.ping.ping_ = function()
{
	clearTimeout(traffique.ping.timer);
	traffique.ping.xhr.send('/ping?s=' + SESSION_ID);
}
