var Towncenter = function(x, y, health, factionIndex, game) {
	this.x = x;
	this.y = y;
	this.health = health;
	
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

Towncenter.prototype = new Building(0, this.factionIndex, this.game);

/*Towncenter.prototype.render = function(context) {
	var self = this;
	
	context.save();
	
	if (self.selected) {
		context.strokeStyle = "#00FF00";
	} else {
		context.strokeStyle = "#000000";
	}
	context.lineWidth = self.borderwidth;
	
	//translate to center of bldg
	context.translate(-0.5*self.width,-0.5*self.height);
	
	context.fillStyle = self.color;
	context.fillRect(self.x-globalx,self.y-globaly,self.height,self.width);
	context.strokeRect(self.x-globalx,self.y-globaly,self.height,self.width);
	
	context.restore();
	
	context.restore();
}*/

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
			this.unitQueue.shift();
			var unitType = this.unitTypeQueue.shift();
			switch (unitType) {
				case "villager":
					this.faction.units.push(new Villager(this.world_x + 64, this.world_y + 128, this.factionIndex, this.game));
					break;
				case "hoplite":
					this.faction.units.push(new Villager(this.world_x + 64, this.world_y + 128, this.factionIndex, this.game));
					break;
				case "infantry":
					this.faction.units.push(new Infantry(this.world_x + 64, this.world_y + 128, this.factionIndex, this.game));
					break;
				default:
					console.log("error; invalid unit");
					return;
			}
			
		}
	} else {
		this.isBuilding = false;
	}

}

Towncenter.prototype.buildVillager = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.game.playerResources.minerals.canSubtract(50)) {
		return;
	}

	if (!building.game.playerResources.supply.canAdd(1)) {
		return;
	}

	building.game.playerResources.minerals.subtract(50);
	building.game.playerResources.supply.add(1);

	building.unitQueue.push(2500);
	building.isBuilding = true;
	building.unitTypeQueue.push("villager");

}

Towncenter.prototype.buildHoplite = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.game.playerResources.minerals.canSubtract(100)) {
		return;
	}

	if (!building.game.playerResources.supply.canAdd(1)) {
		return;
	}

	building.game.playerResources.minerals.subtract(100);
	building.game.playerResources.supply.add(1);

	building.unitQueue.push(2500);
	building.isBuilding = true;
	building.unitTypeQueue.push("hoplite");

}

Towncenter.prototype.buildInfantry = function(building){

	//TODO: Check if the player has enough resources.
	if (!building.game.playerResources.minerals.canSubtract(130)) {
		return;
	}

	if (!building.game.playerResources.supply.canAdd(1)) {
		return;
	}

	building.game.playerResources.minerals.subtract(130);
	building.game.playerResources.supply.add(1);

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