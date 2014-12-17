// max erdwien
//Edited by Ryan Woodburn
//Building variables and method by Yi Wang
var Villager = function(x, y, faction, game) {
	this.game = game;

	this.maxhealth = 60;
	this.health = this.maxhealth;
	
	this.type = "villager";
	this.radius = 16;
	this.range = 0;
	this.borderwidth = 6;
	this.maxResources = 50;
	this.resources = 0;
	// in pixels per second
	this.maxvel = 200;
	// in health per second
	this.damage = 3;
	
	this.Villagerbuildingspeed = 5;
	//this.buildking
	
	this.building = "";
	
	this.targetMine;

	this.x = x;
	this.y = y;
	this.faction = faction;
	
	this.mode = 0;
	
	this.type = "villager";
	
		// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here

	// Declare array of actions here
	this.actions = [
		{
			thumbnail:Resource.gui.img.towncenterCommandButton,
			tooltipText:"Build a Towncenter.",
			onClick:this.buildTowncenter
		},
		{
			thumbnail:Resource.gui.img.connectorCommandButton,
			tooltipText:"Build a Connector.",
			onClick:this.buildConnector
		},
				{
			thumbnail:Resource.gui.img.barracksCommandButton,
			tooltipText:"Build a Barracks.",
			onClick:this.buildBarracks
		},
	];
	// -----------------------------------------------------------------------------
}

Villager.prototype = new Unit();

Villager.prototype.update = function(elapsedTime) {
	var self = this;
	var secs = elapsedTime / 1000;
	if (self.mode == "move" ||
	(self.mode == "goingToMine" && !game.cd.detect(self.targetunit, self)) ||
	(self.mode == "returningToBase" && !game.cd.detect(self.targetunit, self)) ||
	(self.mode == "build" && !game.cd.detect(self.building, self))) {
		var deltaxi = self.nextx - self.x;
		var deltayi = self.nexty - self.y;
		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		// stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = this.nextx - this.x;
			var deltayf = this.nexty - this.y;
			if ((deltaxi/deltaxf < 0 || deltayi/deltayf < 0) || (deltaxf == 0 && deltayf == 0)) {
				this.velx = 0;
				this.vely = 0;
				if(this.nextx != this.targetx && this.nexty != this.targety)
				{
					this.getNextDest();
				}
				else
				{
					this.velx = 0;
					this.vely = 0;
					this.mode = "idle";
				}
			}
		}
	}

	else if (self.mode == "attack" && self.game.cd.detect(self.targetunit, self)) {
		self.targetunit.health -= self.damage*secs;
		//console.log(self.targetunit.health);
		if (self.targetunit.health <= 0) {
			self.mode = "idle";
			self.targetunit = null;
		}
		self.mode = "idle";
	}
	
	else if(self.mode == "build" && self.x == self.buildingunit.x + self.radius && self.y == self.buildingunit.y + self.radius){
		buildingunit.buildingHp += self.Villagerbuildingspeed * secs;
		if(buildingunit.buildingHp >= buildingunit.health){
			self.mode = "idle";
		}
	}

	else if (self.mode == "idle" || self.mode == "build") {
		self.game.factions.forEach( function(faction) {
			for (var i = 0; i <  faction.units.length; i++) {
				if (faction.units[i].color != self.color &&
						self.game.cd.detect(self, faction.units[i])) {
					// todo: run away
				}
			}
		});
	}
	
	else if (self.mode == "goingToMine" && game.cd.detect(self.targetunit, self))
	{
		self.mode = "mining";
	}
	
	/*else if (self.mode == "mining" && self.resources >= self.maxResources)
	{
		if (self.resources > self.maxResources) self.resources = self.maxResources;
		self.mode = "returningToBase";
		self.targetunit = self.game.factions[0].buildings[0];//todo: check for closest town center
	}*/
	
	else if (self.mode == "returningToBase" && game.cd.detect(self.targetunit, self))
	{
		self.resources = 0; //change later
		self.mode = "goingToMine";
		self.targetunit = self.targetMine;
	}
	
	else if (self.mode == "mining")
	{
		self.resources += elapsedTime;
		if (self.resources >= MINING_TIMER)
		{
			self.resources = 0;
			self.targetunit.subtract(MINING_RATE);
			self.game.factions[self.faction].playerResources.minerals.add(MINING_RATE);
			if (!self.targetunit.canSubtract(MINING_RATE)) self.mode = "idle";
		}
	}
	
	else console.log("unhandled case");
}

Villager.prototype.render = function(context) {
		//draw unit
		context.drawImage(Resource.units.img.villager[this.faction],
			UNIT_SPRITE_DATA[0].x + UNIT_SPRITE_DATA[0].width * this.animationFrame, UNIT_SPRITE_DATA[0].y,
			UNIT_SPRITE_DATA[0].width, UNIT_SPRITE_DATA[0].height,
			this.x - globalx - this.radius, this.y - globaly - this.radius,
			UNIT_SPRITE_DATA[0].width, UNIT_SPRITE_DATA[0].height);
			
		// draw health bar
		var maxbarlength = this.radius*2;
		var barheight = 4;
		var barlength = maxbarlength * (this.health/this.maxhealth);
		context.fillStyle = "#00FF00";
		context.beginPath();
		context.rect(this.x -(maxbarlength/2)-globalx, this.y - this.radius/2 - (barheight/2)-globaly,	barlength, barheight);
		context.fill();
		context.restore();
		
		if(this.selected) {
			context.drawImage(Resource.units.img.unitSelector,
				this.x - globalx - this.radius, this.y - globaly - this.radius);
		}
	},

Villager.prototype.getHitbox = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius
	};
}

Villager.prototype.getAttackRange = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius + self.range
	};
}

Villager.prototype.move = function(x, y) {
	var self = this;

	self.mode = "move";
	self.targetx = x;
	self.targety = y;
	
	var deltax = x - self.x;
	var deltay = y - self.y;
	
	self.velx = Math.sqrt((self.maxvel*self.maxvel * deltax*deltax) /
			(deltax*deltax + deltay*deltay));
	self.vely = Math.sqrt((self.maxvel*self.maxvel * deltay*deltay) /
			(deltax*deltax + deltay*deltay));
	if (self.velx/deltax < 0) {
		self.velx *= -1;
	}
	if (self.vely/deltay < 0) {
		self.vely *= -1;
	}
},

Villager.prototype.buildConnector = function(villager) {
	villager.build(new Connector(0, 0, 0, 0, villager.game));
}


Villager.prototype.buildBarracks = function(villager) {
	villager.build(new Barracks(0, 0, 0, 0, villager.game));
}

Villager.prototype.buildTowncenter = function(villager) {
	villager.build(new Towncenter(0, 0, 0, 0, villager.game));
}

Villager.prototype.build = function(Building) {
	var self = this;

	this.game.phantom = new PhantomBuilding(Building.type, this.game);
  this.game.buildingVillager = self;
	self.getPath(Building.x,Building.y);
	self.buildingunit = Building;
	
}

Villager.prototype.attack = function(unit) {
	var self = this;

	// temporarily changes mode to "move"
	self.getPath(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}

Villager.prototype.attackBuilding = function(building) {
	this.mode = "attack_building";
	this.targetunit = building;
	this.getPath(building.x, building.y);
}

Villager.prototype.startMine = function(mine) {
	var self = this;

	self.mode = "goingToMine";
	self.targetunit = mine;
	self.targetMine = mine;
}

