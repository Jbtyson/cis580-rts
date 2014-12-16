var Connector = function(x, y, orientation, factionIndex, game) {
	this.x = x;
	this.y = y;
	
	this.orientation = orientation;

	this.game = game;
	
	this.factionIndex = factionIndex;
	this.faction = game.factions[this.factionIndex];
	
	this.width = 128;
	this.height = 128;
	
	this.borderwidth = 6;
	
	this.world_x = x;
	this.world_y = y;

	this.unitQueue = [];
	this.unitTypeQueue = [];
	
	this.actions = [{thumbnail:Resource.gui.img.villagerCommandButton, onClick:this.buildVillager},
					{thumbnail:Resource.gui.img.hopliteCommandButton, onClick:this.buildHoplite},
					{thumbnail:Resource.gui.img.infantryCommandButton, onClick:this.buildInfantry}];
}

Connector.prototype = new Building(1, this.orientation, this.factionIndex, this.game);

Connector.prototype.update = function(elapsedTime) {

	this.animationTime += elapsedTime;

	//Move the animation frame.
	if(this.animationTime >= 50){
		this.animationTime = 0;
		this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	}

}

