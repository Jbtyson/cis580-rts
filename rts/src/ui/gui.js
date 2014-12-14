// Gui.js
// James Tyson
var Gui = function(game) {
	this.game = game;
	
	this.minimap = new Minimap();
	this.commandPanel = new CommandPanel();
	this.resourceBar = new ResourceBar(this.game.playerResources);
	this.unitBar = new UnitBar();
	this.unitPortrait = new UnitPortrait();
	this.timer = new Timer();
	
	// Add each panel to the list of hitboxes
	this.hitboxes = [];
	this.hitboxes.push(this.minimap.hitbox);
	this.hitboxes.push(this.commandPanel.hitbox);
	this.hitboxes.push(this.resourceBar.hitbox);
	this.hitboxes.push(this.unitBar.hitbox);
	this.hitboxes.push(this.unitPortrait.hitbox);
	this.hitboxes.push(this.timer.hitbox);
}

Gui.prototype = {
	// Update the gui
	update: function(gameTime) {
		// Update the minimap
		this.minimap.update(gameTime);
		
		// Update the commandPanel
		this.commandPanel.update(gameTime, this.game.selectedUnits[0], this.game.selectedBuildings[0]);
		
		// Update the resourceBar
		this.resourceBar.update(gameTime);
		
		// Update the unitBar
		this.unitBar.update(gameTime, this.game.selectedUnits);
		
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
	
	// Returns if the mouse click that just occurred, occured on the ui
	isClickOnUi: function(mousePos) {
		this.hitboxes.foreach(function(hitbox) {
			if(rectangle.contains(mousePos.x, mousePos.y))
				return true;
		});
		return false;
	},
}