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
// Chart module
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.module.Chart');

goog.require('traffique.module.Module');
goog.require('traffique.Chart');
goog.require('traffique.ringBuffer');
goog.require('goog.dom');
goog.require('goog.style');

/**
 * Chart module class
 * @constructor
 * @implements {traffique.module.Module}
 */
traffique.module.Chart = function()
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
	 * A unique identifier for the Chart-module
	 * @type {String}
	 */
	this.id = 'chart';
	/**
	 * The name of the module
	 * @type {String}
	 */
	this.name = 'Chart';
	/**
	 * Icon for the module
	 * @type {{src: String, width: String, height: String}}
	 */
	this.icon = { src : '/img/icon-chart.png', width : '29px', height : '25px' };
	
	/**
	 * The chart widget
	 * @type {traffique.Chart}
	 */
	this.chart = null;
	/**
	 * History buffer
	 * @type {traffique.RingBuffer}
	 */
	this.buffer = new traffique.RingBuffer(traffique.module.Chart.bufferSize);
	this.timer = null;
	this.time = 0;
	this.visitNow = 0;
	this.active = false;
}

/** @const */ traffique.module.Chart.barWidth = 3;
/** @const */ traffique.module.Chart.barPad = 1 * 2;
/** @const */ traffique.module.Chart.interval = 500;
/** @const */ traffique.module.Chart.bufferSize = 100000 / traffique.module.Chart.interval; // 100 seconds

/**
 * Creates the chart module in the given parent element.
 * @param {Element} the parent dom-element
 */
traffique.module.Chart.prototype.create = function(parent)
{
	this.chart = new traffique.Chart(parent);
	this.visitNow = 0;
	this._inc();
}

/** @inheritDoc */
traffique.module.Chart.prototype.freeze = function()
{
	this.active = false;
}

/** @inheritDoc */
traffique.module.Chart.prototype.thaw = function()
{
	this.active = true;
	this.update();
}

/** @inheritDoc */
traffique.module.Chart.prototype.update = function()
{
	this.chart.update();
	this._projectBufferOnChart();
}

/** @inheritDoc */
traffique.module.Chart.prototype.onVisitor = function(data)
{
	this.visitNow++;
}

/**
 * Called at a regular interval by a timer to:
 *  - push the visitNow-value to the history-buffer
 *  - directly update the chart when active
 *  - reset visitNow to 0
 *  - increment the time-counter
 *  - set a new timer for the next _inc
 * @private
 */
traffique.module.Chart.prototype._inc = function()
{
	// Clear timer to ensure that we don't run twice
	clearTimeout(this.timer);
	
	if (this.active)
	{
		// Update the chart immediately if we're live
		var barCount = this.chart.getBarCount();
		var cursor = this.time % barCount;
		this.chart.set(cursor, this.visitNow);
		this.chart.setCursor((cursor + 1) % barCount);
	}
	
	// Add to history-buffer
	this.buffer.push(this.visitNow);
	
	// Start over again
	this.visitNow = 0;
	this.time++;
	
	var that = this;
	this.timer = setTimeout(function () { that._inc() }, traffique.module.Chart.interval);
}

/**
 * Fills the chart with history-buffer data. Typically called
 * when the module is thawn.
 * @private
 */
traffique.module.Chart.prototype._projectBufferOnChart = function()
{
	// Clear the old data in the chart
	this.chart.clear();
	
	// Try to get samples to fill all the bars in the chart
	var barCount = this.chart.getBarCount();
	var projection = this.buffer.getLastItems(barCount);
	
	// Fill the chart
	var c = (this.time - projection.length) % barCount;
	for (var i = 0; i < projection.length; i++)
	{
		this.chart.set(c, projection[i]);
		c = (c + 1) % barCount;
	}
	this.chart.setCursor(c);
}
