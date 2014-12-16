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
	this.type = "infantry";
	
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

