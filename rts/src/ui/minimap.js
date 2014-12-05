// Minimap.js
// James Tyson
var Minimap = function() {
	this.dimensions = { width:128, height:128 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
}

Minimap.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.save();
		context.fillStyle = "green";
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.restore();
	},
}