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
// Traffique entry point
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.start');

goog.require('traffique.data');
goog.require('traffique.ping');
goog.require('traffique.Manager');
goog.require('traffique.module.Map');
goog.require('traffique.module.Chart');
goog.require('traffique.tester');
goog.require('goog.events');

window.onload =
	function()
	{
		goog.events.listen(window, 'unload',
			function()
			{
				goog.events.removeAll();
			}
		);
		
		var data = new traffique.Data(CHANNEL_TOKEN);
	
		var manager = traffique.Manager.getInstance();
		manager.register(new traffique.module.Map());
		manager.register(new traffique.module.Chart());
	
		manager.init();
	
		traffique.ping.start();
		traffique.tester.start();
	};
