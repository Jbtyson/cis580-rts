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
		
		
		//context.drawImage(this.image, this.position.x, this.position.y);
		
		
		//draw minimap
		context.drawImage(this.minimap, this.position.x, this.position.y);
		
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
				console.log(faction.units);
				context.beginPath();
				
			}
			faction.buildings.forEach( function(building) { 
				if(building.faction.color === "#FF0000")
				{
					context.fillStyle = 'red';
				}
				else
				{
					context.fillStyle = 'blue';
				}
				context.beginPath();
				context.arc(Math.ceil(building.x / 10), 512 + building.y / 10, 3, 0, 2*Math.PI);
				context.fill();
			});
		});
		
		//our view of the world.
		context.strokeStyle = 'green';
		context.strokeRect(this.position.x + (globalx / 10), this.position.y + (globaly / 10), 64, 64);
		
		
		
		
		//restore the context
		context.restore();
	},
}