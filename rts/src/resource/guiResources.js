// GuiResources.js
// James Tyson
//----------------------------------
GuiResources = function() {
	this.loading = 0;
	
	this.img = {
		// Minimap
		minimap: new Image(),
		
		// Unit Panel
		unitPanelBackground: new Image(),
		unitPortraitBackground: new Image(),
		
		// Captain Portrait
		captainBackground: new Image(),
		captainForeground: new Image(),
		
		// Command Panel
		buttonBackground: new Image(),
		commandPanel: new Image(),
		
		// Resource Bar
		resourceBar: new Image(),
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
		onload = function() { this.loading -= 1; console.log("got here");}
	
		this.img.resourceBar.onload = onload;
		this.img.resourceBar.src = "img/ui/resourceBar.png";
		this.img.commandPanel.onload = onload;
		this.img.commandPanel.src = "img/ui/commandPanel.png";
		this.img.minimap.onload = onload;
		this.img.minimap.src = "img/ui/minimap.png";
		
		
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}