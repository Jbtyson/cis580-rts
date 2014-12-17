var Barracks = function(x,y,orientation,faction) {
	this.world_x = x;
	this.world_y = y;
	this.factionIndex = faction;
	this.orientation = orientation;
					
	// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare array of actions here
	this.actions = [
		{ 
			thumbnail:Resource.gui.img.villagerCommandButton, 
			tooltipText:"Build a Villager.", 
			onClick:this.buildVillager 
		},
		{ 
			thumbnail:Resource.gui.img.hopliteCommandButton, 
			tooltipText:"Build a Hoplite.", 
			onClick:this.buildHoplite 
		},
		{ 
			thumbnail:Resource.gui.img.infantryCommandButton, 
			tooltipText:"Build an Infantry unit.", 
			onClick:this.buildInfantry 
		},
	];
	// -----------------------------------------------------------------------------
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