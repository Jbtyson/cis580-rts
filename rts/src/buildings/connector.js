var Connector = function(x, y, orientation, factionIndex, game) {

	this.orientation = orientation;

	this.game = game;
	
	this.factionIndex = factionIndex;
	this.faction = game.factions[this.factionIndex];
	
	this.world_x = x;
	this.world_y = y;

	this.unitQueue = [];
	this.unitTypeQueue = [];
	
	this.actions = [{thumbnail:Resource.gui.img.villagerCommandButton, onClick:this.buildVillager},
					{thumbnail:Resource.gui.img.hopliteCommandButton, onClick:this.buildHoplite},
					{thumbnail:Resource.gui.img.infantryCommandButton, onClick:this.buildInfantry}];
}

Connector.prototype = new Building(1, this.orientation, this.factionIndex, this.game);