// max erdwien
var Faction = function(color) {
	this.color = color;
	this.units = [];
	this.buildings = [];
	this.playerResources = new FactionResources();
	this.armies = new Array();
}

Faction.prototype = {

}