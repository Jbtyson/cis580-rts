// BuildingResources.js
// James Tyson
//----------------------------------
BuildingResources = function() {
	this.loading = 3;
	
	//Building Resources by Chris Delpire.
	this.img = {
	  towncenter: [ new Image(), new Image() ],
	  towncenterSelection: new Image(),
		//image: new Image(),
	};
	this.sfx = {
		//audio: new Audio(),
	};
}

BuildingResources.prototype = {
	load: function() {
	  
	  this.img.towncenter[0].onload = this.onload;
	  this.img.towncenter[0].src = "img/buildings/Red_Towncenter_Sprite.png";
	  
	  this.img.towncenter[1].onload = this.onload;
    this.img.towncenter[1].src = "img/buildings/Blue_Towncenter_Sprite.png";
    
    this.img.towncenterSelection.onload = this.onload;
    this.img.towncenterSelection.src = "img/buildings/Towncenter_Select.png"
		// this.img.image.onload = this.onload;
		// this.img.image.src = "asf.png";
		
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}