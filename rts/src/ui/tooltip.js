// Tooltip.js
// James Tyson
// Tooltips display useful information when the mouse hovers over certain objects
var Tooltip = function(gui) {
	this.gui = gui;
	this.dimensions = { width:64, height:32 }
	this.position = { x:0, y:0 }
	this.offset = { x:0, y:0 }
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
			// if we have a button, check it
			if(this.buttonId > -1) {
				if(this.gui.commandPanel.buttons[this.buttonId].hitbox.contains(this.position.x, this.position.y)) {
					if(self.timer >= self.timeToDisplay) {
						self.show = true;
						self.text = this.gui.commandPanel.buttons[this.buttonId].tooltipText;
					}
				}
				else {
					this.reset();
				}
			}
			// else we check all of the buttons and find the new one
			else {
				this.gui.commandPanel.buttons.forEach(function(button) { // is it over a button
					if(button.hitbox.contains(self.position.x, self.position.y)) {
						self.reset();
						self.buttonId = button.id;
					}
				});
			}
		}
		else {
			this.reset();
		}
	},
	
	render: function(context) {
		if(this.show) {
			context.save();
			context.fillStyle = "black";
			context.fillRect(this.position.x + this.offset.x, this.position.y - this.dimensions.height, this.dimensions.width, this.dimensions.height);
			context.fillStyle = "white";
			this.wrapText(context);
			context.restore();
		}
	},
	
	updateMousePos: function(mousePosX, mousePosY) {
		this.position.x = mousePosX;
		this.position.y = mousePosY;
		
		if(this.position.x + this.dimensions.width > WIDTH)
			this.offset.x = -this.dimensions.width;
		else
			this.offset.x = 0;
	},
	
	reset: function() {
		this.timer = 0;
		this.buttonId = -1;
		this.show = false;
	},
	
	wrapText: function(context) {
        var words = this.text.split(" ");
		var x = this.position.x+this.offset.x+2;
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