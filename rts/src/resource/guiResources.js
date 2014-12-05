// GuiResources.js
// James Tyson
//----------------------------------
GuiResources = function() {
	this.loading = 0;
	
	this.img = {
		// Minimap
		minimapBackground: new Image(),
		
		// Unit Panel
		unitPanelBackground: new Image(),
		unitPortraitBackground: new Image(),
		
		// Captain Portrait
		captainBackground: new Image(),
		captainForeground: new Image(),
		
		// Command Panel
		buttonBackground: new Image(),
		commandBackground: new Image(),
		
		// Resource Bar
		resourceBarBackground: new Image(),
		minerals: new Image(),
		gas: new Image(),
		supply: new Image(),
	};
	this.sfx = {
		// Need some button click sounds
	};
}

GuiResources.prototype = {
	load: function() {
		// this.img.image.onload = this.onload;
		// this.img.image.src = "asf.png";
		
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}