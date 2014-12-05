// ResourceManager.js
// James Tyson
//----------------------------------
ResourceManager = function() {
	this.loading = true;

	this.gui = new GuiResources();
	this.units = new UnitResources();
	this.buildings = new BuildingResources();
	this.maps = new MapResources();
}

ResourceManager.prototype = {
	load: function() {
		this.maps.load();
		this.units.load();
		this.buildings.load();
		this.gui.load();
		
		console.log("successfully loaded");
	},
}