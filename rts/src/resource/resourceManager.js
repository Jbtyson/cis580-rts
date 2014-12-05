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
		
		// Loop until we're finished loading
		while(this.loading) {
			if(this.maps.loading > 0) {}
				// do nothing
			else if(this.units.loading > 0) {}
				// do nothing
			else if(this.buildings.loading > 0) {}
				// do nothing
			else if(this.gui.loading > 0) {}
				// do nothing
			else
				this.loading = false;
		}
		
		console.log("successfully loaded");
	},
}