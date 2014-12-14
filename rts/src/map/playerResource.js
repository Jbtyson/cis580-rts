var PlayerResource = function(amount, maxAmount) {
	this.amount = amount;
	this.maxAmount = maxAmount;
}

PlayerResource.prototype = {
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
		return (this.amount + amount) < this.maxAmount;
	},
	
	subtract: function(amount) {
		this.amount -= amount;
		
		if (this.amount < 0) {
			this.amount = 0;
		}
	},
	
	canSubtract: function(amount) {
		return (this.amount - amount) > 0;
	}
}