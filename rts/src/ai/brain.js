var Brain = function(faction) {
	this.body = new Body(faction);
	
	this.time = 11;
	// a stack of all the failure messages we get as we traverse the decision flow chart
	// used to detect cycles
	this.failure_stack;
}

Brain.prototype = {
	MAX_TIME: 15,
	
	// goes through flow chart once every MAX_TIME seconds
	update: function(elapsedTime) {
		//this.time += elapsedTime/1000;
		if (this.time >= this.MAX_TIME) {
			this.time -= this.MAX_TIME;
			this.traverse();
		}
	},
	
	traverse: function() {
		this.failure_stack = new Array();
		var r = this.body.buildSoldiers();
		console.log("starting process");
		this.process(r);
		console.log(this.body.faction);
	},
	
	process: function(problem) {
		for (var i = 0; i < this.failure_stack.length; i++) {
			if (this.failure_stack[i] == problem) {
				// we're in a cycle. nothing will get done this time
				return;
			}
		}
		this.failure_stack.push(problem);
		var nextStep = null;
		console.log(problem);
		switch (problem) {
			case "success":
				return;
			case "need_minerals":
				nextStep = this.body.gatherMinerals();
				break;
			case "towncenters_maxed":
				nextStep = this.body.buildTowncenter();
				break;
			case "need_builder":
				nextStep = this.body.buildVillager();
				break;
			case "need_gatherer":
				nextStep = this.body.buildVillager();
				break;
			default:
				console.log("error: invalid return value");
				console.log(problem);
				break;
		}
		this.process(nextStep);
	}
}
















