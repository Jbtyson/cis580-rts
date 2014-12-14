// max erdwien
//Ryan Woodburn: Added a range of 0, added GetAttackRange() method
var Hoplite = function(x, y, color, game) {
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
	
	this.x = x;
	this.y = y;
	this.color = color;
	
	//this.render = HopliteRender;
	//this.update = HopliteUpdate;
	//this.getHitbox = HopliteGetHitbox;
	//this.move = HopliteMove;
	//this.attack = HopliteAttack;
}

Hoplite.prototype = new Unit(100,100,60,"#000000");

Hoplite.prototype.render = function(ctx) {
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
		self.curNode.x = Math.floor(self.x/64);
		self.curNode.y = Math.floor(self.y/64);
		
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
				if (faction.units[i].color != self.color &&
						self.game.cd.detect(self, faction.units[i])) {
					self.attack(faction.units[i]);
				}
				else if (game.units[i].faction == self.faction &&
						game.cd.detect(self, game.units[i]) && self != game.units[i] &&game.units[i].mode == "idle") {
					self.loseStack(game.units[i]);
				}
			}
		});
	}
}

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



