// max erdwien
//Edited by Ryan Woodburn
//Building variables and method by Yi Wang
var Villager = function(x, y, faction, game) {
	this.game = game;

	this.maxhealth = 60;
	this.health = this.maxhealth;
	
	this.radius = 32;
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

	this.x = x;
	this.y = y;
	this.faction = faction;
	
		// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here
	this.buildTowncenter = function() {
		build(new Barracks());
	};
	this.buildTowncenter = function() {
		build(new Towncenter());
	};
	// Declare array of actions here
	this.actions = [
		{ 
			thumbnail:Resource.gui.img.towncenterCommandButton, 
			tooltipText:"Sample text to pretend to be a tooltip.", 
			onClick:this.buildTowncenter 
		},
		{ 
			thumbnail:Resource.gui.img.villagerCommandButton, 
			tooltipText:"Sample text to pretend to be a tooltip.", 
			onClick:this.buildTowncenter 
		},
	];
	// -----------------------------------------------------------------------------
}

Villager.prototype = new Unit();

Villager.prototype.render = function(ctx) {
	var self = this;

	ctx.save();
	ctx.beginPath();
	if (self.selected) {
		ctx.strokeStyle = "#00FF00";
	} else {
		ctx.strokeStyle = "#000000";
	}
	ctx.lineWidth = self.borderwidth;
	ctx.fillStyle = self.color;
	ctx.beginPath();
	ctx.arc(self.x-globalx, self.y-globaly, self.radius-(self.borderwidth/2), 0, 2*Math.PI, false);
	ctx.fill();
	ctx.stroke();
	
	// draw health bar
	var maxbarlength = 16;
	var barheight = 4;
	var barlength = maxbarlength * (self.health/self.maxhealth);
	ctx.fillStyle = "#00FF00";
	ctx.beginPath();
	ctx.rect(self.x-(maxbarlength/2)-globalx, self.y-(barheight/2)-globaly,	barlength, barheight);
	ctx.fill();
	ctx.restore();
}

Villager.prototype.update = function(elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;
	if (self.mode == "move") {
		var deltaxi = self.targetx - self.x;
		var deltayi = self.targety - self.y;
		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		// stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.targetx - self.x;
			var deltayf = self.targety - self.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				self.velx = 0;
				self.vely = 0;
				self.mode = "idle";
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
}

Villager.prototype.build = function(Building) {
	var self = this;
	self.move(Building.x,Building.y); 
	self.mode = "build";
	self.buildingunit = Building;
	this.game.factions[0].buildings.push(Building);
}

Villager.prototype.attack = function(unit) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
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

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}

