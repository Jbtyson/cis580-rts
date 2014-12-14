var Resource = function(amount, maxAmount) {
	this.amount = amount;
	this.maxAmount = maxAmount;
}

Resource.prototype = {
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
	}
}