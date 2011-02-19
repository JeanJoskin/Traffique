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

goog.provide('traffique.tester');

goog.require('goog.net.XhrIo');
goog.require('goog.ui.KeyboardShortcutHandler');

traffique.tester.xhrIo = null;

traffique.tester.start = function()
{
	traffique.tester.xhrIo = new goog.net.XhrIo();
	
	var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
	shortcutHandler.registerShortcut('t', 't');
	
	goog.events.listen(shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
		 traffique.tester.doTest);
}

traffique.tester.doTest = function()
{
	traffique.tester.xhrIo.send('/t.gif');
}
