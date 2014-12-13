// Max Erdwien
// Screen Size
var WIDTH = 640;
var HEIGHT = 640;

var GLOBAL_WIDTH = 1280;
var GLOBAL_HEIGHT = 1280;

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
	
	// Necessary for gui making - James
	this.resources = { minerals:0, gas:100, supply:10, supplyMax:200 };
	this.selectedUnits = [];
	this.gui = new Gui(this);
	
	this.factions = [];
	this.numPlayers = 2;
	this.factionColors = ["#FF0000","#0000FF"];
	this.activePlayers = this.numPlayers;
	
	this.playlist = [];
	this.currentTrack = 0;
	
	Tilemap.load(tilemapData, {
		onload: function(c) {
			// Tilemap.render(c); // Is this necessary?
		},
		ctx: this.screenContext
	});
	
	/*
	this.soundsready = 0;
	this.gup = function() { game.soundsready++; };
	this.sounds = {
		music: new AudioFX("sounds/Mining by Moonlight", { formats: ['mp3'], volume: 1.0, loop:true}, this.gup),
		bullet: new AudioFX("sounds/bullet", { formats: ['mp3'], pool: 20, volume: 0.1}, this.gup),
		missile: new AudioFX("sounds/missile", { formats: ['mp3'], pool: 10, volume: 0.06, loop: true}, this.gup),
		powerup: new AudioFX("sounds/powerup", { formats: ['mp3'], pool: 4, volume: 0.1}, this.gup),
		explosion: new AudioFX("sounds/explosion", {formats: ['mp3'], pool: 10, volume: 0.1}, this.gup)
	};
	*/
	
	/*
	this.ready = 0;
	// the images will tell us when they're loaded
	this.bgs[0].onload = function() {
		game.ready++;
	};
	this.bgs[1].onload = function() {
		game.ready++;
	};
	this.bgs[2].onload = function() {
		game.ready++;
	};
	*/

	// Game variables
	//this.gui = new GUI();
	//this.minimap = new Minimap(20, 440, 760, 24, this.bgs[0], this.bgs[1], this.bgs[2]);
	
	//sprite_sheet = new Image();
	//sprite_sheet.src = "helicopter.png";
	//this.heli = new Helicopter(200, 200, sprite_sheet);

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
	//this.units = [];
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
		
		// update units
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (faction.units[i].health <= 0) {
					// removes unit from array and ensures no units are skipped
					faction.units.splice(i, 1);
					i--;
					continue;
				}
				faction.units[i].update(elapsedTime);
			}
		});
		
		// Update the GUI
		self.gui.update(elapsedTime);
	},
	
	placeLevelObjects: function() {
		var self = this;
		
		for( i = 0; i < self.numPlayers; i++) { // create players and assign colors
			self.factions.push(new Faction(self.factionColors[i]));
		}
		
		self.playerFaction = self.factions[0]; // self
		
		var spawnlots = true;
		if (spawnlots) {
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 5; j++) {
					self.factions[0].units.push(new Hoplite(i*64+32, j*64+32, self.factions[0].color, self));
					self.factions[1].units.push(new Hoplite(i*64+32+320, j*64+32+320, self.factions[1].color, self));
				}
			}
		} else {
			self.factions[0].units.push(new Hoplite(30, 30, self.factions[0].color, self));
			self.factions[0].units.push(new Hoplite(500, 500, self.factions[0].color, self));
			self.factions[1].units.push(new Hoplite(100, 30, self.factions[1].color, self));
		}
	},
	
	startSelectBox: function(x, y) {
		this.sb = new SelectBox(x, y);
	},
	
	endSelectBox: function(e) {
		var self = this;
	
		// Clear the selected units (James)
		self.selectedUnits = [];
		
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (!e.ctrlKey && !e.shiftKey) {
					faction.units[i].selected = false;
				}
				if (faction.units[i].color == self.playerFaction.color &&
						self.cd.detect(self.sb, faction.units[i])) {
					faction.units[i].selected = true;
					console.log(faction.units[i]);
					// Add the selected unit into the array of selected units (James)
					self.selectedUnits.push(faction.units[i]);
				}
			}
		});

		self.sb = null;
	},
	
	unitOrder: function(x, y) {
		var self = this;
		
		var mousebox = {
			getHitbox: function() {
				return {
					type:"circle",
					x:x,
					y:y,
					radius:0
				};
			}
		};

		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (faction.units[i].color != self.playerFaction &&
						self.cd.detect(faction.units[i], mousebox)) {
					for (var j = 0; j < faction.units.length; j++) {
						if (faction.units[j].selected) {
							faction.units[j].attack(faction.units[i]);
						}
					}
					return;
				}
			}
		});

		self.moveUnit(x, y);
	},
	
	moveUnit: function(x, y) {
		var self = this;
		
		// more efficient to have a seperate array of selected units
		// instead of searching the whole thing; fix later, if necessary
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				if (faction.units[i].selected) {
					faction.units[i].move(x, y);
				}
			}
		});
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		//self.backBufferContext.translate(-70, 0);
		Tilemap.render(self.backBufferContext);
		
		// render units
		self.factions.forEach( function(faction) {
			for (var i = 0; i < faction.units.length; i++) {
				faction.units[i].render(self.backBufferContext);
			}
		});
		
		// render selection box
		if (self.sb != null) {
			self.sb.render(self.backBufferContext);
		}
		
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
		if(!self.gameOver) {
			self.render(this.elapsedTime);
		
			// Check which players are still active
			self.factions.forEach( function(faction) {
				if( faction.units.length == 0 && faction.units.length == 0 ) {
					self.activePlayers--;
				}
			});
		
			// ***TODO:Check victory conditions
			if( self.activePlayers == 0 ) {
				self.gameOver = true;
				self.started = false;
				self.screenContext.drawImage(Resource.gui.img.splash,0,0);
				self.factions = [];
				self.placeLevelObjects();
			}
		
		}
		
		if (this.paused || this.gameOver || !this.started) {
			 // In PAUSE_TIMEOUT (100) ms, call this method again to see if the game
			 // is still paused. There's no need to check more frequently.
			 setTimeout( function () {
					window.requestNextAnimationFrame(
						 function (time) {
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
