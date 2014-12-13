// max erdwien
// modified by: C.J. Dopheide
var Unit = function(x, y, health, faction) {
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
	this.faction = faction;
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
	this.destNode = {
		x: 0,
		y: 0,
	}
	this.nextNode = {
		x: 0,
		y: 0,
	}
	this.targetunit = null;
	
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
	
	this.loseStack = function(unit)
	{
		var movex = Math.random() * this.radius + Math.random() * -this.radius;
		var movey = Math.random() * this.radius + Math.random() * -this.radius;
		this.mode = "move";
		this.getPath(this.x - movex, this.y - movey);
	}
}