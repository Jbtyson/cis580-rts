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
<<<<<<< HEAD
	if (this.mode == "move" ||
			(this.mode == "attack" && !game.cd.detect(this.targetunit, this))) {
		if (this.mode == "attack") {
			this.targetx = this.targetunit.x;
			this.targety = this.targetunit.y;
			if(Math.floor(this.targetx/64) != this.nextNode.x || Math.floor(this.targety/64) != this.nextNode.y)
			{
				this.getPath(this.targetunit.x, this.targetunit.y);
			}
			this.mode = "attack";
		}
		var deltaxi = this.nextx - this.x;
		var deltayi = this.nexty - this.y;
=======
	if (self.mode == "move" ||
			(self.mode == "attack" && !self.game.cd.detect(self.targetunit, self))) {
		if (self.mode == "attack") {
			self.move(self.targetunit.x, self.targetunit.y);
			self.mode = "attack";
		}
		var deltaxi = self.targetx - self.x;
		var deltayi = self.targety - self.y;
>>>>>>> ba09a871b5f838b28a88d8ade19df390e164aa1b
		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
<<<<<<< HEAD
		//update currentNode
		this.curNode.x = Math.floor(this.x/64);
		this.curNode.y = Math.floor(this.y/64);
		
		// start moving to the next node or stop if target has been reached
		if (this.mode == "move") {
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
=======
		// stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.targetx - self.x;
			var deltayf = self.targety - self.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				self.velx = 0;
				self.vely = 0;
				self.mode = "idle";
>>>>>>> ba09a871b5f838b28a88d8ade19df390e164aa1b
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
			}
<<<<<<< HEAD
			else if (game.units[i].faction == this.faction &&
					game.cd.detect(this, game.units[i]) && this != game.units[i] &&game.units[i].mode == "idle") {
				this.loseStack(game.units[i]);
			}
		}
=======
		});
>>>>>>> ba09a871b5f838b28a88d8ade19df390e164aa1b
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

<<<<<<< HEAD
HopliteMove = function(x, y) {
	this.mode = "move";
	this.getPath(x, y);
}

HopliteAttack = function(unit) {
	this.mode = "attack";
	this.targetunit = unit;
	this.getPath(unit.x, unit.y);
=======
Hoplite.prototype.getAttackRange = function() {
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius + self.range
	};
}

Hoplite.prototype.move = function(x, y) {
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

Hoplite.prototype.attack = function(unit) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
>>>>>>> ba09a871b5f838b28a88d8ade19df390e164aa1b
}





