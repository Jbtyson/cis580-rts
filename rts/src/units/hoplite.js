// max erdwien
var Hoplite = function(x, y, faction) {
	this.maxhealth = 60;
	this.__proto__ = new Unit(x, y, this.maxhealth, faction);
	
	this.radius = 16;
	this.borderwidth = 6;
	// in pixels per second
	this.maxvel = 200;
	// in health per second
	this.damage = 6;
	
	this.render = HopliteRender;
	this.update = HopliteUpdate;
	this.getHitbox = HopliteGetHitbox;
	this.move = HopliteMove;
	this.attack = HopliteAttack;
}

HopliteRender = function(ctx) {
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
	var maxbarlength = 16;
	var barheight = 4;
	var barlength = maxbarlength * (this.health/this.maxhealth);
	ctx.fillStyle = "#00FF00";
	ctx.beginPath();
	ctx.rect(this.x-(maxbarlength/2)-globalx, this.y-(barheight/2)-globaly,	barlength, barheight);
	ctx.fill();
	ctx.restore();
}

HopliteUpdate = function(elapsedTime) {
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
			this.mode = "attack";
		}
		var deltaxi = this.nextx - this.x;
		var deltayi = this.nexty - this.y;
		
		// actually move
		this.x += secs*this.velx;
		this.y += secs*this.vely;
		
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
			else if (game.units[i].faction == this.faction &&
					game.cd.detect(this, game.units[i]) && this != game.units[i] &&game.units[i].mode == "idle") {
				this.loseStack(game.units[i]);
			}
		}
	}
}

HopliteGetHitbox = function() {
	return {
		type: "circle",
		x: this.x,
		y: this.y,
		radius: this.radius
	};
}

HopliteMove = function(x, y) {
	this.mode = "move";
	this.getPath(x, y);
}

HopliteAttack = function(unit) {
	this.mode = "attack";
	this.targetunit = unit;
	this.getPath(unit.x, unit.y);
}





