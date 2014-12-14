var Towncenter = function(x,y,health,color) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.color = color;
	
	this.width = 128;
	this.height = 128;
	
	this.radius = 64; // needs to update to square hitbox
	
	this.borderwidth = 6;
}

Towncenter.prototype = new Building();

Towncenter.prototype.render = function(context) {
	var self = this;
	
	context.save();
	
	if (self.selected) {
		context.strokeStyle = "#00FF00";
	} else {
		context.strokeStyle = "#000000";
	}
	context.lineWidth = self.borderwidth;
	
	//translate to center of bldg
	context.translate(-0.5*self.width,-0.5*self.height);
	
	context.fillStyle = self.color;
	context.fillRect(self.x-globalx,self.y-globaly,self.height,self.width);
	context.strokeRect(self.x-globalx,self.y-globaly,self.height,self.width);
	
	context.restore();
	
	context.restore();
}

Towncenter.prototype.update = function() {

}

Towncenter.prototype.getHitbox = function() { // Update to square hitbox
	var self = this;

	return {
		type: "circle",
		x: self.x,
		y: self.y,
		radius: self.radius
	};
}