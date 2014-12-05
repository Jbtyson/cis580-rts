// Gui.js
var Gui = function() {
	this.minimap = new Minimap();
	this.commandPanel = new CommandPanel();
	this.resourceBar = new ResourceBar();
	this.unitBar = new UnitBar();
	this.unitPortrait = new UnitPortrait();
}

Gui.prototype = {
	update: function(gameTime) {
		// Update the minimap
		this.minimap.update(gameTime);
		
		// Update the commandPanel
		this.commandPanel.update(gameTime);
		
		// Update the resourceBar
		this.resourceBar.update(gameTime);
		
		// Update the unitBar
		this.unitBar.update(gameTime);
		
		// Update the unitPortrait
		this.unitPortrait.update(gameTime);
	},
	
	render: function(context) {
		// Update the minimap
		this.minimap.render(context);
		
		// Update the commandPanel
		this.commandPanel.render(context);
		
		// Update the resourceBar
		this.resourceBar.render(context);
		
		// Update the unitBar
		this.unitBar.render(context);
		
		// Update the unitPortrait
		this.unitPortrait.render(context);
	},
}