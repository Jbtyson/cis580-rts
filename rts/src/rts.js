// Max Erdwien
// Screen Size
var WIDTH = 640;
var HEIGHT = 640;

var GLOBAL_WIDTH = 1280;
var GLOBAL_HEIGHT = 1280;

// Required to make a dynamic minimap - Alex L.
var MINIMAP_TILES = [];

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

var globalx = 0;
var globaly = 0;

// Resources
var Resource = new ResourceManager();
Resource.load();

// Game class
//----------------------------------
var Game = function (canvasId) {
	var myself = this;

	// Rendering variables
	this.screen = document.getElementById(canvasId);
	this.screenContext = this.screen.getContext('2d');
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.screen.width;
	this.backBuffer.height = this.screen.height;
	this.backBufferContext = this.backBuffer.getContext('2d');
	
	this.input = new Input(this.screen, window, myself);

	// Variables need to build buildings.
	this.phantom = null;
	this.tryToBuild = false;
	this.buildingVillager;
	
	// Necessary for gui making - James
	this.selectedUnits = [];
	this.selectedBuildings = [];
	this.gui = new Gui(this);
	
	this.factions = [];
	this.numPlayers = 2;
	this.factionColors = ["#FF0000","#0000FF"];
	this.activePlayers = this.numPlayers;
	this.inactivePlayers = [];
	
	// for shortcut key selecting
	this.unitIndex = 0;
	this.buildingIndex = 0;
	
	this.credits = new Credits();

	this.playlist = [];
	this.currentTrack = 0;

	this.mapMinerals = [];
	
	Tilemap.load(tilemapData, {
		onload: function(c) {
			// Tilemap.render(c); // Is this necessary?
		},
		ctx: this.screenContext
	});

	this.placeLevelObjects();
	
	this.cd = new CollisionDetector();
	
	this.sb = null;
	
	// Timing variables
	this.elapsedTime = 0.0;
	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.STARTING_FPS = 60;
	
	this.started = false;
	this.gameOver = false;
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		
		// scootch the map around
		// check for boundary hits
		if (globaly >= GLOBAL_HEIGHT-HEIGHT) {
			this.input.inputState.down = false;
		}
		if (globaly <= 0) {
			this.input.inputState.up = false;
		}
		if (globalx >= GLOBAL_WIDTH-WIDTH) {
			this.input.inputState.right = false;
		}
		if (globalx <= 0) {
			this.input.inputState.left = false;
		}
		
		var mapvel = 200;
		var globalxchange = 0;
		var globalychange = 0;
		if (this.input.inputState.down) {
			globalychange = mapvel * (elapsedTime/1000);
		}
		if (this.input.inputState.up) {
			globalychange = -mapvel * (elapsedTime/1000);
		}
		if (this.input.inputState.right) {
			globalxchange = mapvel * (elapsedTime/1000);
		}
		if (this.input.inputState.left) {
			globalxchange = -mapvel * (elapsedTime/1000);
		}
		globalx += globalxchange;
		globaly += globalychange;
		
		// we have to update the selection box when globals change
		if (this.sb != null) {
			this.sb.y = this.sb.y + globalychange;
			this.sb.x = this.sb.x + globalxchange;
		}
		
		// update Mineral Mines
		self.mapMinerals.forEach( function(mineralMine) {
			mineralMine.update(elapsedTime);
		});
		
		// update units
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (faction.units[i].health <= 0) {
					// remove supply from faction supply
					faction.playerResources.supply.subtract( faction.units[i].supply );
					
					// removes unit from array and ensures no units are skipped
					faction.units.splice(i, 1);
					i--;
					continue;
				}
				faction.units[i].update(elapsedTime);
			}
			
			for (var i = 0; i < faction.buildings.length; i++) {
				if (faction.buildings[i].health <= 0) {
					// removes unit from array and ensures no units are skipped
					faction.buildings.splice(i, 1);
					i--;
					continue;
				}
				faction.buildings[i].update(elapsedTime);
			}
		});

		//If there is a phantom building, update it.
		if(this.phantom != null) this.phantom.update(elapsedTime);
		
		// update AI
		self.brain.update(elapsedTime);
		
		// Update the GUI
		self.gui.update(elapsedTime);
	},
	
	placeLevelObjects: function() {
		var self = this;
		
		for(var i = 0; i < self.numPlayers; i++) { // create players and assign colors
			self.factions.push(new Faction(self.factionColors[i]));
		}
		// create towncenter for each team
		self.factions[0].buildings.push(new Towncenter(64*3, 64*3, 0, 0, self));
		self.factions[0].buildings.push(new Connector(64*5, 32*7, 0, 0, self));
		self.factions[0].buildings.push(new Barracks(32*7, 32*10, 1, 0, self));
		self.factions[1].buildings.push(new Towncenter(64*15, 64*15, 0, 1, self));
		
		// start with villager and add required supply
		self.factions[0].units.push(new Infantry(64*3+32, 64*6+32, 0, self));
		self.factions[0].playerResources.supply.add( self.factions[0].units[0].supply );
		self.factions[1].units.push(new Infantry(64*15+32, 64*17+32, 1, self));
		self.factions[1].playerResources.supply.add( self.factions[1].units[0].supply );
		
		self.playerFaction = self.factions[0]; // self
		this.brain = new Brain(self.factions[1]);
		
		// start centered on town center
		/*
		var tc = self.playerFaction.buildings[0];
		globalx = tc.x + 0.5*tc.width - 0.5*WIDTH;
		globaly = tc.y + 0.5*tc.height - 0.5*HEIGHT;
		*/
		// temporary; I just want to keep an eye on the AI
		//globalx = 64*10;
		//globaly = 64*10;
		
		// start with villager and add required supply
		self.factions[0].units.push(new Villager(64*2,64*3,0,self));
		self.factions[0].playerResources.supply.add( self.factions[0].units[0].supply );
		self.factions[1].units.push(new Villager(64*18,64*17,1,self));
		self.factions[1].playerResources.supply.add( self.factions[1].units[0].supply );
		
		// Add Map mineral Mines
		self.mapMinerals.push(new MineralMine(64*2,64*7,50000));
		self.mapMinerals.push(new MineralMine(64*5,64*7,100));
		self.mapMinerals.push(new MineralMine(64*18,64*16,50000));
	},
	
	startSelectBox: function(x, y) {
		this.sb = new SelectBox(x, y);
	},
	
	endSelectBox: function(e) {
		var self = this;
		
		if (!e.ctrlKey && !e.shiftKey) {
			self.selectedUnits = [];
			self.selectedBuildings = [];
		}
		
		for (var i = 0; i < this.playerFaction.units.length; i++) {
			if (!e.ctrlKey && !e.shiftKey) {
				this.playerFaction.units[i].selected = false;
			}
			// only use the regular unit hitbox; not the attack range
			var unit = {
				getHitbox: function() {
					return game.playerFaction.units[i].getHitbox();
				}
			}
			if (self.cd.detect(self.sb, unit)) {
				this.playerFaction.units[i].selected = true;
				console.log(this.playerFaction.units[i]);
				self.selectedUnits.push(this.playerFaction.units[i]);
			}
		}
		// Don't add buildings if units were selected
		if(this.selectedUnits.length === 0) {
			this.playerFaction.buildings.forEach( function(building) {
				if (!e.ctrlKey && !e.shiftKey) {
					building.selected = false;
				}
				if(self.cd.detect(self.sb, building)) {
					building.selected = true;
					self.selectedBuildings.push(building);
				}
			});
		}
		self.sb = null;
	},
	
	// faction here is the actual faction, not the index
	unitOrder: function(x, y, faction) {
		var self = this;
		var thisFaction = faction;
		
		var mousebox = {
			getHitbox: function() {
				return {
					type:"circle",
					x:x,
					y:y,
					radius:0
				};
			},
			getAttackRange: function() {
				return {
					type:"circle",
					x:x,
					y:y,
					radius:0
				};
			}
		};
		
		self.moveUnit(x, y, faction);

		// check if the click was on an enemy unit
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (faction != thisFaction &&
						self.cd.detect(faction.units[i], mousebox)) {
					for (var j = 0; j < thisFaction.units.length; j++) {
						if (thisFaction.units[j].selected) {
							thisFaction.units[j].attack(faction.units[i]);
						}
					}
					return;
				}
			}
		});
		
		// check if the click was on an enemy building
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.buildings.length; i++) {
				if (faction != thisFaction &&
						self.cd.detect(faction.buildings[i], mousebox)) {
					for (var j = 0; j < thisFaction.units.length; j++) {
						if (thisFaction.units[j].selected) {
							thisFaction.units[j].attackBuilding(faction.buildings[i]);
						}
					}
					return;
				}
			}
		});

		// check if the click was on a mineral patch
		self.mapMinerals.forEach (function(mineral, index) {
			if (self.cd.detect(mineral, mousebox)) {
				for (var i = 0; i < game.factions.length; i++) {
					for (var j = 0; j < game.factions[i].units.length; j++) {
						if (game.factions[i].units[j].selected &&
							game.factions[i].units[j].type == "villager") {
							game.factions[i].units[j].startMine(mineral);
						}
					}
				}
				return;
			}
		});
	},
	
	moveUnit: function(x, y, faction) {
		var self = this;
		
		// more efficient to have a seperate array of selected units
		// instead of searching the whole thing; fix later, if necessary
		for (var i = 0; i < faction.units.length; i++) {
			if (faction.units[i].selected) {
				faction.units[i].move(x, y);
			}
		}
	},
	
	// Selects a unit from the array of selected units
	// James Tyson
	selectUnit: function(id) {
		if(this.selectedUnits.length > 0) {
			// Store the selected unit
			var unit = this.selectedUnits[id];
			// Deselect and remove all units
			this.selectedUnits.forEach(function(unit) {
				unit.selected = false;
			});
			this.selectedUnits = [];
			// Reselect and add selected unit
			unit.selected = true;
			this.selectedUnits.push(unit);
		}
		else if(this.selectedBuildings.length > 0) {
			// Store the selected building
			var building = this.selectedBuildings[id];
			// Deselect all remove all buildings
			this.selectedBuildings.forEach(function(building) {
				building.selected = false;
			});
			this.selectedBuildings = [];
			// Reselect and add selectd building
			building.selected = true;
			this.selectedBuildings.push(building);
		}
	},
	
	// Performs an action after based on the click input from the ui
	performAction: function(actionNum) {
		// make all units of the original type perform the action
		if(this.selectedUnits.length > 0) {
			var type = typeof(this.selectedUnits[0]);
			this.selectedUnits.forEach(function(unit) {
				if(type === typeof(unit))
					if(typeof(unit.actions[actionNum]) !== "undefined")
						unit.actions[actionNum].onClick(unit);
			});
		}
		// make the building with the lowest unitQueue perform the action
		else if(this.selectedBuildings.length > 0) {
			var type = this.selectedBuildings[0].type;
			var lowestIndex = 0;
			var lowest = this.selectedBuildings[0].unitQueue.length;
			this.selectedBuildings.forEach(function(building, index) {
				if(type === building.type && building.unitQueue.length < lowest) {
					lowestIndex = index;
					lowest = building.unitQueue.length;
				}
			});
			this.selectedBuildings[lowestIndex].actions[actionNum].onClick(this.selectedBuildings[lowestIndex]);
		}
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		//self.backBufferContext.translate(-70, 0);
		Tilemap.render(self.backBufferContext);
		
		// render mapMinerals
		self.mapMinerals.forEach( function(mineralMine) {
			mineralMine.render(self.backBufferContext);
		});

		// render units
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) { // render units
				faction.units[i].render(self.backBufferContext);
			}
			faction.buildings.forEach( function(building) { // render buildings
				building.render(self.backBufferContext);
			});
		});
		
		// render selection box
		if (self.sb != null) {
			self.sb.render(self.backBufferContext);
		}

		//If there is a phantom building, render it.
		if(this.phantom != null) this.phantom.render(self.backBufferContext);
		
		// Render the GUI
		self.gui.render(self.backBufferContext);
		
		// Flip buffers
		self.screenContext.drawImage(self.backBuffer, 0, 0);
	},
	
	start: function() {
		var self = this;
		
		this.startTime = Date.now();
		
		// Create soundtrack playlist
		self.playlist = Resource.soundtrack.shuffle();
		
		// ***StartScreen - Michael Speirs
		self.screenContext.drawImage(Resource.gui.img.splash,0,0);
		
		var splashloop = setInterval( function() { // wait till user starts game
			if( self.started ) {
				clearInterval(splashloop);
				window.requestNextAnimationFrame(
					function(time) {
						self.playlist[self.currentTrack].play();
						self.loop.call(self, time);
					}
				);
			}
		},200);

	},
	
	// The game loop.  See
	// http://gameprogrammingpatterns.com/game-loop.html
	loop: function(time) {
		var self = this;
		
		// Don't advance the clock if the game is paused
		if (this.gameOver || this.paused) {
			this.lastTime = time;
		}
		
		// Calculate additional elapsed time, keeping any
		// unused time from previous frame
		this.elapsedTime += time - this.lastTime;
		this.lastTime = time;
		
		// The first timestep (and occasionally later ones) are too large
		// causing our processing to take too long (and run into the next
		// frame).  We can clamp to a max of 4 frames to keep that from
		// happening
		this.elapsedTime = Math.min(this.elapsedTime, 4 * TIME_STEP);
		
		if(!self.gameOver && !self.paused) {
			// We want a fixed game loop of 1/60th a second, so if necessary run multiple
			// updates during each rendering pass
			// Invariant: We have unprocessed time in excess of TIME_STEP
			while (this.elapsedTime >= TIME_STEP) {
				self.update(TIME_STEP);
				this.elapsedTime -= TIME_STEP;
				
				// add the TIME_STEP to gameTime
				this.gameTime += TIME_STEP;
			}
		
			// Manage soundtrack
			if( self.playlist[self.currentTrack].ended ) {
				self.currentTrack++;
				if(self.currentTrack >= self.playlist.length) {
					self.currentTrack = 0;
				}
				self.playlist[self.currentTrack].play();
			}
			
			// We only want to render once
			self.render(this.elapsedTime);
		
			// Check which players are still active
			self.factions.forEach( function(faction,index,array) {
				if( faction.units.length == 0 && faction.buildings.length == 0 ) { //&& faction.armies.length == 0) {
					self.activePlayers--;
					self.inactivePlayers.push(array.splice(index--,1));
				}
			});
		
			// Check victory conditions
			if( self.activePlayers == 1 ) {
				self.gameOver = true;
				self.started = false;
				self.factions = [];
				self.inactivePlayers = [];
				self.placeLevelObjects();
				self.credits.active = true;
				globalx = 0;
				globaly = 0;
			}
		
		} else if(this.gameOver || !this.started) { // render credits
			if( self.credits.active ) {
				self.credits.update();
				self.credits.render(self.screenContext);
			} else {
				self.screenContext.drawImage(Resource.gui.img.splash,0,0);
			}
		}
		
		if (this.paused) {
			 // In PAUSE_TIMEOUT (100) ms, call this method again to see if the game
			 // is still paused. There's no need to check more frequently.
			 setTimeout( function () {
					window.requestNextAnimationFrame(
						 function (time) {
								self.screenContext.fillStyle = "#000000";
								self.screenContext.fillRect(0,0,WIDTH,HEIGHT);
								self.screenContext.font = "30px Arial";
								self.screenContext.fillStyle = "#FFFFFF";
								self.screenContext.fillText("Paused",0.5*WIDTH-30,0.5*HEIGHT);
								self.screenContext.fillText("Press [space] to resume",0.5*WIDTH-140,0.5*HEIGHT+50);
								self.loop.call(self, time);
						 });
			 }, 200);
             
		} else {
			// Repeat the game loop
			window.requestNextAnimationFrame( function(time) {
					self.loop.call(self, time);
			});
		}
	}
}
var game = new Game('game');

// Waits till images are loaded before starting game
imgLoaded = setInterval( function() {
	if( Resource.gui.loading > 0) {
		clearInterval(imgLoaded);
		console.log("PASS");
		game.start();
	} else {
		console.log("NOPASS");
	}
}, 250);
