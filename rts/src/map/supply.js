//supply.js
//Aaron Schmidt

var Supply = function(maxSupply) {
	this.amount = 0;
	this.maxAmount = maxSupply;
}

Supply.prototype = new PlayerResource();