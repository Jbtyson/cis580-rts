
//Building Class created by Chris Delpire.
var PhantomBuilding = function(type, game){

	this.game = game;

	//Meta Data
	this.type = type;
	this.animationFrame = 0;
	this.animationTime = 0;

	this.factionIndex = 0;

	//Position Information
	this.world_x;
	this.world_y;
	this.orientation = 1;


}

//Building Prototype created by Chris Delpire
PhantomBuilding.prototype = {
	
	render: function(context){
	  
		//console.log(this.factionIndex);
		//Draw building.

		context.save();
		context.translate(this.game.input.mousex, this.game.input.mousey);
		//context.translate(BUILDING_SPRITE_DATA[this.type].width / 2, BUILDING_SPRITE_DATA[this.type].height / 2);
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
	   
	  var currentAmountOfBuildings = this.game.factions[0].buildings.length;
	  
		for(var i = 0; i < currentAmountOfBuildings ; i++){

			// Calculate how far away the phantom is from a building.
			var distance_x = (this.game.input.mousex - globalx) - (this.game.factions[0].buildings[i].world_x + BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].width / 2);
			var distance_y = (this.game.input.mousey - globaly) - (this.game.factions[0].buildings[i].world_y + BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].height / 2);
			var distance = Math.sqrt( distance_x * distance_x + distance_y * distance_y)

			// If a building is close enough to the phantom, then orient the building so that it
			// is facing the write direction.
			if(distance < BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].width){

				if(Math.abs(distance_y) < Math.abs(distance_x)){

					if(distance_x < 0){
						this.orientation = 2;
						
						if(this.game.tryToBuild && (this.game.factions[0].buildings[i].orientation == this.orientation || this.game.factions[0].buildings[i].type === 0)){
  						  buildNewBuilding( this.game.factions[0].buildings[i].world_x - BUILDING_SPRITE_DATA[this.type].width,
  						                    this.game.factions[0].buildings[i].world_y + ((BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].height - BUILDING_SPRITE_DATA[this.type].height) / 2),
  						                    this.type, this.game.factions[0].buildings, this.orientation, this.game);
  					
  					  
  				    this.game.phantom = null;
  					}
					}
					else{
						this.orientation = 0;
						
						// If the building is close enough to be built, the correct orientation, and the player clicks.
						// Then try to build the building.
  					if(this.game.tryToBuild && (this.game.factions[0].buildings[i].orientation == this.orientation || this.game.factions[0].buildings[i].type === 0)){
  						  buildNewBuilding( this.game.factions[0].buildings[i].world_x + BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].width,
  						                    this.game.factions[0].buildings[i].world_y + ((BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].height - BUILDING_SPRITE_DATA[this.type].height) / 2),
  						                    this.type, this.game.factions[0].buildings, this.orientation, this.game);
  					
  					  
  				    this.game.phantom = null;
  					}
					}
				}

				if(Math.abs(distance_x) < Math.abs(distance_y)){

					if(distance_y < 0){
						this.orientation = 3;

						// If the building is close enough to be built, the correct orientation, and the player clicks.
						// Then try to build the building.
						if(this.game.tryToBuild && (this.game.factions[0].buildings[i].orientation == this.orientation || this.game.factions[0].buildings[i].type === 0)){
  						  buildNewBuilding( this.game.factions[0].buildings[i].world_x + ((BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].width - BUILDING_SPRITE_DATA[this.type].width) / 2),
  						                    this.game.factions[0].buildings[i].world_y - BUILDING_SPRITE_DATA[this.type].height,
  						                    this.type, this.game.factions[0].buildings, this.orientation, this.game);
  					
  					  
  				    this.game.phantom = null;
  					}
					}
					else{
						this.orientation = 1;

						// If the building is close enough to be built, the correct orientation, and the player clicks.
						// Then try to build the building.
						if(this.game.tryToBuild && (this.game.factions[0].buildings[i].orientation == this.orientation || this.game.factions[0].buildings[i].type === 0)){
  						  buildNewBuilding( this.game.factions[0].buildings[i].world_x + ((BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].width - BUILDING_SPRITE_DATA[this.type].width) / 2),
  						                    this.game.factions[0].buildings[i].world_y + BUILDING_SPRITE_DATA[this.game.factions[0].buildings[i].type].height,
  						                    this.type, this.game.factions[0].buildings, this.orientation, this.game);
  					
  					  
  				    this.game.phantom = null;
  					}
					}
				}
			}
		}
			this.game.tryToBuild = false;
	},

}

//Helper function to build new buildings.
var buildNewBuilding = function(x, y, type, buildingArray, orientation, game){

  game.buildingVillager.mode = "build";
  game.buildingVillager.building = new Towncenter(x, y, orientation, 0, game);

  switch(type){
    
    case 0:
      buildingArray.push( new Towncenter(x, y, orientation, 0, game));
      break;
    case 1:
      buildingArray.push( new Connector(x, y, orientation, 0, game));
      break;
    case 2:
      buildingArray.push( new Barracks(x, y, orientation, 0, game));
      break;
    default:
    
  }
}