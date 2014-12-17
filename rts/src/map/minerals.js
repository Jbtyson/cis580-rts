//minerals.js
//Aaron Schmidt

var Minerals = function(amount) {
	this.amount = amount;
	this.maxAmount = 99999;
}

Minerals.prototype = new PlayerResource();