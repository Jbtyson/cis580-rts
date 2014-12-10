
BUILDING_NAMES = [ "Townhall", "Connector"];
BUILDING_RESOURCE = [];
BUILDING_SPRITE_DATA = [ {x:0, y: 0, width: 32, height: 32} ]; 



var Building = function(type, x, y){
	
	this.type;
	this.buildTime;
	this.state;
	this.health;
	this.world_x = x;
	this.world_y = y;
}

Building.prototype = {
	
	render: function(context){
		context.drawImage(BUILDING_RESOURCE[this.type], 
							BUILDING_SPRITE_DATA[this.type].x, BUILDING_SPRITE_DATA[this.type].y, 
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height, 
							this.world_x - this.game.background.back_x, this.world_y, 
							BUILDING_SPRITE_DATA[this.type].width, BUILDING_SPRITE_DATA[this.type].height);
	},

	update: function(){
	},

	collide: function(object){
	}
}