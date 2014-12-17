// GuiResources.js
// James Tyson
//----------------------------------
GuiResources = function() {
	this.loading = 13;
	
	this.img = {
		// Minimap
		minimap: new Image(),
		minimap_map: new Image(),
		
		// Unit Panel
		unitPanel: new Image(),
		unitBackground: new Image(),
		
		// Captain Portrait
		captain: new Image(),
		
		// Command Panel
		commandPanel: new Image(),
		villagerCommandButton: new Image(),
		hopliteCommandButton: new Image(),
		infantryCommandButton: new Image(),
		towncenterCommandButton: new Image(),
		barracksCommandButton: new Image(),
		connectorCommandButton: new Image(),
		commandButton: new Image(),
		
		// Resource Bar
		resourceBar: new Image(),
		mineralIcon: new Image(),
		supplyIcon: new Image(),
		
		// Splash Screen
		splash: new Image()
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
		this.img.minimap_map.onload = onload;
		this.img.minimap_map.src = "img/ui/rts_minimap.png";
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
		this.img.mineralIcon.onload = onload;
		this.img.mineralIcon.src = "img/ui/mineralIcon.png";
		this.img.supplyIcon.onload = onload;
		this.img.supplyIcon.src = "img/ui/supplyIcon.png";
		// Splash Screen
		this.img.splash.onload = onload;
		this.img.splash.src = "img/startScreen.png";
		
		this.img.villagerCommandButton.onload = onload;
		this.img.villagerCommandButton.src = "img/ui/villagerCommandButton.png";
		
		this.img.hopliteCommandButton.onload = onload;
		this.img.hopliteCommandButton.src = "img/ui/hopliteCommandButton.png";
		
		this.img.infantryCommandButton.onload = onload;
		this.img.infantryCommandButton.src = "img/ui/infantryCommandButton.png";
		
		this.img.towncenterCommandButton.onload = onload;
		this.img.towncenterCommandButton.src = "img/ui/towncenterCommandButton.png";

		this.img.barracksCommandButton.onload = onload;
		this.img.barracksCommandButton.src = "img/ui/barracksCommandButton.png";

		this.img.connectorCommandButton.onload = onload;
		this.img.connectorCommandButton.src = "img/ui/connectorCommandButton.png";
	
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}