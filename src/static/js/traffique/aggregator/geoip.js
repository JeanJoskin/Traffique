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
// Map module
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.aggregator.GeoIp');

goog.require('traffique.aggregator.Aggregator');
goog.require('goog.net.Jsonp');

/**
 * GeoIp aggregator class
 * @constructor
 * @implements {traffique.aggregator.Aggregator}
 */
traffique.aggregator.GeoIp = function()
{
}

/** @inheritDoc */
traffique.aggregator.GeoIp.prototype.update = function(visitorInfo, callback)
{
	var uri = 'http://api.ipinfodb.com/v2/ip_query.php';
	var payload = {
		'key' : IPINFO_API_KEY,
		'ip' : visitorInfo['i'],
		'output' : 'json',
		'timezone' : 'false'
	};
	
	var request = new goog.net.Jsonp(uri);
	
	request.send(
		payload,
		function(data)
		{
			visitorInfo['lat'] = data['Latitude'];
			visitorInfo['lon'] = data['Longitude'];
			callback();
		}
	);
}
