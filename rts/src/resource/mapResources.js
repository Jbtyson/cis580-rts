// MapResources.js
// James Tyson
//----------------------------------
MapResources = function() {
	this.loading = 1;
	
	this.img = {
		//image: new Image(),
		resourceBlock: new Image()
	};
	this.sfx = {
		//audio: new Audio(),
	};
}

MapResources.prototype = {
	load: function() {
		// this.img.image.onload = this.onload;
		// this.img.image.src = "asf.png";
		this.img.resourceBlock.onload = this.onload;
		this.img.resourceBlock.src = "img/Resource_Block.png";
		
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}