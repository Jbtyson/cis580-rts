// Minimap.js
// James Tyson & Alex Lesperance
var Minimap = function() {
	this.image = Resource.gui.img.minimap;
	this.minimap = Resource.gui.img.minimap_map;

	this.dimensions = { width:128, height:128 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	
}

Minimap.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.save();
		//context.drawImage(this.image, this.position.x, this.position.y);
		
		
		
		context.drawImage(this.minimap, this.position.x, this.position.y);
		context.strokeStyle = 'black';
		context.strokeRect(this.position.x, this.position.y - 1, 128, 128);
		context.strokeRect(this.position.x, this.position.y - 2, 128, 128);	
		context.strokeRect(this.position.x, this.position.y - 3, 128, 128);
		context.strokeRect(this.position.x, this.position.y - 4, 128, 128);
		context.strokeStyle = 'green';
		context.strokeRect(this.position.x + (globalx / 10), this.position.y + (globaly / 10), 64, 64);
		context.restore();
	},
}