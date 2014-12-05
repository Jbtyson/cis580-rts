// Minimap.js
// James Tyson
var Minimap = function() {
	this.dimemsions = { width:100, height:100 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
}

Minimap.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height;
	},
}