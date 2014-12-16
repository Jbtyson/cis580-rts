// Gui.js
// James Tyson
var Gui = function(game) {
	this.game = game;
	
	this.minimap = new Minimap();
	this.commandPanel = new CommandPanel();
	this.resourceBar = new ResourceBar(0); // ResourceBar takes playerIndes as argument
	this.unitBar = new UnitBar();
	this.unitPortrait = new UnitPortrait();
	this.timer = new Timer();
	
	// Add each static panel to the list of hitboxes
	this.hitboxes = [];
	this.hitboxes.push(this.minimap.hitbox);
	this.hitboxes.push(this.commandPanel.hitbox);
	this.hitboxes.push(this.resourceBar.hitbox);
	this.hitboxes.push(this.unitBar.hitbox);
	this.hitboxes.push(this.unitPortrait.hitbox);
	this.hitboxes.push(this.timer.hitbox);
	
	// tool tip things
	this.tooltip = new Tooltip(this);
}

Gui.prototype = {
	// Update the gui
	update: function(gameTime) {
		var self = this;
		
		// Update the minimap
		this.minimap.update(gameTime);
		
		// Update the commandPanel and unit bar based on what type is selected
		if(this.game.selectedUnits.length !== 0){
		  this.commandPanel.update(gameTime, this.game.selectedUnits[0]);
		  this.unitBar.update(gameTime, this.game.selectedUnits);
		}
		else if(this.game.selectedBuildings.length !== 0){
		  this.commandPanel.update(gameTime, this.game.selectedBuildings[0]);
		  this.unitBar.update(gameTime, this.game.selectedBuildings);
		}
		// If no unit is selected, update with an undefined list to remove previous buttons
		else {
			this.commandPanel.update(gameTime);
			this.unitBar.update(gameTime);
		}
		
		// Update the resourceBar
		this.resourceBar.update(gameTime);
		
		// Update the unitPortrait
		this.unitPortrait.update(gameTime);
		
		// Update the timer
		this.timer.update(gameTime);
		
		// Update the tooltip
		this.tooltip.update(gameTime);
	},
	
	// Render the gui
	render: function(context) {

		// Update the minimap
		this.minimap.render(context, this.game.factions, this.game.mapMinerals);

		
		// Render the commandPanel
		this.commandPanel.render(context);

		// Render the resourceBar
		this.resourceBar.render(context);
		
		// Render the unitBar
		this.unitBar.render(context);
		
		// Render the unitPortrait
		this.unitPortrait.render(context);
		
		// Render the timer
		this.timer.render(context);
		
		// Render the tooltip
		this.tooltip.render(context);
	},
	
	// Returns if the mouse click that just occurred, occured on the ui
	isClickOnUi: function(mousePosX, mousePosY) {
		var onUi = false;
		this.hitboxes.forEach(function(hitbox) {
			if(hitbox.contains(mousePosX, mousePosY)) {
				onUi = true;
				return;
			}	
		});
		return onUi;
	},
	
	getButtonClicked: function(mousePosX, mousePosY) {
		var button;
		
		// Return the number of the action if the click was on a command panel button
		this.commandPanel.buttons.forEach(function(b) {
			if(b.hitbox.contains(mousePosX, mousePosY))
				button = b;
		});
		if(typeof(button) !== "undefined") {
			return button.id;
		}
		
		// Change the selected unit 
		this.unitBar.buttons.forEach(function(b) {
			if(b.hitbox.contains(mousePosX, mousePosY))
				button = b;
		});
		if(typeof(button) !== "undefined") {
			game.selectUnit(button.id);	
			return -1;
		}
		return -1;
	},
	
	onMouseMove: function(mousePosX, mousePosY) {
		this.tooltip.updateMousePos(mousePosX, mousePosY);
	}
}