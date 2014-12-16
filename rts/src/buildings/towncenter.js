var Towncenter = function(x, y, orientation, factionIndex, game) {
	this.x = x;
	this.y = y;
	
	this.game = game;

	this.orientation = orientation;
	
	this.factionIndex = factionIndex;
	this.faction = game.factions[this.factionIndex];
	
	this.width = 128;
	this.height = 128;
	
	this.borderwidth = 6;
	
	this.world_x = x;
	this.world_y = y;

	this.unitQueue = [];
	this.unitTypeQueue = [];
	this.unitBuildPositionIndex = 0;
	

	// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Building icon for the bottom bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here
	this.testAction = function() {
		console.log("test action performed");
	};
	// Declare array of actions here
	this.actions = [
		{thumbnail:Resource.gui.img.villagerCommandButton, tooltipText: "Build a villager", onClick:this.buildVillager},
		{thumbnail:Resource.gui.img.hopliteCommandButton, tooltipText: "Build a hoplite", onClick:this.buildHoplite},
		{thumbnail:Resource.gui.img.infantryCommandButton, tooltipText: "Build an infantry unit", onClick:this.buildInfantry}
	];
	// -----------------------------------------------------------------------------
}

Towncenter.prototype = new Building(0, this.orientation, this.factionIndex, this.game);

Towncenter.prototype.update = function(elapsedTime) {

	this.animationTime += elapsedTime;

	//Move the animation frame.
	if(this.animationTime >= 50){
		this.animationTime = 0;
		this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	}

	//Check if the Towncenter is building a unit.
	if(this.unitQueue.length > 0){
		this.unitQueue[0] -= elapsedTime;

		this.buildPercent = this.unitQueue[0] / 2500;

		if(this.unitQueue[0] <= 0){

			var buildPosition_x;
			var buildPosition_y;

			switch(this.unitBuildPositionIndex){
				case 0:
					buildPosition_x = this.world_x + 32;
					buildPosition_y = this.world_y + 96;
					break;
				case 1:
					buildPosition_x = this.world_x + 96;
					buildPosition_y = this.world_y + 96;
					break;
				case 2:
					buildPosition_x = this.world_x + 96;
					buildPosition_y = this.world_y + 32;
					break;
				case 3:
					buildPosition_x = this.world_x + 32;
					buildPosition_y = this.world_y + 32;
					break;
				default:
					console.log("error; invalid buildPositionIndex");
					return;

			}


			this.unitQueue.shift();
			var unitType = this.unitTypeQueue.shift();
			switch (unitType) {
				case "villager":
					this.faction.units.push(new Villager(buildPosition_x, buildPosition_y, this.factionIndex, this.game));
					break;
				case "hoplite":
					this.faction.units.push(new Hoplite(buildPosition_x, buildPosition_y, this.factionIndex, this.game));
					break;
				case "infantry":
					this.faction.units.push(new Infantry(buildPosition_x, buildPosition_y, this.factionIndex, this.game));
					break;
				default:
					console.log("error; invalid unit");
					return;
			}

			this.unitBuildPositionIndex = (this.unitBuildPositionIndex + 1) % 4 
			
		}
	} else {
		this.isBuilding = false;
	}

}

Towncenter.prototype.buildVillager = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.faction.playerResources.minerals.canSubtract(50)) {
		return;
	}

	if (!building.faction.playerResources.supply.canAdd(1)) {
		return;
	}

	building.faction.playerResources.minerals.subtract(50);
	building.faction.playerResources.supply.add(1);

	building.unitQueue.push(2500);
	building.isBuilding = true;
	building.unitTypeQueue.push("villager");

}

Towncenter.prototype.buildHoplite = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.faction.playerResources.minerals.canSubtract(100)) {
		return;
	}

	if (!building.faction.playerResources.supply.canAdd(1)) {
		return;
	}

	building.faction.playerResources.minerals.subtract(100);
	building.faction.playerResources.supply.add(1);

	building.unitQueue.push(2500);
	building.isBuilding = true;
	building.unitTypeQueue.push("hoplite");

}

Towncenter.prototype.buildInfantry = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.faction.playerResources.minerals.canSubtract(130)) {
		return;
	}

	if (!building.faction.playerResources.supply.canAdd(1)) {
		return;
	}

	building.faction.playerResources.minerals.subtract(130);
	building.faction.playerResources.supply.add(1);

	building.unitQueue.push(2500);
	building.isBuilding = true;
	building.unitTypeQueue.push("infantry");

}



Towncenter.prototype.getHitbox = function() { // Update to square hitbox
	var self = this;

	return {
		type: "rect",
		x:self.x,
		y:self.y,
		h:this.height,
		w:this.width,
	};
}