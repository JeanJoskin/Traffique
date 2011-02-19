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

goog.provide('traffique.ringBuffer');

/**
 * Constructs a new RingBuffer
 * @param {number} the size of the RingBuffer
 * @constructor
 */
traffique.RingBuffer = function(size)
{
	this.data = new Array(size);
	this.cursor = 0;
	this.size = size;
	this.fill = 0;
}

/**
 * Pushes a new value to the RingBuffer
 * @param {*} the value to be pushed
 */
traffique.RingBuffer.prototype.push = function(x)
{
	this.data[this.cursor] = x;
	this.cursor = (this.cursor + 1) % this.size;
	if (this.fill < this.size)
	{
		this.fill++;
	}
}

/**
 * Gets the last items that were pushed on the buffer
 * @param {number} numer of items to retrieve
 * @return {Array.<*>} last n pushed items
 */
traffique.RingBuffer.prototype.getLastItems = function(n)
{
	n = Math.min(this.fill,n);
	
	var rangeStart = this.cursor - n;
	var items = this.data.slice(Math.max(rangeStart,0), this.cursor);
	
	if (rangeStart < 0 && this.fill == this.size)
	{
		items = this.data.slice(this.size + rangeStart).concat(items);
	}
	
	return items;
}
