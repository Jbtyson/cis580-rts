// BuildingResources.js
// James Tyson
//----------------------------------
BuildingResources = function() {
	this.loading = 9;
	
	//Building Resources by Chris Delpire.
	this.img = {
	  buildingSpriteSheet: [ [ new Image(), new Image(), new Image() ], [new Image(), new Image(), new Image()] ],
	  buildingSelection: [ new Image(), new Image(), new Image() ],

	};
	this.sfx = {
		//audio: new Audio(),
	};
}

BuildingResources.prototype = {
	load: function() {
	  
	//By Chris Delpire
	//Building Sprite Sheets by [Faction][Building Type]
	this.img.buildingSpriteSheet[0][0].onload = this.onload;
	this.img.buildingSpriteSheet[0][0].src = "img/buildings/Red_Towncenter_Sprite.png";
	  
	this.img.buildingSpriteSheet[1][0].onload = this.onload;
	this.img.buildingSpriteSheet[1][0].src = "img/buildings/Blue_Towncenter_Sprite.png";

	this.img.buildingSpriteSheet[0][1].onload = this.onload;
	this.img.buildingSpriteSheet[0][1].src = "img/buildings/Red_Connector_Final_Sprite.png";
	  
	this.img.buildingSpriteSheet[1][1].onload = this.onload;
	this.img.buildingSpriteSheet[1][1].src = "img/buildings/Blue_Connector_Final_Sprite.png";

	this.img.buildingSpriteSheet[0][2].onload = this.onload;
	this.img.buildingSpriteSheet[0][2].src = "img/buildings/Red_Barracks_Final_Sprite.png";
	  
	this.img.buildingSpriteSheet[1][2].onload = this.onload;
	this.img.buildingSpriteSheet[1][2].src = "img/buildings/Blue_Barracks_Final_Sprite.png";

	//Building selection image by [Building Type].
	this.img.buildingSelection[0].onload = this.onload;
	this.img.buildingSelection[0].src = "img/buildings/Towncenter_Select.png"

	this.img.buildingSelection[1].onload = this.onload;
	this.img.buildingSelection[1].src = "img/buildings/Connector_Select.png"

	this.img.buildingSelection[2].onload = this.onload;
	this.img.buildingSelection[2].src = "img/buildings/Connector_Select.png"

		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	}
}