var Barracks = function(x,y,health,faction) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.faction = faction;
	
	this.width = 64;
	this.height = 64;
}

Barracks.prototype = new Building();

Barracks.prototype.render = function(context) {
	var self = this;
	
	context.save();
	
	context.fillStyle = self.color;
	context.fillRect(self.x-globalx,self.y-globaly,self.height,self.width);
	
	context.restore();
}

Barracks.prototype.update = function() {

}