var Towncenter = function(x,y,health,color) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.color = color;
	
	this.width = 128;
	this.height = 128;
}

Towncenter.prototype = new Building();

Towncenter.prototype.render = function(context) {
	var self = this;
	
	context.save();
	
	context.fillStyle = self.color;
	context.fillRect(self.x-globalx,self.y-globaly,self.height,self.width);
	
	context.restore();
}

Towncenter.prototype.update = function() {

}