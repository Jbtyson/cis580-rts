// UnitPortrait.js
// James Tyson, Alex Lesperance
var UnitPortrait = function() {
	this.dimensions = { width:64, height:128 }
	this.position = { x:WIDTH - 128 - this.dimensions.width, y:HEIGHT - this.dimensions.height }
	
	this.foregroundImage = new Image();
	this.foregroundImage.src = "img/captain.png";
}

UnitPortrait.prototype = {
	update: function(gameTime) {
		// Nothing to update right now, Falcon is our leader
	},
	
	render: function(context) {
		context.save();
		// Render background image
		context.fillStyle = "white";
		
		// Render foreground image
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.drawImage(this.foregroundImage, this.position.x, this.position.y)
		context.restore();
	},
}