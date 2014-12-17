var Barracks = function(x,y,orientation,faction) {
	this.world_x = x;
	this.world_y = y;
	this.factionIndex = faction;
	this.orientation = orientation;

	this.actions = [{thumbnail:Resource.gui.img.villagerCommandButton, onClick:this.buildVillager},
					{thumbnail:Resource.gui.img.hopliteCommandButton, onClick:this.buildHoplite},
					{thumbnail:Resource.gui.img.infantryCommandButton, onClick:this.buildInfantry}];
}

Barracks.prototype = new Building(2, this.orientation, this.factionIndex, this.game);


Barracks.prototype.update = function(elapsedTime) {

	this.animationTime += elapsedTime;

	//Move the animation frame.
	if(this.animationTime >= 50){
		this.animationTime = 0;
		this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	}
}