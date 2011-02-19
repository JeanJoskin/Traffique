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

goog.provide('traffique.module.Map');

goog.require('traffique.module.Module');
goog.require('goog.net.Jsonp');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');

/**
 * Map module class
 * @constructor
 * @implements {traffique.module.Module}
 */
traffique.module.Map = function()
{
	/**
	 * The workspace DOM element that contains Map
	 * @type {Element}
	 */
	this.workspace = null;
	/**
	 * DOM element that the toolbar button
	 * @type {Element}
	 */
	this.button = null;
	/**
	 * A unique identifier for the Map-module
	 * @type {String}
	 */
	this.id = 'map';
	/**
	 * The name of the module
	 * @type {String}
	 */
	this.name = 'Map';
	/**
	 * Icon for the module
	 * @type {{src: String, width: String, height: String}}
	 */
	this.icon = { 'src' : '/img/icon-map.png', 'width' : '26px', 'height' : '23px' };
	/**
	 * Google map object
	 * @type {google.maps.Map}
	 */
	this.gmap = null;
	/**
	 * Indicates whether we're the active module
	 * @type {boolean}
	 */
	this.active = false;
	/**
	 * Queue of markers on the map
	 * @type {Array.<google.maps.Marker>}
	 */
	this.markers = [];
}

/** @const */ traffique.module.Map.maxMarker = 50;
/** @const */ traffique.module.Map.markerImage = new google.maps.MarkerImage('/img/marker-red.png');

traffique.module.Map.prototype.create = function(parent)
{
	var options =
	{
		'zoom': 4,
		'center': new google.maps.LatLng(50, 0),
		'mapTypeId': google.maps.MapTypeId.ROADMAP,
		'backgroundColor': '#f5f5f5'
    };

	var mapEl = goog.dom.htmlToDocumentFragment('<div class="map"></div>');
	goog.dom.append(parent, mapEl);

	this.gmap = new google.maps.Map(mapEl, options);
}

/** @inheritDoc */
traffique.module.Map.prototype.update = function()
{
	google.maps.event.trigger(this.gmap, 'resize');
}

/** @inheritDoc */
traffique.module.Map.prototype.freeze = function()
{
}

/** @inheritDoc */
traffique.module.Map.prototype.thaw = function()
{
	this.update();
}

/**
 * Adds a new marker to the map given the geo-ip information
 * @param {*} JSON message returned by the Geo-IP server
 * @private
 */
traffique.module.Map.prototype.addMarker_ = function(data)
{
	var latLng = new google.maps.LatLng(data['Latitude'], data['Longitude']);
	
	this.markers.push( new google.maps.Marker({
		'map' : this.gmap,
		'animation' : google.maps.Animation.DROP,
		'position' : latLng,
		'icon' : traffique.module.Map.markerImage
	}) );
	
	this.gmap.panTo(latLng);
	
	while (this.markers.length > traffique.module.Map.maxMarker)
	{
		var m = this.markers.pop();
		m.setMap(null);
	}
}

/** @inheritDoc */
traffique.module.Map.prototype.onVisitor = function(data)
{
	var uri = 'http://api.ipinfodb.com/v2/ip_query.php';
	var payload = {
		'key' : IPINFO_API_KEY,
		'ip' : data['i'],
		'output' : 'json',
		'timezone' : 'false'
	};
	
	var request = new goog.net.Jsonp(uri);
	
	var that = this;
	request.send(
		payload,
		function(data)
		{
			that.addMarker_(data);
		}
	);
}