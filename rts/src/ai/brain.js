var Brain = function(body) {
	this.body = body;
	
	this.time = 0;
	// a stack of all the failure messages we get as we traverse the decision flow chart
	// used to detect cycles
	this.failure_stack;
}

Brain.prototype = {
	MAX_TIME: 5,
	
	// goes through flow chart once every MAX_TIME seconds
	update: function(elapsedTime) {
		this.time += elapsedTime/1000;
		if (this.time >= this.MAX_TIME) {
			this.time -= this.MAX_TIME;
			this.failure_stack = new Array();
			process(this.body.buildSoldiers());
		}
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
		switch (problem) {
			case "success":
				return;
			case "need_minerals":
				nextStep = this.body.gatherMinerals();
				break;
			case "barracks_maxed":
				nextStep = this.body.buildBarracks();
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
				break;
		}
		process(nextStep);
	}
}
















