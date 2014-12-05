// UnitBar.js
var UnitBar = function(unitList) {
	this.unitList = unitList;

	this.dimensions = { width:320, height:96 }
	this.position = { x:128, y:HEIGHT - this.dimensions.height }
	
	this.unitDimensions = { width:32, height:32 }
	this.unitStartPosition = { x:this.position.x + 32, y: this.position.y + 32 }
}

UnitBar.prototype = {
	update: function(gameTime) {
		
	},
	
	render: function(context) {
		context.save();
		context.fillStyle = "red";
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.restore();
	},
}