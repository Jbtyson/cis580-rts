// an army is a tool used by the ai to organize troops
// an army will wait and gather more troops until either:
// 1. there is an attack on a building or villager
// 2. the number of soldiers reaches MAX_STRENGTH
// in case 1, the army runs to defend.
// after the defense is over, the army disbands
// and the units join another army
// in case 2, the army attacks until it is dead

var Army = function() {
	// the mode can be any of:
	// {action: "defend", targetx: int, targety: int}
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
		if (this.mode.action == "attack") {
			// temporarily select all army units
			for (var i = 0; i < this.units.length; i++) {
				this.units[i].selected = true;
			}
			// hard coded faction; probably bad
			game.unitOrder(this.mode.targetbuilding.x, this.mode.targetbuilding.y, game.factions[1]);
			for (var i = 0; i < this.units.length; i++) {
				this.units[i].selected = false;
			}
		}
		
		else if (this.mode.action == "wait") {
			
		}
	},
	
	addUnit: function(unit) {
		this.units.push(unit);
		if (this.units.length >= this.MAX_STRENGTH) {
			this.updateCentroid();
			var targetBuilding = this.findTarget();
			this.mode = {
				action: "attack",
				targetbuilding: targetBuilding
			}
		}
	},
	
	// army is called forth to protect the realm
	defend: function(x, y) {
		this.mode = {
			action: "defend",
			targetx: x,
			targety: y
		};
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


























