// ResourceBar.js
// James Tyson
var ResourceBar = function(playerIndex) {
	this.playerIndex = playerIndex;
	this.image = Resource.gui.img.resourceBar;
	
	this.dimensions = { width:WIDTH, height:32 }
	this.position = { x:0, y:0 }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	this.iconDimensions = { width:16, height:16 }
	this.textOffset = { x:8, y:13 }
	
	this.mineralIcon = Resource.gui.img.mineralIcon;
	this.supplyIcon = Resource.gui.img.supplyIcon;
	
	// Objects to manage resource information
	this.minerals = {
		img: null,
		imgPosition: { x:this.position.x+8, y:this.position.y+8 },
		text: "",
		textPosition: { x:this.position.x+8 + this.iconDimensions.width + this.textOffset.x, 
						y:this.position.y+8 + this.textOffset.y }
	}
	/* this.gas = {
		img: null,
		imgPosition: { x:this.minerals.imgPosition.x+96, y:this.minerals.imgPosition.y },
		text: "",
		textPosition: { x:this.minerals.imgPosition.x+96 + this.iconDimensions.width + this.textOffset.x, 
						y:this.minerals.imgPosition.y + this.textOffset.y }
	} */
	this.supply = {
		img: null,
		imgPosition: { x:this.dimensions.width - 96, y:this.minerals.imgPosition.y },
		text: "",
		textPosition: { x:this.dimensions.width - 96 + this.iconDimensions.width + this.textOffset.x, 
						y:this.minerals.imgPosition.y + this.textOffset.y }
	}
}

ResourceBar.prototype = {
	update: function(gameTime) {
		this.minerals.text = game.factions[this.playerIndex].playerResources.minerals.amount;
		/* this.minerals.text = this.resources.minerals.amount; */
		/* this.gas.text = this.resources.gas; */
		/* this.supply.text = this.resources.supply.amount + " / " + this.resources.supply.maxAmount; */
		this.supply.text = game.factions[this.playerIndex].playerResources.supply.amount + " / " + game.factions[this.playerIndex].playerResources.supply.maxAmount;
	},
	
	render: function(context) {
		context.save();
		// Render the background
		context.drawImage(this.image, this.position.x, this.position.y);
		
		// Render the resource icons
		context.drawImage(this.mineralIcon, this.minerals.imgPosition.x, this.minerals.imgPosition.y)
		context.drawImage(this.supplyIcon, this.supply.imgPosition.x, this.supply.imgPosition.y);
		
		// Render the resource amounts
		context.font = 'normal 12pt Calibri';
		context.fillText(this.minerals.text, this.minerals.textPosition.x, this.minerals.textPosition.y);
		/* context.fillText(this.gas.text, this.gas.textPosition.x, this.gas.textPosition.y); */
		context.fillText(this.supply.text, this.supply.textPosition.x, this.supply.textPosition.y);
		
		
		context.restore();
	},
}