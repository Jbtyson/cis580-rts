// CommandPanel.js
var CommandPanel = function() {
	this.dimensions = { width:128, height:128 }
	this.position = { x: WIDTH - this.dimensions.width, y: HEIGHT - this.dimensions.height }
}

CommandPanel.prototype = {
	update: function(gameTime) {
	
	},
	
	render: function(context) {
		context.save();
		context.fillStyle = "blue";
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.restore();
	},
}