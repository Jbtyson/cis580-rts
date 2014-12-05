// UnitResources.js
// James Tyson
//----------------------------------
UnitResources = function() {
	this.loading = 0;
	
	this.img = {
		//image: new Image(),
	};
	this.sfx = {
		//audio: new Audio(),
	};
}

UnitResources.prototype = {
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