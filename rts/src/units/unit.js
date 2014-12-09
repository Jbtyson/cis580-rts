// max erdwien
var Unit = function(x, y, health, color) {
	this.x = x;
	this.y = y;
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
	this.targetunit = null;
	this.actions = [];
}