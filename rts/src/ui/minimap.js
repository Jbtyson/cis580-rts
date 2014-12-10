// Minimap.js
// James Tyson
var Minimap = function() {
	this.image = Resource.gui.img.minimap;

	this.dimensions = { width:128, height:128 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
}

Minimap.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.save();
		context.drawImage(this.image, this.position.x, this.position.y);
		context.restore();
	},
}