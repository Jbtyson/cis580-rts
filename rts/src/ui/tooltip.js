// Tooltip.js
// James Tyson
// Tooltips display useful information when the mouse hovers over certain objects
var Tooltip = function(gui) {
	this.gui = gui;
	this.dimensions = { width:64, height:32 }
	this.position = { x:0, y:0 }
	this.buttonId = -1;
	this.show = false;
	this.timer = 0;
	this.timeToDisplay = 1000;
	this.text = "";
	this.maxTextLines = 4;
};

Tooltip.prototype = {	
	update: function(gameTime) {
		self = this;
		self.timer += gameTime;
		if(this.gui.commandPanel.hitbox.contains(this.position.x, this.position.y)) { // is it in the command panel
			this.gui.commandPanel.buttons.forEach(function(button) { // is it over a button
				if(button.hitbox.contains(self.position.x, self.position.y)) {
					if(button.id === self.buttonId) {	// is it over the same button
						if(self.timer >= self.timeToDisplay) {
							self.show = true;
							self.text = button.tooltipText;
						}
					}
					else {	// is over a different button
						self.reset();
						self.buttonId = button.id;
					}
				}
				else {
					//self.reset();
				}
			});
		}
		else {
			this.reset();
		}
	},
	
	render: function(context) {
		if(this.show) {
			context.save();
			context.fillStyle = "black";
			context.fillRect(this.position.x, this.position.y - this.dimensions.height, this.dimensions.width, this.dimensions.height);
			context.fillStyle = "white";
			this.wrapText(context);
			context.restore();
		}
	},
	
	updateMousePos: function(mousePosX, mousePosY) {
		this.position.x = mousePosX;
		this.position.y = mousePosY;
	},
	
	reset: function() {
		this.timer = 0;
		this.buttonId = -1;
		this.show = false;
	},
	
	wrapText: function(context) {
        var words = this.text.split(" ");
		var x = this.position.x+2;
		var y = this.position.y-25;
		var numLines = 0;
        var line = "";
        for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			
			if(testWidth > this.dimensions.width-4) {
				numLines++;
				if(numLines >= this.maxTextLines) {
					break;
				}
				context.fillText(line, x, y);
				line = words[n] + " ";
				y += 8;
			}
			else
				line = testLine;
        }
		context.fillText(line, x, y);
	},
};