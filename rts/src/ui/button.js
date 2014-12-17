// Button.js
// James Tyson
var Button = function() {
	this.dimensions = { x:0, y:0 }
	this.position = { x:0, y:0 }
	this.id = -1;
	this.image = null;
	this.tooltipText = "this text can be near this long to wrap correctly";
	
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
};

Button.prototype = {
	update: function(gameTime) {
	
	},
	
	render: function(context) {
		context.drawImage(this.image, this.position.x, this.position.y);
	},
	
	updateHitbox: function() {
		this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	},
};