// max erdwien
// modified by: C.J. Dopheide
var Unit = function(x, y, health, color) {
	this.x = x;
	this.y = y;
	this.curNode = {
		x: 0,
		y: 0,
		path: [],
		cost: 0
	}
	this.curNode.x = Math.floor(x/64);
	this.curNode.y = Math.floor(y/64);
	this.health = health;
	this.color = color;
	// mode is basically an enumeration. its values are:
	// idle
	// move
	// attack
	this.mode = "idle";
	
	this.selected = false;
	this.velx = 0;
	this.vely = 0;
	this.targetx = 0;
	this.targety = 0;
	this.nextx = 0;
	this.nexty = 0;
	this.actions = [];
	this.destNode = {
		x: 0,
		y: 0,
	}
	this.nextNode = {
		x: 0,
		y: 0,
	}
	this.targetunit = null;
	
	/*Update = function(elapsedTime) {
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

	GetHitbox = function() {
		return {
			type: "circle",
			x: this.x,
			y: this.y,
			radius: this.radius
		};
	}

	Move = function(x, y) {
		this.mode = "move";
		this.getPath(x, y);
	}

	Attack = function(unit) {
		this.mode = "attack";
		this.targetunit = unit;
		this.getPath(unit.x, unit.y);
	}

	/*
	/* C.J. Dopheide
	This takes in an x y coordinate and uses an A* search to get a path to those coordinates.
	
	this.getPath = function(x, y)
	{
		var tile = Tilemap.tileAt(Math.floor(x/64), Math.floor(y/64), 0);
        if(tile && !tile.solid) {
			this.openSet = new PointSet(),
			this.closedSet = new PointSet();
			this.targetx = x;
			this.targety = y;
			this.destNode = aStarSearch({x: Math.floor(this.targetx/64), y: Math.floor(this.targety/64)}, this.curNode, this.openSet, this.closedSet);
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
	}
	
	/* C.J. Dopheide
	This sets the unit's next destination to the next node in the path to the target destination.
	
	this.getNextDest = function()
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
	}
	
	/* Max Erdwien
	   Modified by: C.J. Dopheide
	   This is basically a slightly tweaked copy of what used to be the HopliteMove function in
	   hoplite.js, it sets the unit's x and y velocities based on the direction it's immediate
	   destination is in.
	 
	this.updateDir = function()
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
	}
	
	/* C.J. Dopheide
	This is just a quick and dirty way to get the units out from that ball that they tend
	to form.  Since it just uses random values to shake them apart, it takes awhile and looks
	ugly, someone might want to update it at some point.
	
	this.loseStack = function(unit)
	{
		var xdist = this.x - unit.x;
		var ydist = this.y - unit.y;
		this.mode = "move";
		this.getPath(this.x + xdist/3, this.y + ydist/3);
	}*/
}


Unit.prototype = {
render: function() {
},
update: function(elapsedTime) {
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
			this.openSet = new PointSet(),
			this.closedSet = new PointSet();
			this.targetx = x;
			this.targety = y;
			this.destNode = aStarSearch({x: Math.floor(this.targetx/64), y: Math.floor(this.targety/64)}, this.curNode, this.openSet, this.closedSet);
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
	to form.  Since it just uses random values to shake them apart, it takes awhile and looks
	ugly, someone might want to update it at some point.
	*/
	loseStack: function(unit)
	{
		var xdist = this.x - unit.x;
		var ydist = this.y - unit.y;
		this.mode = "move";
		this.getPath(this.x + xdist/3, this.y + ydist/3);
	}
}