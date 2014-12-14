var Metal = function(x,y,quantity) {
	this.x = x;
	this.y = y;
	this.quantity = quantity;
	
	this.width = 32;
	this.height = 32;
	// or radius = 16;
}

Metal.prototype = new Resource();

Metal.prototype.render = function(context) {
	context.save();
	
	context.fillStyle = "#404040";
	context.fillRect(this.x-globalx,this.y-globaly,this.width,this.height);
	
	context.restore();
}
	
Metal.prototype.update = function() {
	// if collision with villager deduct from resource and give to villager
}