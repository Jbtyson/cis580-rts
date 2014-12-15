// UnitPortrait.js
// James Tyson
var UnitPortrait = function() {
	this.image = Resource.gui.img.captain;

	this.dimensions = { width:64, height:128 }
	this.position = { x:WIDTH - 128 - this.dimensions.width, y:HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
}

UnitPortrait.prototype = {
	update: function(gameTime) {
		// Nothing to update right now, Falcon is our leader
	},
	
	render: function(context) {
		context.save();
		// Render transparent foreground image
		context.drawImage(this.image, this.position.x, this.position.y)
		context.restore();
	},
}