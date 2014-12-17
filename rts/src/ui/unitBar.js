// UnitBar.js
// James Tyson
var UnitBar = function() {
	this.panelImage = Resource.gui.img.unitPanel;
	this.unitBackgroundImage = Resource.gui.img.unitBackground;

	this.dimensions = { width:320, height:96 }
	this.position = { x:128, y:HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	
	this.unitList = [];
	this.buttons = []
	this.unitDimensions = { width:32, height:32 }
	this.unitStartPosition = { x:this.position.x + 32, y:this.position.y + 16 }
	this.maxUnitsDisplayed = ((this.dimensions.width / 32) - 2) * 2;
	this.maxUnitsInRow = this.maxUnitsDisplayed / 2;
}

UnitBar.prototype = {
	update: function(gameTime, unitList) {
		if(typeof(unitList) == "undefined") {
			this.buttons = [];
		}
		// Check for a new list
		else if(this.unitList !== unitList || this.buttons.length !== unitList.length) {
			this.unitList = unitList;
			this.unit = unitList[0];
			// Clear the thumbnails and create the new ones
			this.buttons = [];
			for(i = 0; i < this.maxUnitsDisplayed && i < this.unitList.length; i++) {
				this.buttons[i] = new Button();
				this.buttons[i].image = this.unitList[i].thumbnail;
				if (this.buttons[i].image === undefined) {
					console.log(this.unitList[i]);
				}
				this.buttons[i].position = {};
				this.buttons[i].position.x = this.unitStartPosition.x + i%8 * this.unitDimensions.width;
				this.buttons[i].position.y = (i < this.maxUnitsInRow) ? this.unitStartPosition.y : this.unitStartPosition.y + this.unitDimensions.height;
				
				this.buttons[i].id = i;
				this.buttons[i].dimensions = this.unitDimensions;
				this.buttons[i].updateHitbox(); // this is a bandaid, remove later if time
			}
		}
	},
	
	render: function(context) {
		context.save();
		// Render the panel
		context.drawImage(this.panelImage,this.position.x, this.position.y);
		
		// Render the unit thumbnails
		for(i = 0; i < this.buttons.length; i++) {
			// Render background for thumbnails
			context.drawImage(this.unitBackgroundImage, this.buttons[i].position.x, this.buttons[i].position.y);
			// Render thumbnail images
			this.buttons[i].render(context);
		}
		context.restore();
	},
}