// UnitResources.js
// James Tyson
//----------------------------------
UnitResources = function() {
	this.loading = 0;
	
	this.img = {
		//image: new Image(),
		villager: [ new Image(), new Image() ],
		soldier: [ new Image(), new Image() ],
		hoplite: [ new Image(), new Image() ],
		unitSelector: new Image()
		
	};
	this.sfx = {
		//audio: new Audio(),
	};
}

UnitResources.prototype = {
	load: function() {
		// this.img.image.onload = this.onload;
		// this.img.image.src = "asf.png";
		this.img.villager[1].onload = this.onload;
		this.img.villager[1].src = "img/units/Blue_Villager_Sprite.png";
	  
		this.img.villager[0].onload = this.onload;
		this.img.villager[0].src = "img/units/Red_Villager_Sprite.png";
		
		this.img.soldier[1].onload = this.onload;
		this.img.soldier[1].src = "img/units/Blue_Soldier_Sprite.png";
	  
		this.img.soldier[0].onload = this.onload;
		this.img.soldier[0].src = "img/units/Red_Soldier_Sprite.png";
		
		this.img.hoplite[1].onload = this.onload;
		this.img.hoplite[1].src = "img/units/Blue_Hoplite_Sprite.png";
	  
		this.img.hoplite[0].onload = this.onload;
		this.img.hoplite[0].src = "img/units/Red_Hoplite_Sprite.png";
		
		this.img.unitSelector.src = "img/units/UnitSelector.png"
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}