// the body interacts with all of the game data to
// answer questions posed by the brain
var Body = function(faction) {
	this.faction = faction;
	this.armies = new Array();
}

Body.prototype = {
	buildSoldiers: function() {
		// 50 should be replaced with variable
		if (!this.faction.playerResources.minerals.canSubtract(50)) {
			return "need_minerals";
		}
		// TODO: add check for supply
		var foundBarracks = false;
		for (var i = 0; i < this.faction.buildings; i++) {
			if (this.faction.buildings[i].type == "Barracks" &&
				this.faction.buildings[i].isBuilding == false) {
				// TODO: make a variety of units
				// TODO: add units to army
				this.faction.buildings[i].buildHoplite();
				foundBarracks = true;
				break;
			}
		}
		if (!foundBarracks) {
			return "barracks_maxed";
		}
		return "success";
	},
	
	buildVillagers: function() {
	
	},
	
	gatherMinerals: function() {
		for (var i = 0; i < this.faction.units.length; i++) {
			if (this.faction.units[i].type == "Villager" &&
				this.faction.units[i].mode == "idle") {
				// we found an idle villager. now we need to find minerals
				var least_distance = 0;
				var target_minerals = null;
				for (var j = 0; j < game.mapMinerals.length; j++) {
					var distSqrd = 
						Math.pow(this.faction.units[i].x - game.mapMinerals[j].x, 2) +
						Math.pow(this.faction.units[i].y - game.mapMinerals[j].y, 2);
					if (least_distance == 0 || least_distance > distSqrd) {
						least_distance = distSqrd;
						target_minerals = game.mapMinerals[j];
					}
				}
				// TODO: have the villager collect the target_minerals
				break;
			}
		}
	},
	
	buildBarracks: function() {
		for (var i = 0; i < this.faction.units.length; i++) {
			if (this.faction.units[i].type == "Villager" &&
				(this.faction.units[i].mode == "idle" ||
				this.faction.units[i].mode == "mine" ||
				this.faction.units[i].mode == "returningResource" ||
				this.faction.units[i].mode == "goingToMine")) {
				// we need to find a good building spot
				
			}
		}
	},
	
	buildTowncenter: function() {
		
	}
	
}





















