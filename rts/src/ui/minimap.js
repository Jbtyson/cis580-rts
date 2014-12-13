// Minimap.js
// James Tyson
var Minimap = function() {
	this.image = Resource.gui.img.minimap;

	this.dimensions = { width:128, height:128 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
}

Minimap.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.save();
		context.drawImage(this.image, this.position.x, this.position.y);
		context.strokeStyle = 'green';
		context.strokeRect(this.position.x, this.position.y, 64, 64);
		context.restore();
	},
}