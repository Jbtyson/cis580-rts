var Towncenter = function(x,y,health,color) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.color = color;
}

Towncenter.prototype = new Building(100,100,100,"#000000");

Towncenter.prototype.render = function() {

}

Towncenter.prototype.update = function() {

}