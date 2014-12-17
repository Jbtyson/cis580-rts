var Connector = function(x, y, orientation, factionIndex, game) {

	this.orientation = orientation;

	this.game = game;
	
	this.factionIndex = factionIndex;
	this.faction = game.factions[this.factionIndex];
	
	this.world_x = x;
	this.world_y = y;

	this.unitQueue = [];
	this.unitTypeQueue = [];
					
	// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here
	this.testAction = function() {
		console.log("test action performed");
	};
	// Declare array of actions here
	this.actions = [
		{ 
			thumbnail:Resource.gui.img.villagerCommandButton, 
			tooltipText:"Sample text to pretend to be a tooltip.", 
			onClick:this.testAction 
		},
	];
	// -----------------------------------------------------------------------------
}

Connector.prototype = new Building(1, this.orientation, this.factionIndex, this.game);