// an army is a tool used by the ai to organize troops
// an army will wait and gather more troops until either:
// 1. there is an attack on a building or villager
// 2. the number of soldiers reaches MAX_STRENGTH
// in case 1, the army runs to defend.
// after the defense is over, the army returns to the waiting state
// in case 2, the army attacks until it is dead

var Army = function() {
	// the mode can be any of:
	// {action: "attack", targetbuilding: building}
	// {action: "wait"}
	this.mode = {
		action: "wait"
	};
	this.units = new Array();
	this.centroidx = null;
	this.centroidy = null;
}

Army.prototype = {
	MAX_STRENGTH: 3,
	
	update: function(elapsedTime) {
		// remove casualties
		/*
		for (var i = 0; i < this.units.length; i++) {
			if (this.units[i].health <= 0) {
				this.units.splice(i, 1);
				i--;
				continue;
			}
		}
		*/
		
		// decide new orders
		if (this.mode.action == "attack") {
			// check if the building is dead
			if (this.mode.targetbuilding.health <= 0) {
				console.log("target eliminated");
				this.decideAction();
			}
		}
		if (this.mode.action == "attack") {
			
			// temporarily select all army units
			for (var i = 0; i < this.units.length; i++) {
				this.units[i].selected = true;
			}
			// hard coded faction; probably bad
			game.unitOrder(this.mode.targetbuilding.x + 10, this.mode.targetbuilding.y + 10, game.factions[1]);
			for (var i = 0; i < this.units.length; i++) {
				this.units[i].selected = false;
			}
		}
		
		else if (this.mode.action == "wait") {
			// check if we need to defend our buildings
			for (var i = 0; i < game.factions[0].units.length; i++) {
				if (game.factions[0].units[i].mode == "attack_building") {
					this.mode = {
						action: "attack",
						targetbuilding:game.factions[0].units[i]
					};
				}
			}
		}
	},
	
	decideAction: function() {
		if (this.units.length >= this.MAX_STRENGTH) {
			this.updateCentroid();
			var targetBuilding = this.findTarget();
			this.mode = {
				action: "attack",
				targetbuilding: targetBuilding
			}
			console.log("new target:", targetBuilding);
		} else {
			this.mode = {
				action: "wait"
			}
		}
	},
	
	addUnit: function(unit) {
		this.units.push(unit);
		this.decideAction();
	},
	
	// finds the closest enemy building
	findTarget: function() {
		var least_distance = 0;
		var target_building = null;
		for (var i = 0; i < game.factions[0].buildings.length; i++) {
			var distSqrd = 
				Math.pow(this.centroidx - game.factions[0].buildings[i].x, 2) +
				Math.pow(this.centroidy - game.factions[0].buildings[i].y, 2);
			if (least_distance == 0 || least_distance > distSqrd) {
				least_distance = distSqrd;
				target_building = game.factions[0].buildings[i];
			}
		}
		return target_building;
	},
	
	// updates the company centroid
	updateCentroid: function() {
		var totalx = 0;
		var totaly = 0;
		for (var i = 0; i < this.units.length; i++) {
			totalx += this.units[i].x;
			totaly += this.units[i].y;
		}
		this.centroidx = totalx/this.units.length;
		this.centroidy = totaly/this.units.length;
	}
}


























