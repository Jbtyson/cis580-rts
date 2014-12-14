var Towncenter = function(x,y,health,color, game) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.color = color;
	
	this.game = game;
	
	if(this.color == "#FF0000"){
	  this.faction = 1;
	}
	else{
	  this.faction = 0;
	}
	
	this.width = 128;
	this.height = 128;
	
	this.radius = 64; // needs to update to square hitbox
	
	this.borderwidth = 6;
	
	this.world_x = x;
	this.world_y = y;

	this.unitQueue = [];
	
	this.actions = [{thumbnail:Resource.gui.img.villagerCommandButton, onClick:this.buildVillager()}];
}

Towncenter.prototype = new Building(0, this.faction, this.game);

/*Towncenter.prototype.render = function(context) {
	var self = this;
	
	context.save();
	
	if (self.selected) {
		context.strokeStyle = "#00FF00";
	} else {
		context.strokeStyle = "#000000";
	}
	context.lineWidth = self.borderwidth;
	
	//translate to center of bldg
	context.translate(-0.5*self.width,-0.5*self.height);
	
	context.fillStyle = self.color;
	context.fillRect(self.x-globalx,self.y-globaly,self.height,self.width);
	context.strokeRect(self.x-globalx,self.y-globaly,self.height,self.width);
	
	context.restore();
	
	context.restore();
}*/

Towncenter.prototype.update = function(elapsedTime) {

	  this.animationTime += elapsedTime;
	  
	  //Move the animation frame.
	  if(this.animationTime >= 50){
	    this.animationTime = 0;
	    this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	  }

	  //Check if the Towncenter is building a unit.
	  if(this.unitQueue.length > 0){
	  	this.unitQueue[0] -= elapsedTime;

	  	this.buildPercent = this.unitQueue[0] / 2500;

	  	if(this.unitQueue[0] <= 0){
	  		this.unitQueue.shift();
	  		this.game.factions[this.faction].units.push(new Infantry(this.world_x + 64, this.world_y + 128, "#FF0000", this.game));
	  	}
	  }
	  else{
	  	this.isBuilding = false;
	  }

},

Towncenter.prototype.buildVillager = function(){

	//TODO: Check if the player has enough resources.

	//TODO: Remove the necessary resources to build the unit.

	this.unitQueue.push(2500);
	this.isBuilding = true;

}



Towncenter.prototype.getHitbox = function() { // Update to square hitbox
	var self = this;

	return {
		type: "rect",
		x:self.x,
		y:self.y,
		h:128,
		w:128,
	};
}