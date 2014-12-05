// Gui.js
// James Tyson
var Gui = function(game) {
	this.game = game;
	
	this.minimap = new Minimap();
	this.commandPanel = new CommandPanel();
	this.resourceBar = new ResourceBar();
	this.unitBar = new UnitBar();
	this.unitPortrait = new UnitPortrait();
	this.timer = new Timer();
}

Gui.prototype = {
	// Update the gui
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
		
		// Update the timer
		this.timer.update(gameTime);
	},
	
	// Render the gui
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
		
		//Update the timer
		this.timer.render(context);
	},
}