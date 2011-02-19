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
// Module management
///////////////////////////////////////////////////////////////////////////////

goog.provide('traffique.Manager');

goog.require('traffique.easing');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.fx.Animation');
goog.require('goog.ui.KeyboardShortcutHandler');

/**
 * Constructs a new Manager. Singleton: use Manager.getInstance() to get its
 * instance.
 * @constructor
 * @private
 */
traffique.Manager = function()
{
	this.modules_ = [];
	this.activeModuleIdx_ = -1;
	this.slideAnim = null;
}

/** @const */  traffique.Manager.animationDelay = 1000;
/** @const */  traffique.Manager.instance_ = null;

/**
 * Gets its singleton instance
 * @return {traffique.Manager} a Manager instance
 */
traffique.Manager.getInstance = function()
{
	if (!traffique.Manager.instance_)
	{
		traffique.Manager.instance_ = new traffique.Manager();
	}
	
	return traffique.Manager.instance_;
}

/**
 * Registers a new module
 * @param {traffique.module.Module} a Module
 */
traffique.Manager.prototype.register = function(module)
{
	this.modules_.push(module);
}

traffique.Manager.prototype.toolbarClick_ = function(idx)
{
	this.switchTo(idx);
}

traffique.Manager.prototype.resize_ = function(idx)
{
	var activeModule = this.getActiveModule();
	if (activeModule)
	{
		activeModule.update();
	}
}

/**
 * @return {traffique.module.Module} the active module
 */
traffique.Manager.prototype.getActiveModule = function()
{
	return this.activeModuleIdx_ == -1 ? null : this.modules_[this.activeModuleIdx_];
}

/**
 * @return {Array.<traffique.module.Module>} all registered modules
 */
traffique.Manager.prototype.getModules = function()
{
	return this.modules_;
}

/**
 * @param {number} module-index to switch to
 */
traffique.Manager.prototype.switchTo = function(idx)
{
	var activeModuleIdx = this.activeModuleIdx_;
	if (activeModuleIdx != idx)
	{
		if (this.slideAnim)
		{
			this.slideAnim.stop();
		}
		
		if (idx != -1)
		{
			var newModule = this.modules_[idx];
			
			goog.style.showElement(newModule.workspace, true);
			
			if (activeModuleIdx != -1)
			{
				var oldModule = this.getActiveModule();
				var that = this;
				
				// Slide the workspace in
				this.slideAnim = new goog.fx.Animation(
											[0], [ 100],
											traffique.Manager.animationDelay,
											traffique.easing.quartInOut );
				
				if (activeModuleIdx > idx)
				{
					this.slideAnim.onAnimate = function()
					{
						newModule.workspace.style.left = Math.round(this.coords[0] - 100) + '%';
						oldModule.workspace.style.left = Math.round(this.coords[0] - 0) + '%';
					}
				}
				else
				{
					this.slideAnim.onAnimate = function()
					{
						newModule.workspace.style.left = Math.round(100 - this.coords[0]) + '%';
						oldModule.workspace.style.left = Math.round(0   - this.coords[0]) + '%';
					}
				}
				
				this.slideAnim.onBegin = function()
				{
					oldModule.freeze();
				}
				
				this.slideAnim.onEnd = function()
				{
					this.onAnimate();
					that.slideAnim = null;
					
					newModule.thaw();
					
					goog.style.showElement(oldModule.workspace, false);
				}
				
				this.slideAnim.play();
				
				goog.dom.classes.remove(oldModule.button, 'active');
			}
			else
			{
				// Just show it, since we don't have an active module
				newModule.thaw();
			}
			
			goog.dom.classes.add(newModule.button, 'active');
		}
	
		this.activeModuleIdx_ = idx;
	}
}

/**
 * Initializes the Manager. Should be called just once.
 */
traffique.Manager.prototype.init = function()
{
	var workspaces = document.getElementById('workspaces');
	var toolbar = document.getElementById('toolbar');
	var that = this;
	
	for (var i = 0; i < this.modules_.length; i++)
	{
		// Add new workspace
		var workspace = goog.dom.htmlToDocumentFragment('<div class="workspace"><div class="box"></div></div>');
		goog.style.showElement(workspace,false);
		goog.dom.append(workspaces, workspace);

		var m = this.modules_[i];
		m.workspace = workspace;
		m.create( goog.dom.getFirstElementChild(workspace) );

		// Create new button for toolbar
		var button = goog.dom.htmlToDocumentFragment('<li><a href="#"><span class="icon"></span><span class="text"></span></a></li>');
		m.button = button;
		
		// Set button text
		var buttonTextEl = goog.dom.getElementByClass('text',button);
		goog.dom.setTextContent(buttonTextEl, m.name);
		
		// Set button icon
		var iconEl = goog.dom.getElementByClass('icon',button);
		goog.style.setSize(iconEl, m.icon.width, m.icon.height);
		iconEl.style.background =  'url("' + m.icon.src + '")';
		
		// Add click handler for button
		var anchorEl = button.getElementsByTagName('a')[0];
		(function(i)
			{
				// We need  a separate scope to bind the current i-value in.
				goog.events.listen(anchorEl, goog.events.EventType.CLICK,
					function(e)
					{
						that.toolbarClick_(i);
						e.preventDefault();
					}
				);
			}
		)(i);
		
		// Add button to toolbar
		goog.dom.append(toolbar, button);
		
		m.freeze();
	}
	
	// Enable the first module
	if (this.modules_.length > 0)
	{
		this.switchTo(0);
	}
	
	// Set window resize-event-handler
	goog.events.listen(window, goog.events.EventType.RESIZE,
		function()
		{
			that.resize_();
		}
	);
	
	// Set keyboard shortcuts
	var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
	for (var i = 1; i <= this.modules_.length && i < 10; i++)
	{
		shortcutHandler.registerShortcut(String(i-1), String(i));
	}
	
	goog.events.listen(shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
		function(e)
		{
			that.switchTo(e.identifier);
		}
	);
}
