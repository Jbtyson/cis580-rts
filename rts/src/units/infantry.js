//Ryan Woodburn
//Adapted off of hoplite
var Infantry = function(x, y, color, game) {
	this.game = game;
	
	this.maxhealth = 30;
	//this.__proto__ = new Unit(x, y, this.maxhealth, faction);
	
	this.radius = 8;
	this.borderwidth = 3;
	// in pixels per second
	this.maxvel = 100;
	// in health per second
	this.damage = 6;
	this.range = 8;
	
	this.x = x;
	this.y = y;
	this.color = color;
	
	//this.render = Render;
	//this.update = Update;
	//this.getHitbox = GetHitbox;
	//this.getAttackRange = GetAttackRange;
	//this.move = Move;
	//this.attack = Attack;
}

Infantry.prototype = new Unit(100,100,60,"#000000");

Infantry.prototype.render = function(ctx) {
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
	var maxbarlength = self.radius;
	var barheight = 4;
	var barlength = maxbarlength * (self.health/self.maxhealth);
	ctx.fillStyle = "#00FF00";
	ctx.beginPath();
	ctx.rect(self.x-(maxbarlength/2)-globalx, self.y-(barheight/2)-globaly,	barlength, barheight);
	ctx.fill();
	ctx.restore();
}

Infantry.prototype.update = function(elapsedTime) {
	var self = this;

	var secs = elapsedTime / 1000;
	if (self.mode == "move" ||
			(self.mode == "attack" && !self.game.cd.detect(self.targetunit, self))) {
		if (self.mode == "attack") {
			self.move(self.targetunit.x, self.targetunit.y);
			self.mode = "attack";
		}
		var deltaxi = self.targetx - self.x;
		var deltayi = self.targety - self.y;
		
		// actually move
		self.x += secs*self.velx;
		self.y += secs*self.vely;
		
		// stop if target has been reached
		if (self.mode == "move") {
			var deltaxf = self.targetx - self.x;
			var deltayf = self.targety - self.y;
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
	
	else if (self.mode == "idle") {
		self.game.factions.forEach( function(faction) {
			for (var i = 0; i <  faction.units.length; i++) {
				if (faction.units[i].color != self.color &&
						self.game.cd.detect(self, faction.units[i])) {
					self.attack(faction.units[i]);
				}
			}
		});
	}
}

Infantry.prototype.getHitbox = function() {
	var self = this;
	
	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius
	};
}

Infantry.prototype.getAttackRange = function() {
	return {
		type: "circle",
		x: this.x,
		y: this.y,
		radius: this.radius + this.range
	};
}

Infantry.prototype.move = function(x, y) {
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

Infantry.prototype.attack = function(unit) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}

