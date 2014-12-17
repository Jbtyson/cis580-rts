// Adapted from Resource Arrays created by Chris Delpire.
UNIT_NAMES = ["Villager", "Infantry"];
UNIT_SPRITE_DATA = [ {x:0, y: 0, width: 32, height: 32, animationFrames: 12} ];

// max erdwien
// modified by: C.J. Dopheide

// Aaron - resource variables
var MINING_RATE = 5;	// amount of minerals added each 'tick'
var MINING_TIMER = 2000;	// time per mining 'tick' (milliseconds)

var Unit = function(x, y, health, faction) {
	this.x = x;
	this.y = y;
	this.radius;
	//supply is the population cost for a unit, default 1
	this.supply = 1;

	this.health = health;
	this.faction = faction;
	this.maxhealth;
	// mode is basically an enumeration. its values are:
	// idle
	// move
	// attack
	// mine
	// returningResource
	this.mode = "idle";
	
	// true if this unit belongs to an army
	this.conscripted = false;
	
	this.selected = false;
	this.velx = 0;
	this.vely = 0;
	this.targetx = 0;
	this.targety = 0;
	this.nextx = 0;
	this.nexty = 0;
	this.actions = [];
	
	this.animationFrame = 0;
	this.animationTime = 0;
	
  this.destNode = {
    x: 0,
    y: 0,
  }
  this.nextNode = {
    x: 0,
    y: 0,
  }
  this.targetunit = null;
	
}

Unit.prototype = {
	render: function(context) {
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

	update: function(elapsedTime) {
		var self = this;
		var secs = elapsedTime / 1000;
		
		this.animationTime += elapsedTime;

		if (this.animationTime >= 50) {
			this.animationTime = 0;
			this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
		}
		
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
			game.factions.forEach( function(faction) {
				for (var i = 0; i < faction.units.length; i++) {
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
			});
		}
},
getHitbox: function() {
		return {
			type: "circle",
			x: this.x,
			y: this.y,
			radius: this.radius
		};
},
getAttackRange: function() {
},
move: function(x, y) {
		this.mode = "move";
		this.getPath(x, y);
	},
attack: function(unit) {
		this.mode = "attack";
		this.targetunit = unit;
		this.getPath(unit.x, unit.y);
	},

	/* C.J. Dopheide
	This takes in an x y coordinate and uses an A* search to get a path to those coordinates.
	*/
	getPath: function(x, y)
	{
		var tile = Tilemap.tileAt(Math.floor(x/64), Math.floor(y/64), 0);
        if(tile && !tile.solid) {
			var curNode = {
				x: 0,
				y: 0,
				path: [],
				cost: 0
			}
			curNode.x = Math.floor(this.x/64);
			curNode.y = Math.floor(this.y/64);
			this.openSet = new PointSet(),
			this.closedSet = new PointSet();
			this.targetx = x;
			this.targety = y;
			this.destNode = aStarSearch({x: Math.floor(this.targetx/64), y: Math.floor(this.targety/64)}, curNode, this.openSet, this.closedSet);
			if(this.destNode != undefined)
			{
				this.getNextDest();
			}
			else
			{
				this.targetx = this.x;
				this.targety = this.y;
				this.destNode = this.curNode;
				this.updateDir();
			}
		}
	},
	
	/* C.J. Dopheide
	This sets the unit's next destination to the next node in the path to the target destination.
	*/
	getNextDest: function()
	{
		this.nextNode = this.destNode.path.shift();
		if(this.nextNode == undefined)
		{
			this.nextx = this.targetx;
			this.nexty = this.targety;
			this.nextNode = null;
		}
		else
		{
			if(this.nextNode.x == Math.floor(this.targetx/64) && this.nextNode.y == Math.floor(this.targety/64))
			{
				this.nextx = this.targetx;
				this.nexty = this.targety;
			}
			else
			{
				this.nextx = this.nextNode.x * 64 + 32;
				this.nexty = this.nextNode.y * 64 + 32;
			}
		}
		this.updateDir();
	},
	
	/* Max Erdwien
	   Modified by: C.J. Dopheide
	   This is basically a slightly tweaked copy of what used to be the HopliteMove function in
	   hoplite.js, it sets the unit's x and y velocities based on the direction it's immediate
	   destination is in.
	 */
	updateDir: function()
	{
		var deltax = this.nextx - this.x;
		var deltay = this.nexty - this.y;
		if(deltax != 0 && deltay != 0)
		{
			this.velx = Math.sqrt((this.maxvel*this.maxvel * deltax*deltax) /
					(deltax*deltax + deltay*deltay));
			this.vely = Math.sqrt((this.maxvel*this.maxvel * deltay*deltay) /
					(deltax*deltax + deltay*deltay));
		}
		else
		{
			this.velx = 0;
			this.vely = 0;
		}
		
		if (deltax != 0 && this.velx/deltax < 0) {
			this.velx *= -1;
		}
		if (deltay != 0 && this.vely/deltay < 0) {
			this.vely *= -1;
		}
	},
	
	/* C.J. Dopheide
	This is just a quick and dirty way to get the units out from that ball that they tend
	to form.
	*/
	loseStack: function(unit)
	{
		var xdist = this.x - unit.x;
		var ydist = this.y - unit.y;
		this.mode = "move";
		this.getPath(this.x + xdist/3, this.y + ydist/3);
	}
}