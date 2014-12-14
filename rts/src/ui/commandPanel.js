// CommandPanel.js
// James Tyson
// Command panel displays all of the actions available to the current unit or building. "unit" can be either a building or a unit. Displays up to 9 actions.
var CommandPanel = function() {
	this.panelImage = Resource.gui.img.commandPanel
	this.buttonImage = Resource.gui.img.commandButton

	this.dimensions = { width:128, height:128 }
	this.buttonDimensions = { width:32, height:32 }
	this.position = { x: WIDTH - this.dimensions.width, y: HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	
	this.buttonStartPosition = { x:this.position.x + 16, y:this.position.y + 16 }
	this.maxButtons = 9;
	this.buttons = [];
}

CommandPanel.prototype = {
	update: function(gameTime, unit, building) {
		if(typeof(unit) == "undefined") {
			this.unit = unit;
		}
		if(typeof(building) == "undefined"){
		  this.building = building;
		}
		if(typeof(unit) == "undefined" && typeof(building) == "undefined"){
		  this.buttons = [];
		}
		
		if(this.unit != unit) {
			this.unit = unit;
			this.buttons = [];
			this.unit.actions.length = 9;
			for(i = 0; i < this.maxButtons && i < this.unit.actions.length; i++) {
				this.buttons[i] = {};
				this.buttons[i].image = new Image();
				//this.buttons[i].image.src = this.unit.actions[i].thumbPath;
				this.buttons[i].position = {};
				
				this.buttons[i].position.x = this.buttonStartPosition.x + i%3 * this.buttonDimensions.width;
				if(i < 3)
					this.buttons[i].position.y = this.buttonStartPosition.y;
				else if(i < 6)
					this.buttons[i].position.y = this.buttonStartPosition.y + this.buttonDimensions.height;
				else
					this.buttons[i].position.y = this.buttonStartPosition.y + 2*this.buttonDimensions.height;
			}
		}
		
		if(this.building != building){
		  this.building = building;
		  this.buttons = [];
		  for(i = 0; i < this.maxButtons; i++){
		    this.buttons[i] = {};
		    this.buttons[i].image = new Image();
		    this.buttons[i].position = {};
				this.buttons[i].position.x = this.buttonStartPosition.x + i%3 * this.buttonDimensions.width;
				if(i < 3)
					this.buttons[i].position.y = this.buttonStartPosition.y;
				else if(i < 6)
					this.buttons[i].position.y = this.buttonStartPosition.y + this.buttonDimensions.height;
				else
					this.buttons[i].position.y = this.buttonStartPosition.y + 2*this.buttonDimensions.height;
		  }
		}
	},
	
	render: function(context) {
		context.save();
		// Render background
		context.drawImage(this.panelImage, this.position.x, this.position.y);
		
		// Render all of the buttons
		for(i = 0; i < this.buttons.length; i++) {
		  
		  if(typeof(this.building) != "undefined" && i == 0){
		    
		    switch(this.building.type){
		      
		      case 0:
            // Render background for buttons
			      context.drawImage(Resource.gui.img.villagerCommandButton, this.buttons[i].position.x, this.buttons[i].position.y);
		        break;
		      default:
		        // Render background for buttons
			      context.drawImage(this.buttonImage, this.buttons[i].position.x, this.buttons[i].position.y);
		      }
		    }
		    else{
		      // Render background for buttons
		  	  context.drawImage(this.buttonImage, this.buttons[i].position.x, this.buttons[i].position.y);
		    }
		  }
		  
			// Render background for buttons
			//context.drawImage(this.buttonImage, this.buttons[i].position.x, this.buttons[i].position.y);
			// Render button images
			//context.drawImage(this.buttons[i].image, this.buttons[i].position.x, this.buttons[i].position.y);
		
		
		context.restore();
	},
}