//Timer.js
//Alex Lesperance
var Timer = function()
{
	this.dimensions = { width: 64, height: 16 }
	this.position = {x: 0, y: HEIGHT - 128 - this.dimensions.height }
	this.hitbox = new Rectangle(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	this.runningTime = 0;
	this.seconds = 0.0;
	this.minutes = 0.0;
	this.hours = 0;
}

Timer.prototype = 
{
	update: function(gameTime)
	{
		this.runningTime += gameTime;
		if(this.runningTime >= 1000)
		{
			this.seconds++;
			if(this.seconds == 60)
			{
				this.minutes++;
				this.seconds = 0;
				if(this.minutes == 60)
				{
					this.hours++;
					this.minutes = 0;
				}
			}
			this.runningTime = 0;
		}
	},
	
	render: function(context)
	{
		context.save();
		context.fillStyle = "black"
		context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
		
		context.fillStyle = "yellow";
		context.font = "bold 14px Arial";
		context.fillText(this.hours + ":" + this.minutes + ":" + this.seconds, this.position.x + 16 , this.position.y + 12);
		context.restore();
	}
}
