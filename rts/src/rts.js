// Max Erdwien
// Screen Size
//Ryan Woodburn: replaced hoplites with infantry, changed cd.detect method call in UnitOrder
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
	
	this.input = new Input(this.screen, window);
	
	// Necessary for gui making - James
	this.resources = { minerals:0, gas:100, supply:10, supplyMax:200 };
	this.selectedUnits = [];
	this.gui = new Gui(this);
	
	
	Tilemap.load(tilemapData, {
		onload: function(c) {
			Tilemap.render(c);
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
		for (var i = 0; i < this.units.length; i++) {
			if (this.units[i].health <= 0) {
				// removes unit from array and ensures no units are skipped
				this.units.splice(i, 1);
				i--;
				continue;
			}
			this.units[i].update(elapsedTime);
		}
		
		// Update the GUI
		this.gui.update(elapsedTime);
	},
	
	placeLevelObjects: function() {
		this.factions = new Array();
		this.factions.push(new Faction("#FF0000"));
		this.factions.push(new Faction("#0000FF"));
		
		this.playerFaction = this.factions[0];
		
		this.units = new Array();
		
		var spawnlots = true;
		if (spawnlots) {
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 5; j++) {
					this.units.push(new Infantry(i*64+32, j*64+32, this.factions[0]));
					this.units.push(new Infantry(i*64+32+320, j*64+32+320, this.factions[1]));
				}
			}
		} else {
			this.units.push(new Infantry(30, 30, this.factions[0]));
			this.units.push(new Infantry(500, 500, this.factions[0]));
			this.units.push(new Infantry(100, 30, this.factions[1]));
		}
	},
	
	startSelectBox: function(x, y) {
		this.sb = new SelectBox(x, y);
	},
	
	endSelectBox: function(e) {
		// Clear the selected units (James)
		this.selectedUnits = [];
		
		for (var i = 0; i < this.units.length; i++) {
			if (!e.ctrlKey && !e.shiftKey) {
				this.units[i].selected = false;
			}
			if (this.units[i].faction == this.playerFaction &&
					this.cd.detect(this.sb, this.units[i])) {
				this.units[i].selected = true;
				console.log(this.units[i]);
				// Add the selected unit into the array of selected units (James)
				this.selectedUnits.push(this.units[i]);
			}
		}
		this.sb = null;
	},
	
	unitOrder: function(x, y) {
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
		for (var i = 0; i < this.units.length; i++) {
			if (this.units[i].faction != this.playerFaction &&
					this.cd.detect(mousebox, this.units[i])) {
				for (var j = 0; j < this.units.length; j++) {
					if (this.units[j].selected) {
						this.units[j].attack(this.units[i]);
					}
				}
				return;
			}
		}
		this.moveUnit(x, y);
	},
	
	moveUnit: function(x, y) {
		// more efficient to have a seperate array of selected units
		// instead of searching the whole thing; fix later, if necessary
		for (var i = 0; i < this.units.length; i++) {
			if (this.units[i].selected) {
				this.units[i].move(x, y);
			}
		}
	},
	
	render: function(elapsedTime) {
		var self = this;
		//this.backBufferContext.translate(-70, 0);
		Tilemap.render(this.backBufferContext);
		
		// render units
		for (var i = 0; i < this.units.length; i++) {
			this.units[i].render(this.backBufferContext);
		}
		
		// render selection box
		if (this.sb != null) {
			this.sb.render(this.backBufferContext);
		}
		
		// Render the GUI
		this.gui.render(this.backBufferContext);
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
	},
	
	start: function() {
		var self = this;
		
		this.startTime = Date.now();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
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
		
		// We only want to render once
		self.render(this.elapsedTime);
		
		// Repeat the game loop
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}
var game = new Game('game');
game.start();