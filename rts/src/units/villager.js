// max erdwien
//Edited by Ryan Woodburn
//Building variables and method by Yi Wang

UNIT_SPRITE_DATA = [ {x:0, y: 0, width: 32, height: 32, animationFrames: 12} ];

var Villager = function(x, y, faction, game) {
	this.game = game;

	this.maxhealth = 60;
	//this.__proto__ = new Unit(x, y, this.maxhealth, color);
	
	this.radius = 32;
	this.range = 0;
	this.borderwidth = 6;
	this.maxResources = 50;
	this.resources = 0;
	// in pixels per second
	this.maxvel = 200;
	// in health per second
	this.damage = 3;
	
	this.Villagerbuildingspeed = 1.0;
	
	this.x = x;
	this.y = y;
	this.faction = faction;
	this.type = "villager";
	
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	
	//this.render = VillagerRender;
	//this.update = VillagerUpdate;
	//this.getHitbox = VillagerGetHitbox;
	//this.move = VillagerMove;
}

Villager.prototype = new Unit(100,100,this.maxhealth,this.faction);

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
/*
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
	
	else if(self.mode == "build" && self.x = buildingunit.x + self.radius && self.y = buildingunit.y + self.radius){
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

Villager.prototype.build = function(bx,by,BuildingHp,resource,elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;
	var buildHp = 0;
	//check resource

	//read in xy position, move to xy position
	self.move(bx,by); // was villagerMove(bx,by)
	
	//buiding start && villegar stay in position
	while(self.mode == "idle" && self.x ==bx && self.y==by && buildHP != self.BuildingHp){
		buildHp = self.Villagerbuildingspeed * secs;
	}
	//outer the while loop building is stoped, out reason check
	
	//villegar have been moved
	if(self.mode != "idle" || self.x !=bx || self.y != by && buildHP < self.BuildingHp){
			//store the buildingHp on the x,y position.
	}
	//Building complete
	else if(buildHp==self.BuildingHp){
		//render Building
	}
	else{
		console.log("Unknow reason for Building stoped");
	}
}

Villager.prototype.attack = function(unit) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}
*/
Villager.prototype.startMine = function(mine) {
	var self = this;

	// temporarily changes mode to "move"
	//self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}

