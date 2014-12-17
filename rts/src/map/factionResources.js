//factionResources.js
//Aaron Schmidt
//holds faction resource objects

var STARTING_MINERALS = 800;
var STARTING_MAX_SUPPLY = 10;

var FactionResources = function() {
	this.minerals = new Minerals(STARTING_MINERALS);
	this.supply = new Supply(STARTING_MAX_SUPPLY);
}

FactionResources.prototype = {

}