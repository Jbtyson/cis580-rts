//playerResource.js
//Aaron Schmidt
//Resource prototype

var PlayerResource = function() {
}

PlayerResource.prototype = {
	amount: 0,
	maxAmount: 0,
	
	render: function() {
	
	},
	
	update: function() {
	
	},
	
	add: function(amount) {
		this.amount += amount;
		
		if (this.amount > this.maxAmount) {
			this.amount = this.maxAmount;
		}
	},
	
	canAdd: function(amount) {
		return (this.amount + amount) <= this.maxAmount;
	},
	
	subtract: function(amount) {
		this.amount -= amount;
		
		if (this.amount < 0) {
			this.amount = 0;
		}
	},
	
	canSubtract: function(amount) {
		return (this.amount - amount) >= 0;
	}
}