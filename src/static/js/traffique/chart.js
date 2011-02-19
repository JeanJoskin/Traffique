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
// Chart widget
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.Chart');

goog.require('goog.dom.classes');
goog.require('goog.math');
goog.require('goog.dom');
goog.require('goog.style');

/**
 * @constructor
 * @param {Element} parent element of the Chart
 */
traffique.Chart = function(parent)
{
	this.elem = null;
	this.barsElem = null;
	this.cursor = 0;
	this.barElems = null;
	this.valueElems = null;
	this.maxValue = 10;
	this.values = null;
	
	this.init_(parent);
}

/** @const */ traffique.Chart.barWidth = 3;
/** @const */ traffique.Chart.barPad = 1 * 2;

/**
 * @private
 * @param {Element} parent element of the Chart
 */
traffique.Chart.prototype.init_ = function(parent)
{
	var inner = goog.dom.htmlToDocumentFragment('<div class="chart"><div class="bars"></div></div>');
	goog.dom.append(parent, inner);
	
	this.elem = inner;
	this.barsElem = goog.dom.getFirstElementChild(inner);
	
	this.update();
}

traffique.Chart.prototype.update = function()
{
	var dimensions = goog.style.getContentBoxSize(this.barsElem);
	var width = dimensions.width;
	var nBar = Math.floor(width / (traffique.Chart.barWidth + traffique.Chart.barPad));
	
	if (!nBar)
	{
		nBar = 0;
	}

	var html = '';
	for (var i = 0; i < nBar; i++)
	{
		html += '<div class="bar"><div class="value"></div></div>';
	}
	this.barsElem.innerHTML = html;
	
	this.barElems = goog.dom.getElementsByClass('bar',this.barsElem);
	this.valueElems = goog.dom.getElementsByClass('value',this.barsElem);
	
	for (var i = 0; i < this.barElems.length; i++)
	{
		goog.style.setWidth(this.barElems[i], traffique.Chart.barWidth);
	}

	this.values = new Array(nBar);
	this.cursor = 0;	
}

traffique.Chart.prototype.clear = function()
{
	var barCount = this.getBarCount();
	for (var i = 0; i < barCount; i++)
	{
		this.set(i,0);
	}
}

traffique.Chart.prototype.addAll = function(values,startX)
{
	var c = startX;
	var barCount = this.getBarCount();
	
	var max = 10;
	for (var i = 0; i < values.length; i++)
	{
		if (max > values[i])
		{
			max = values[i];
		}
	}
	this.setMaxValue(max);
	
	for (var i = 0; i < values.length; i++)
	{
		this.set(c,values[i]);
		c = (c + 1) % barCount;
	}
	this.setCursor(c);
}
		
traffique.Chart.prototype.set = function(x,y,noRescale)
{
	if (!noRescale && y > this.maxValue)
	{
		this.setMaxValue(y);
	}
	
	var h = Math.floor(Math.min(100, (y / this.maxValue) * 100));
	var valueElem = this.valueElems[x];
	goog.style.setHeight(valueElem, h + '%');
	this.values[x] = y;
}

traffique.Chart.prototype.setCursor = function(x)
{
	goog.dom.classes.remove(this._cursorDiv(),'cursor');
	this.cursor = x;
	this.set(x, 0);
	goog.dom.classes.add(this._cursorDiv(),'cursor');
}

traffique.Chart.prototype.getBarCount = function()
{
	return this.barElems.length;
}

traffique.Chart.prototype.setMaxValue = function(maxValue)
{
	this.maxValue = maxValue;
	for (var i = 0; i < this.bars.length; i++)
	{
		this.set(i,this.values[i]);
	}
}

/**
 * @private
 */
traffique.Chart.prototype._cursorDiv = function()
{
	return this.barElems[this.cursor];
}

/**
 * @private
 */
traffique.Chart.prototype._cursorInc = function()
{
	this.setCursor( (this.cursor + 1) % this.bars.length );
}
