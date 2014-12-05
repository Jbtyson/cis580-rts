// ResourceBar.js
var ResourceBar = function() {
	this.dimensions = { width:WIDTH, height:32 }
	this.position = { x:0, y:0 }
}

ResourceBar.prototype = {
	update: function(gameTime) {
	
	},
	
	render: function(context) {
		context.save();
		context.fillStyle = "blue";
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.restore();
	},
}