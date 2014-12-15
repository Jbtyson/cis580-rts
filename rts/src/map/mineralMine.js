//mineralMine.js
//Aaron Schmidt
//Mineral mine to place on map, inherits PlayerResource

var MineralMine = function(x, y, amount) {
	this.x = x;
	this.y = y;
	
	this.amount = amount;
	this.maxAmount = amount;
	
	this.width = 32;
	this.height = 32;
	// or radius = 16;
}

MineralMine.prototype = new PlayerResource();

MineralMine.prototype.render = function(context) {
	context.save();
	
	context.fillStyle = "#404040";
	context.fillRect( (this.x - globalx - this.width/2), (this.y - globaly - this.height/2), this.width, this.height);
	
	context.restore();
}
	
MineralMine.prototype.update = function() {
	// if collision with villager deduct from resource and give to villager
}

MineralMine.prototype.getHitbox = function() {
	return {
		type: "rect",
		x: this.x - this.width/2,
		y: this.y - this.height/2,
		w: this.width,
		h: this.height
	};
}