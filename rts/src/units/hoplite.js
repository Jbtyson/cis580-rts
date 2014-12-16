// max erdwien
//Ryan Woodburn: Added a range of 0, added GetAttackRange() method
var Hoplite = function(x, y, faction, game) {
	this.game = game;

	this.maxhealth = 60;
	//this.__proto__ = new Unit(x, y, this.maxhealth, color);
	
	this.radius = 16;
	this.borderwidth = 6;
	// in pixels per second
	this.maxvel = 200;
	// in health per second
	this.damage = 6;
	this.range = 0;
	this.maxResources = 10;
	this.resources = 0;
	
	this.x = x;
	this.y = y;
	this.faction = faction;
	this.type = "hoplite";
	
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	
	//this.render = HopliteRender;
	//this.update = HopliteUpdate;
	//this.getHitbox = HopliteGetHitbox;
	//this.move = HopliteMove;
	//this.attack = HopliteAttack;
}

Hoplite.prototype = new Unit(100,100,this.maxhealth,this.faction);

Hoplite.prototype.update = function(elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;

	if (self.mode == "move" ||
			(self.mode == "attack" && !game.cd.detect(self.targetunit, self))) {
		if (self.mode == "attack") {
			self.targetx = self.targetunit.x;
			self.targety = self.targetunit.y;
			if(Math.floor(self.targetx/64) != self.nextNode.x || Math.floor(self.targety/64) != self.nextNode.y)
			{
				self.getPath(self.targetunit.x, self.targetunit.y);
			}
			self.mode = "attack";
		}
		var deltaxi = self.nextx - self.x;
		var deltayi = self.nexty - self.y;

		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		//update currentNode
		//self.curNode.x = Math.floor(self.x/64);
		//self.curNode.y = Math.floor(self.y/64);
		
		// start moving to the next node or stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.nextx - self.x;
			var deltayf = self.nexty - self.y;
			if ((deltaxi/deltaxf < 0 || deltayi/deltayf < 0) || (deltaxf == 0 && deltayf == 0)) {
				self.velx = 0;
				self.vely = 0;
				if(self.nextx != self.targetx && self.nexty != self.targety)
				{
					self.getNextDest();
				}
				else
				{
					self.velx = 0;
					self.vely = 0;
					self.mode = "idle";
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
	}
	
	else if (self.mode == "idle") {
		self.game.factions.forEach( function(faction) {
			for (var i = 0; i <  faction.units.length; i++) {
				if (faction.units[i].faction != self.faction &&
						self.game.cd.detect(self, faction.units[i])) {
					self.attack(faction.units[i]);
				}
				else if (faction.units[i].faction == self.faction &&
						game.cd.detect(self, faction.units[i]) && self != faction.units[i] && faction.units[i].mode == "idle") {
					self.loseStack(faction.units[i]);
				}
			}
		});
	}
}

Hoplite.prototype.render = function(context) {
		//draw unit
		context.drawImage(Resource.units.img.hoplite[this.faction],
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

Hoplite.prototype.getHitbox = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius
	};
}

Hoplite.prototype.move = function(x, y) {
	this.mode = "move";
	this.getPath(x, y);
}

Hoplite.prototype.attack = function(unit) {
	this.mode = "attack";
	this.targetunit = unit;
	this.getPath(unit.x, unit.y);
}

Hoplite.prototype.getAttackRange = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius + self.range
	};
}




