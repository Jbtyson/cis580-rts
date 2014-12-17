//Yi Wang
//Adapted off of tank
var Tank = function(x, y, faction) {
	this.maxhealth = 120;
	this.__proto__ = new Unit(x, y, this.maxhealth, faction);
	
	this.radius = 25;
	this.borderwidth = 6;
	// in pixels per second
	this.maxvel = 100;
	// in health per second
	this.damage = 11;
	this.range = 11;
	
	this.render = TankRender;
	this.update = TankUpdate;
	this.getHitbox = TankGetHitbox;
	this.getAttackRange = TankGetAttackRange;
	this.move = TankMove;
	this.attack = TankAttack;
	
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
		{ 
			thumbnail:Resource.gui.img.villagerCommandButton, 
			tooltipText:"Sample text to pretend to be a tooltip.", 
			onClick:this.testAction 
		},
	];
	// -----------------------------------------------------------------------------
}

TankRender = function(ctx) {
	ctx.save();
	ctx.beginPath();
	if (this.selected) {
		ctx.strokeStyle = "#00FF00";
	} else {
		ctx.strokeStyle = "#000000";
	}
	ctx.lineWidth = this.borderwidth;
	ctx.fillStyle = this.faction.color;
	ctx.beginPath();
	ctx.arc(this.x-globalx, this.y-globaly, this.radius-(this.borderwidth/2), 0, 2*Math.PI, false);
	ctx.fill();
	ctx.stroke();
	
	// draw health bar
	var maxbarlength = 20;
	var barheight = 4;
	var barlength = maxbarlength * (this.health/this.maxhealth);
	ctx.fillStyle = "#00FF00";
	ctx.beginPath();
	ctx.rect(this.x-(maxbarlength/2)-globalx, this.y-(barheight/2)-globaly,	barlength, barheight);
	ctx.fill();
	ctx.restore();
}

TankUpdate = function(elapsedTime) {
	var secs = elapsedTime / 1000;
	if (this.mode == "move" ||
			(this.mode == "attack" && !game.cd.detect(this.targetunit, this))) {
		if (this.mode == "attack") {
			this.move(this.targetunit.x, this.targetunit.y);
			this.mode = "attack";
		}
		var deltaxi = this.targetx - this.x;
		var deltayi = this.targety - this.y;
		
		// actually move
		this.x += secs*this.velx;
		this.y += secs*this.vely;
		
		// stop if target has been reached
		if (this.mode == "move") {
			var deltaxf = this.targetx - this.x;
			var deltayf = this.targety - this.y;
			var deltayf = this.targety - this.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				this.velx = 0;
				this.vely = 0;
				this.mode = "idle";
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
	}
	
	else if (this.mode == "idle") {
		for (var i = 0; i <  game.units.length; i++) {
			if (game.units[i].faction != this.faction &&
					game.cd.detect(this, game.units[i])) {
				this.attack(game.units[i]);
			}
		}
	}
}

TankGetHitbox = function() {
	return {
		type: "circle",
		x: this.x,
		y: this.y,
		radius: this.radius
	};
}

GetAttackRange = function() {
	return {
		type: "circle",
		x: this.x,
		y: this.y,
		radius: this.radius + this.range
	};
}

TankMove = function(x, y) {
	this.mode = "move";
	this.targetx = x;
	this.targety = y;
	
	var deltax = x - this.x;
	var deltay = y - this.y;
	
	this.velx = Math.sqrt((this.maxvel*this.maxvel * deltax*deltax) /
			(deltax*deltax + deltay*deltay));
	this.vely = Math.sqrt((this.maxvel*this.maxvel * deltay*deltay) /
			(deltax*deltax + deltay*deltay));
	if (this.velx/deltax < 0) {
		this.velx *= -1;
	}
	if (this.vely/deltay < 0) {
		this.vely *= -1;
	}
}

TankAttack = function(unit) {
	// temporarily changes mode to "move"
	this.move(unit.x, unit.y);
	this.mode = "attack";
	this.targetunit = unit;
}