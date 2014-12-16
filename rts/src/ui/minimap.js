// Minimap.js
// James Tyson & Alex Lesperance
var Minimap = function() {

	this.image = Resource.gui.img.minimap;
	this.minimap = Resource.gui.img.minimap_map;

	this.dimensions = { width:128, height:128 }
	this.position = { x:0, y: HEIGHT - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	

	
}

Minimap.prototype = {
	update: function(gameTime) {
	},
	
	render: function(context, factions) {
		//save the context
		context.save();
		
		
		//draw minimap
		//context.drawImage(this.minimap, this.position.x, this.position.y);
		for(var i = 0; i < MINIMAP_TILES.length; i++)
		{
			context.drawImage(MINIMAP_TILES[i].image, MINIMAP_TILES[i].sx, MINIMAP_TILES[i].sy,
								MINIMAP_TILES[i].swidth, MINIMAP_TILES[i].sheight,
								MINIMAP_TILES[i].x, MINIMAP_TILES[i].y,
								MINIMAP_TILES[i].width, MINIMAP_TILES[i].height);
		}
		
		//draw a black rectangle around the minimap to give it a doodie border
		context.strokeStyle = 'black';
		context.strokeRect(this.position.x, this.position.y - 1, 128, 128);
		context.strokeRect(this.position.x, this.position.y - 2, 128, 128);	
		context.strokeRect(this.position.x, this.position.y - 3, 128, 128);
		context.strokeRect(this.position.x, this.position.y - 4, 128, 128);
		
		//draw the units / buildings on the map of mini size
		factions.forEach(function(faction) {
			for(var k = 0; k < faction.units.length; k++)
			{
				context.fillStyle = faction.color;
				context.beginPath();
				context.arc(faction.units[k].x / 10, 512 + (faction.units[k].y / 10), 1, 0, 2*Math.PI);
				context.fill();
				
			}
			faction.buildings.forEach( function(building) { 
				context.fillStyle = building.faction.color;
				context.beginPath();
				context.arc((building.x / 10) + 6.4, (512 + (building.y / 10)) + 6.4, 3, 0, 2*Math.PI);
				context.fill();
			});
		});
		
		//our view of the world.
		context.strokeStyle = "#83F52C"; //neon green yo
		context.strokeRect(this.position.x + (globalx / 10), this.position.y + (globaly / 10), 64, 64);
		
		
		
		
		//restore the context
		context.restore();
	},
}