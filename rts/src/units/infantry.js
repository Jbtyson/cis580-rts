//Ryan Woodburn
//Adapted off of hoplite
var Infantry = function(x, y, faction, game) {
	
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
	
	// ------------------- James wrote this for gui stuff --------------------------
	// -------It is necessary for gui to work, so make sure all units have it-------
	// Unit icon for the unit bar
	this.thumbnail = Resource.gui.img.villagerCommandButton;
	// Declare action functions here
	this.testAction = function() {
		console.log("test action performed");
	};
	// Declare array of actions here
	this.actions = [
		{ thumbnail:Resource.gui.img.villagerCommandButton, onClick:this.testAction }
	];
	// -----------------------------------------------------------------------------
}

Infantry.prototype = new Unit(this.x,this.y,this.maxhealth,this.faction);

/*Infantry.prototype.render = function(ctx) {
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
}*/
/*
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
*/
Infantry.prototype.update = function(elapsedTime) {
		var self = this;
		var secs = elapsedTime / 1000;
		if (this.mode == "move" ||
				(this.mode == "attack" && !game.cd.detect(this.targetunit, this))) {
			if (this.mode == "attack") {
				this.targetx = this.targetunit.x;
				this.targety = this.targetunit.y;
				if(Math.floor(this.targetx/64) != this.nextNode.x || Math.floor(this.targety/64) != this.nextNode.y)
				{
					this.getPath(this.targetunit.x, this.targetunit.y);
				}
			}
			var deltaxi = this.nextx - this.x;
			var deltayi = this.nexty - this.y;
			
			// actually move
			this.x += secs*this.velx;
			this.y += secs*this.vely;
			
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
					
					this.animationTime += elapsedTime;
	  
					if(this.animationTime >= 50){
						this.animationTime = 0;
						this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
					}
				}
			}
		}
		
		else if (this.mode == "attack" && game.cd.detect(this.targetunit, this)) {
			this.targetunit.health -= this.damage*secs;
			//console.log(this.targetunit.health);
			if (this.targetunit.health <= 0) {
				this.mode = "idle";
				this.targetunit = null;
			}
			this.animationTime += elapsedTime;
			this.animationFrame = 0;
		}
		
		else if (this.mode == "idle") {
			game.factions.forEach( function(faction) {
				for (var i = 0; i <  faction.units.length; i++) {
					var otherUnit = {
						getHitbox: function()
						{
							return faction.units[i].getHitbox();
						},
						getAttackRange: function()
						{
							return faction.units[i].getHitbox();
						}
					}
					if (faction.units[i].faction != self.faction &&
							game.cd.detect(self, faction.units[i])) {
						self.attack(faction.units[i]);
					}
					else if (faction.units[i].faction == self.faction &&
							game.cd.detect(self, otherUnit) && self != faction.units[i] && faction.units[i].mode == "idle") {
						self.loseStack(faction.units[i]);
					}
				}
			})
		}
},

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
/*
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
*/

Infantry.prototype.startMine = function(mine) {
	var self = this;

	// temporarily changes mode to "move"
	self.move(unit.x, unit.y);
	self.mode = "attack";
	self.targetunit = unit;
}
