// ResourceBar.js
// James Tyson
var ResourceBar = function(resources) {
	this.resources = resources;

	this.dimensions = { width:WIDTH, height:32 }
	this.position = { x:0, y:0 }
	this.iconDimensions = { width:16, height:16 }
	this.textOffset = { x:8, y:13 }
	
	// Objects to manage resource information
	this.minerals = {
		img: null,
		imgPosition: { x:this.position.x+8, y:this.position.y+8 },
		text: "",
		textPosition: { x:this.position.x+8 + this.iconDimensions.width + this.textOffset.x, 
						y:this.position.y+8 + this.textOffset.y }
	}
	this.gas = {
		img: null,
		imgPosition: { x:this.minerals.imgPosition.x+128, y:this.minerals.imgPosition.y },
		text: "",
		textPosition: { x:this.minerals.imgPosition.x+128 + this.iconDimensions.width + this.textOffset.x, 
						y:this.minerals.imgPosition.y + this.textOffset.y }
	}
	this.supply = {
		img: null,
		imgPosition: { x:this.dimensions.width - 128, y:this.minerals.imgPosition.y },
		text: "",
		textPosition: { x:this.dimensions.width - 128 + this.iconDimensions.width + this.textOffset.x, 
						y:this.minerals.imgPosition.y + this.textOffset.y }
	}
}

ResourceBar.prototype = {
	update: function(gameTime) {
		this.minerals.text = this.resources.minerals;
		this.gas.text = this.resources.gas;
		this.supply.text = this.resources.supply + " / " + this.resources.supplyMax;
	},
	
	render: function(context) {
		context.save();
		// Render the background
		context.fillStyle = "blue";
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		
		// Render the resource icons
		context.fillStyle = "cyan";
		context.fillRect(this.minerals.imgPosition.x, this.minerals.imgPosition.y, this.iconDimensions.width, this.iconDimensions.height);
		context.fillStyle = "lime";
		context.fillRect(this.gas.imgPosition.x, this.gas.imgPosition.y, this.iconDimensions.width, this.iconDimensions.height);
		context.fillStyle = "white";
		context.fillRect(this.supply.imgPosition.x, this.supply.imgPosition.y, this.iconDimensions.width, this.iconDimensions.height);
		
		// Render the resource amounts
		context.font = 'normal 12pt Calibri';
		context.fillText(this.minerals.text, this.minerals.textPosition.x, this.minerals.textPosition.y);
		context.fillText(this.gas.text, this.gas.textPosition.x, this.gas.textPosition.y);
		context.fillText(this.supply.text, this.supply.textPosition.x, this.supply.textPosition.y);
		
		
		context.restore();
	},
}