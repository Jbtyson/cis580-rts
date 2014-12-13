//Timer.js
//Alex Lesperance
var Timer = function()
{
	this.dimensions = { width: 64, height: 16 }
	this.position = {x: 0, y: HEIGHT - 128 - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
}

Timer.prototype = 
{
	update: function(gameTime)
	{
		//http://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
		//http://jsfiddle.net/smallworld/ng22Y/1/
	},
	
	render: function(context)
	{
		context.save();
		context.fillStyle = "black"
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		context.restore();
	}
}
