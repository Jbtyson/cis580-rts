// UnitBar.js
var UnitBar = function() {
	this.panelImage = Resource.gui.img.unitPanel;
	this.unitBackgroundImage = Resource.gui.img.unitBackground;

	this.dimensions = { width:320, height:96 }
	this.position = { x:128, y:HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	
	this.unitList = [];
	this.unitThumbnails = []
	this.unitDimensions = { width:32, height:32 }
	this.unitStartPosition = { x:this.position.x + 32, y:this.position.y + 16 }
	this.maxUnitsDisplayed = ((this.dimensions.width / 32) - 2) * 2;
	this.maxUnitsInRow = this.maxUnitsDisplayed / 2;
}

UnitBar.prototype = {
	update: function(gameTime, unitList) {
		// Check for a new list
		if(this.unitList != unitList) {
			this.unitList = unitList;
			// Clear the thumbnails and create the new ones
			this.unitThumbnails = [];
			for(i = 0; i < this.maxUnitsDisplayed && i < this.unitList.length; i++) {
				this.unitThumbnails[i] = {};
				this.unitThumbnails[i].image = new Image();
				//this.unitThumbnails[i].image.src = "img/common_unit"; //this.unitList[i].thumbPath;
				this.unitThumbnails[i].position = {};
				this.unitThumbnails[i].position.x = this.unitStartPosition.x + i%8 * this.unitDimensions.width;
				this.unitThumbnails[i].position.y = (i < this.maxUnitsInRow) ? this.unitStartPosition.y : this.unitStartPosition.y + this.unitDimensions.height;
			}
		}
	},
	
	render: function(context) {
		context.save();
		// Render the panel
		context.drawImage(this.panelImage,this.position.x, this.position.y);
		
		// Render the unit thumbnails
		for(i = 0; i < this.unitThumbnails.length; i++) {
			// Render background for thumbnails
			context.drawImage(this.unitBackgroundImage, this.unitThumbnails[i].position.x, this.unitThumbnails[i].position.y);
			// Render thumbnail images
			//context.drawImage(this.unitThumbnails[i].image, this.unitThumbnails[i].position.x, this.unitThumbnails[i].position.y);
		}
		context.restore();
	},
}