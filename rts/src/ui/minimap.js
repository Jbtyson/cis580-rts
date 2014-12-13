// Minimap.js
// James Tyson & Alex Lesperance
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
		context.strokeRect(this.position.x + (globalx / 10), this.position.y + (globaly / 10), 64, 64);
		context.restore();
		console.log(globalx);
		console.log(globaly);
	},
}