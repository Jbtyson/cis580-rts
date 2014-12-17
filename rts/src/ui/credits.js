var Credits = function() {
	this.creditText = [
						"Programmers",
						"",
						"Alex Burch",
						"CJ Dopheide",
						"Max Erdwien",
						"Alex L'Esperance",
						"Brett Merriam",
						"Aaron Schmidt",
						"Michael Speirs",
						"Brent Thibodeaux",
						"James Tyson",
						"Yi Wang",
						"Ryan Woodburn",
						"Li Yuenyang",
						"Chris Delpire",
						"",
						"",
						"Soundtrack",
						"",
						"Manîthil by Algorythm",
						"Summer Soon by Martin Oakson",
						"Sad Candy by Neä",
						"Now by Outsider",
						"L'éther d'Afrique by Philippe Mangold",
						"Camels Breath by Wayne Robinson",
						"Sempre davanti a l'ochji by Sta a Sente",
					];
	this.x = WIDTH/2 - 200;
	this.y = HEIGHT;
	this.y0 = this.y;
	this.speed = 1;
	this.gap = 40;
	this.active = false;
}

Credits.prototype = {
	update: function() {
		if( this.active && this.y > -this.creditText.length*this.gap) { // after all off screen stop scrolling
			this.y -= this.speed;
		} else {
			this.active = false;
		}
	},
	
	render: function(context) {
		var self = this;
		
		context.save();
		
		// Draw black rect
		context.fillStyle = "#000000";
		context.fillRect(0,0,WIDTH,HEIGHT);
		
		context.font = "30px Arial";
		context.fillStyle = "#FFFFFF";
		// Draw text
		this.creditText.forEach( function(line,i) {
			context.fillText(line,self.x,self.y + i*self.gap);
		});
		
		context.restore();
	},
	
	reset: function() {
		this.y = this.y0;
		this.active = false;
	}
}