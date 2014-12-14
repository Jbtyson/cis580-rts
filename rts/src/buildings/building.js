
//Resource Arrays created by Chris Delpire.
BUILDING_NAMES = ["Townhall"];
BUILDING_COST = [ {res1:100, res2:0} ];
BUILDING_SPRITE_DATA = [ {x:0, y: 0, width: 128, height: 128, animationFrames: 12} ];
BUILDING_RESOURCE = []

//Building Class created by Chris Delpire.
var Building = function(type, faction, game){
	// Default values
	this.x = 100;
	this.y = 100;
	this.health = 100;
	this.color = "#000000";
	
	this.type = type;
	
	this.game = game;
	
	this.faction = faction;
	
	this.width = 64;
	this.height = 64;
	
	this.gatherPoint = {x:100,y:100};
	
	this.barricadedUnits = [];
	
	this.animationFrame = 0;
	this.animationTime = 0;
	
	this.selected = false;

	this.buildTime;
	this.state;
	this.world_x;
	this.world_y;
}

//Building Prototype created by Chris Delpire
Building.prototype = {
	
	render: function(context){
	  
	  //Draw building selection box;
	  if(this.selected){
	    context.drawImage(this.game.Resource.buildings.img.towncenterSelection,
							BUILDING_SPRITE_DATA[this.type].x, BUILDING_SPRITE_DATA[this.type].y,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height,
							this.world_x - globalx, this.world_y - globaly,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height);
	    
	  }
	  
	  //Draw building.
		context.drawImage(this.game.Resource.buildings.img.towncenter[this.faction],
							BUILDING_SPRITE_DATA[this.type].x + BUILDING_SPRITE_DATA[this.type].width * this.animationFrame, BUILDING_SPRITE_DATA[this.type].y,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height,
							this.world_x - globalx, this.world_y - globaly,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height);
		
	},

	update: function(elapsedTime){
	  
	  
	  this.animationTime += elapsedTime;
	  
	  if(this.animationTime >= 50){
	    this.animationTime = 0;
	    this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	  }
	},
	
	getHitbox: function() {

	},

	collide: function(object){
	}
}