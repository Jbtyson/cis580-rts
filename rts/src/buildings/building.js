
//Resource Arrays created by Chris Delpire.
BUILDING_NAMES = ["Townhall", "Connector", "Barracks"];
BUILDING_COST = [ {res1:100, res2:0} ];
BUILDING_SPRITE_DATA = [ {x:0, y: 0, width: 128, height: 128, animationFrames: 12}, {x:0, y: 0, width: 64, height: 64, animationFrames: 12}, {x:0, y: 0, width: 64, height: 64, animationFrames: 12} ];


//Building Class created by Chris Delpire.
var Building = function(type, orientation, factionIndex, game){

	this.game = game;

	//Meta Data
	this.type = type;
	this.factionIndex = factionIndex;
	this.animationFrame = 0;
	this.animationTime = 0;

	//Position Information
	this.world_x;
	this.world_y;
	this.orientation = orientation;

	//State Information
	this.selected = false;
	this.isBuilding = false;
	this.buildPercent;
	this.buildTime;
	this.health = 100;

	this.gatherPoint = {x:100,y:100};
	
	this.barricadedUnits = [];

}

//Building Prototype created by Chris Delpire
Building.prototype = {
	
	render: function(context){
	  
		//Draw health bar.
		context.save();
		context.fillStyle = "#00FF00";
		context.fillRect(this.world_x - globalx + 10, this.world_y - globaly - 15, this.health, 5);
		context.restore();

		//Draw build progress bar.
		if(this.isBuilding){
			context.save();
			context.fillStyle = "#FFFFFF";
			context.fillRect(this.world_x - globalx + 10, this.world_y - globaly - 10, Math.floor(this.health * this.buildPercent), 5);
			context.restore();
		}


		//Draw building selection box.
		if(this.selected){
		context.save();
		context.translate(this.world_x - globalx, this.world_y - globaly);
		context.translate(BUILDING_SPRITE_DATA[this.type].width / 2, BUILDING_SPRITE_DATA[this.type].height / 2);
		context.rotate((Math.PI / 2) * this.orientation);
		context.translate(-BUILDING_SPRITE_DATA[this.type].width / 2, -BUILDING_SPRITE_DATA[this.type].height / 2);
		context.drawImage(Resource.buildings.img.buildingSelection[this.type],
							BUILDING_SPRITE_DATA[this.type].x, BUILDING_SPRITE_DATA[this.type].y,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height,
							0, 0,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height);
		
		context.restore();

		}
		//console.log(this.factionIndex);
		//Draw building.

		context.save();
		context.translate(this.world_x - globalx, this.world_y - globaly);
		context.translate(BUILDING_SPRITE_DATA[this.type].width / 2, BUILDING_SPRITE_DATA[this.type].height / 2);
		context.rotate((Math.PI / 2) * this.orientation);
		context.translate(-BUILDING_SPRITE_DATA[this.type].width / 2, -BUILDING_SPRITE_DATA[this.type].height / 2);
		context.drawImage(Resource.buildings.img.buildingSpriteSheet[this.factionIndex][this.type],
							BUILDING_SPRITE_DATA[this.type].x + BUILDING_SPRITE_DATA[this.type].width * this.animationFrame, BUILDING_SPRITE_DATA[this.type].y,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height,
							0, 0,
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height);

		
		context.restore();
		
	},

	update: function(elapsedTime){
	   
	  this.animationTime += elapsedTime;
	  
	  if(this.animationTime >= 50){
	    this.animationTime = 0;
	    this.animationFrame = (this.animationFrame + 1) % BUILDING_SPRITE_DATA[this.type].animationFrames;
	  }
	},

	takeDamage: function(damage){
		this.damage -= damage;

		if(damage <= 0){
		//Destroy building.
		}
	},
	
	getHitbox: function() {
		var self = this;

		return {
			type: "rect",
			x:self.world_x,
			y:self.world_y,
			h:BUILDING_SPRITE_DATA[this.type].height,
			w:BUILDING_SPRITE_DATA[this.type].width,
		};
	},

	collide: function(object){
	}
}