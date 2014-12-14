// GuiResources.js
// James Tyson
//----------------------------------
GuiResources = function() {
	this.loading = 0;
	
	this.img = {
		// Minimap
		minimap: new Image(),
		
		// Unit Panel
		unitPanel: new Image(),
		unitBackground: new Image(),
		
		// Captain Portrait
		captain: new Image(),
		
		// Command Panel
		commandPanel: new Image(),
		commandButton: new Image(),
		
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
		onload = function() { this.loading -= 1;}
		// Minimap
		this.img.minimap.onload = onload;
		this.img.minimap.src = "img/ui/minimap.png";
		// Unit Panel
		this.img.unitPanel.onload = onload;
		this.img.unitPanel.src = "img/ui/unitPanel.png";
		this.img.unitBackground.onload = onload;
		this.img.unitBackground.src = "img/ui/unitBackground.png";
		// Captain Panel
		this.img.captain.onload = onload;
		this.img.captain.src = "img/ui/captainFalcon.png";
		// Command Panel
		this.img.commandPanel.onload = onload;
		this.img.commandPanel.src = "img/ui/commandPanel.png";
		this.img.commandButton.onload = onload;
		this.img.commandButton.src = "img/ui/commandButtonBackground.png";
		// Resource Bar
		this.img.resourceBar.onload = onload;
		this.img.resourceBar.src = "img/ui/resourceBar.png";
	
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}