//Ryan Woodburn
//Adapted off of hoplite
var Infantry = function(x, y, faction, game) {
	this.game = game;
	
	this.maxhealth = 30;
	this.health = this.maxhealth;
	//this.__proto__ = new Unit(x, y, this.maxhealth, faction);
	
	this.radius = 16;
	this.borderwidth = 3;
	// in pixels per second
	this.maxvel = 100;
	// in health per second
	this.damage = 6;
	this.range = 60;
	this.maxResources = 20;
	this.resources = 0;
	
	this.x = x;
	this.y = y;
	this.faction = faction;
	
	//this.render = Render;
	//this.update = Update;
	//this.getHitbox = GetHitbox;
	//this.getAttackRange = GetAttackRange;
	//this.move = Move;
	//this.attack = Attack;
}

Infantry.prototype = new Unit(100,100,this.maxhealth,this.faction);

Infantry.prototype.render = function(context) {
		//draw unit
		context.drawImage(Resource.units.img.infantry[this.faction],
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
			//var deltayf = self.targety - self.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				self.velx = 0;
				self.vely = 0;
				self.mode = "idle";
			}
			
			this.animationTime += elapsedTime;
	  
			if(this.animationTime >= 50){
				this.animationTime = 0;
				this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
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
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
	
	else {
		this.animationTime += elapsedTime;
		this.animationFrame = 0;
	}
	self.game.factions.forEach( function(faction) {
		for (var i = 0; i <  faction.units.length; i++) {
			if (faction.units[i].faction != self.faction &&
					self.game.cd.detect(self, faction.units[i])) {
				self.attack(faction.units[i]);
			}
		}
	});
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
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius + self.range
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

