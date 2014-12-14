// max erdwien, Ryan Woodburn
// make units stop  when they get in range of attacking target

// Adapted from Resource Arrays created by Chris Delpire.
UNIT_NAMES = ["Villager", "Infantry"];
UNIT_SPRITE_DATA = [ {x:0, y: 0, width: 32, height: 32, animationFrames: 12} ];

var Unit = function(x, y, health, faction) {
	this.x = x;
	this.y = y;
	this.radius;
	//supply is the population cost for a unit
	this.supply;
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
	
	this.selected = false;
	this.velx = 0;
	this.vely = 0;
	this.targetx = 0;
	this.targety = 0;
	this.targetunit = null;
	this.actions = [];
	
	this.animationFrame = 0;
	this.animationTime = 0;
	
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

	update: function() {
		this.animationTime += elapsedTime;
	  
		if(this.animationTime >= 50){
			this.animationTime = 0;
			this.animationFrame = (this.animationFrame + 1) % UNIT_SPRITE_DATA[0].animationFrames;
	  }
	},

	getHitbox: function() {

	},
	
	getAttackRange: function() {
	
	},

	move: function() {
	
	},

	attack: function() {

	}
}
