//mineralMine.js
//Aaron Schmidt
//Mineral mine to place on map, inherits PlayerResource

MINERALMINE_SPRITE_DATA = {x:0, y:0, width:64, height:64, animationFrames:12};

var MineralMine = function(x, y, amount) {
	
	this.animationFrame = 0;
	this.animationTime = 0;
	
	// x and y refer to center of MineralMine
	this.x = x;
	this.y = y;
	
	this.amount = amount;
	this.maxAmount = amount;
	
	this.width = 64;
	this.height = 64;
	// or radius = 16;
}

MineralMine.prototype = new PlayerResource();

MineralMine.prototype.render = function(context) {
	/* context.save();
	
	context.fillStyle = "#404040";
	context.fillRect( (this.x - globalx - this.width/2), (this.y - globaly - this.height/2), this.width, this.height);
	
	context.restore(); */
	
	context.save();
		context.translate( (this.x - globalx - this.width/2), (this.y - globaly - this.height/2) );
		context.drawImage(Resource.maps.img.resourceBlock,
							MINERALMINE_SPRITE_DATA.x + MINERALMINE_SPRITE_DATA.width * this.animationFrame, MINERALMINE_SPRITE_DATA.y,
							MINERALMINE_SPRITE_DATA.width, MINERALMINE_SPRITE_DATA.height,
							0, 0,
							this.width, this.height);

		
		context.restore();
}
	
MineralMine.prototype.update = function(elapsedTime) {
	
	if (this.amount > 0) this.animationTime += elapsedTime;
	else 
	{
		this.animationFrame = 0;
		this.animationTime = 0;
	}
	
	if(this.animationTime >= 50){
	    this.animationTime = 0;
	    this.animationFrame = (this.animationFrame + 1) % MINERALMINE_SPRITE_DATA.animationFrames;
	  }
}

MineralMine.prototype.getHitbox = function() {
	return {
		type: "rect",
		// recall x and y refer to center of MineralMine
		x: this.x - this.width/2,
		y: this.y - this.height/2,
		w: this.width,
		h: this.height
	};
	context.fillStyle = "#404040";
}