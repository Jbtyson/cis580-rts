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
};

Tooltip.prototype = {	
	update: function(gameTime) {
		self = this;
		self.timer += gameTime;
		if(self.gui.commandPanel.hitbox.contains(this.position.x, this.position.y)) { // is it in the command panel
			self.gui.commandPanel.buttons.forEach(function(button) { // is it over a button
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
					self.reset();
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
			context.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
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
};