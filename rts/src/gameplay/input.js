// max erdwien
var Input = function(screen, window, game) {
	this.game = game;

	var rect = screen.getBoundingClientRect();
	this.xoffset = rect.left;
	this.yoffset = rect.top;
	this.mousex = 0;
	this.mousey = 0;
	
	this.mode = 0;
	
	var self = this;
	window.onkeydown = function (e) { self.keyDown(e); };
	window.onkeyup = function (e) { self.keyUp(e); };
	screen.onmousemove = function(e) { self.mousemove(e); };
	screen.onmousedown = function(e) { self.mousedown(e); };
	screen.onmouseup = function(e) { self.mouseup(e); };
	screen.ondblclick = function(e) { self.dblclick(e); };
	
	// disable context menu
	screen.oncontextmenu = function(e) { return false; };
	
	// note: inputstate represents some, but not all,
	// of the communication between this and game
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	this.mousescroll = false;
}

Input.prototype = {
	keyDown: function(e) {
		var self = this;

		switch(e.keyCode) {
			case 65: // a
			case 37: // left
				this.inputState.left = true;
				this.inputState.right = false;
				break;
			case 87: // w
			case 38: // up
				this.inputState.up = true;
				this.inputState.down = false;
				break;
			case 68: // d
			case 39: // right
				this.inputState.right = true;
				this.inputState.left = false;
				break;
			case 83: // s
			case 40: // down
				this.inputState.down = true;
				this.inputState.up = false;
				break;
				
			case 76: // l button; debug purposes only
				console.log(this.inputState.mousex, this.inputState.mousey);
				break;
			case 84: // t - force AI to step through tree
				game.brain.traverse();
				break;
			case 77: // m button; mute
				var onoff = false;
				if( self.game.playlist[self.game.currentTrack].muted == false ) {
					onoff = true;
				}
				self.game.playlist.forEach( function(track) {
					track.muted = onoff;
				});
				break;
			case 80: // p; pause
			case 32: // spacebar
				self.game.paused = !self.game.paused;
				break;
			case 66: // b; cycle through buildings
				if( self.game.playerFaction.buildings.length > 0 ) {
					if(self.game.buildingIndex < self.game.playerFaction.buildings.length ) {
						var selB = self.game.playerFaction.buildings[self.game.buildingIndex++];
					}
					else{
						self.game.buildingIndex = 0;
						var selB = self.game.playerFaction.buildings[self.game.buildingIndex++];
					}
					self.game.selectedUnits.forEach( function(unit) {
						unit.selected = false;
					});
					self.game.selectedUnits = []; // clear selected
					self.game.selectedBuildings.forEach( function(building) {
						building.selected = false;
					});
					self.game.selectedBuildings = []; // clear selected
					self.game.selectedBuildings.push(selB); // select unit
					selB.selected = true;
				}
				break;
			case 86: // v; cycle through villagers
				if( self.game.playerFaction.units.length > 0 ) {
					if(self.game.unitIndex < self.game.playerFaction.units.length ) {
						var su = self.game.playerFaction.units[self.game.unitIndex++];
					}
					else{//(self.game.unitIndex > self.game.playerFaction.units.length ) { // loop
						self.game.unitIndex = 0;
						var su = self.game.playerFaction.units[self.game.unitIndex++];
					}
					self.game.selectedBuildings.forEach( function(building) {
						building.selected = false;
					});
					self.game.selectedBuildings = []; // clear selected
					self.game.selectedUnits.forEach( function(unit) {
						unit.selected = false;
					});
					self.game.selectedUnits = []; // clear selected
					self.game.selectedUnits.push(su); // select unit
					su.selected = true;
				}
				break;
			case 72: // h; home/town center
				var tc = self.game.playerFaction.buildings[0];
				globalx = tc.world_x - 0.5*WIDTH;
				// clamp globalx
				if( globalx < 0 ) { globalx = 0; }
				else if( globalx > GLOBAL_WIDTH - WIDTH ) { globalx = GLOBAL_WIDTH - WIDTH; }
				globaly = tc.world_y - 0.5*HEIGHT;
				// clamp globaly
				if( globaly < 0 ) { globaly = 0; }
				else if( globaly > GLOBAL_HEIGHT - HEIGHT ) { globaly = GLOBAL_HEIGHT - HEIGHT; }
				break;
			case 46: // delete
				if( self.game.selectedUnits.length > 0 ) {
					self.game.selectedUnits[0].health = 0;
				} else if ( self.game.selectedBuildings.length > 0 ) {
					self.game.selectedBuildings[0].health = 0;
				}
				break;
			case 13: // enter; start new game
				if( !game.started ) {
					game.started = true;
				}
				if(game.gameOver) {
					// reset game
					game.gameOver = false;
					game.activePlayers = game.numPlayers;
					self.game.credits.reset();
				}
				break;
		}
	},
	
	keyUp: function(e) {
		switch(e.keyCode) {
			case 65: // a
			case 37: // left
				this.inputState.left = false;
				break;
			case 87: // w
			case 38: // up
				this.inputState.up = false;
				break;
			case 68: // d
			case 39: // right
				this.inputState.right = false;
				break;
			case 83: // s
			case 40: // down
				this.inputState.down = false;
				break;
		}
	},
	
	mousemove: function(e) {
		var self = this;

		this.mousex = e.clientX - this.xoffset;
		this.mousey = e.clientY - this.yoffset;
		
		// update selection box
		if (self.game.sb != null) {
			self.game.sb.x = this.mousex+globalx;
			self.game.sb.y = this.mousey+globaly;
		}
		
		// check for scrolling
		var scrollingenabled = false;
		if (scrollingenabled) {
			var boundaryThickness = 30;
			var scrollingnow = false;
			if (this.mousex < boundaryThickness) {
				this.inputState.right = false;
				this.inputState.left = true;
				scrollingnow = true;
			} else if (this.mousex > WIDTH-boundaryThickness) {
				this.inputState.right = true;
				this.inputState.left = false;
				scrollingnow = true;
			}
			if (this.mousey < boundaryThickness) {
				this.inputState.down = false;
				this.inputState.up = true;
				scrollingnow = true;
			} else if (this.mousey > HEIGHT-boundaryThickness) {
				this.inputState.down = true;
				this.inputState.up = false;
				scrollingnow = true;
			}
			
			// we have stopped scrolling with the mouse
			if (!scrollingnow && this.mousescroll) {
				this.inputState.up = false;
				this.inputState.down = false;
				this.inputState.right = false;
				this.inputState.left = false;
			}
			this.mousescroll = scrollingnow;
		}
		
		// notify the gui that the mouse moved for tooltip displays
		this.game.gui.onMouseMove(this.mousex+globalx, this.mousey+globaly);
	},
	
	mousedown: function(e) {
		var self = this;

		/* mouse buttons:
		 * 0 = left click
		 * 1 = middle click
		 * 2 = right click
		 */
		if (e.button == 0) {
		  
		  if(self.game.phantom != null){
		    game.input.mode = "placement";
		    //self.game.buildingVillager.move(self.mousex + globalx, self.mousey + globaly);
		    
		  }
		  
		  
			// Perform the clicked action on the first unit in either selected buildings or units
			if (self.game.gui.isClickOnUi(self.mousex, self.mousey)) {
				var actionNum = self.game.gui.getButtonClicked(self.mousex, self.mousey);
				if(actionNum !== -1) {
					self.game.performAction(actionNum);
				}
			}
			else{
			  
			  if(self.mode == "placement"){
			    self.game.buildingVillager.move(self.mousex + globalx, self.mousey + globaly);
			  }
			 
				self.game.startSelectBox(self.mousex+globalx, self.mousey+globaly);
			}
		} else if (e.button == 2) {
			
		} else if (e.button == 1) {
			console.log(e.offsetX, e.offsetY);
		}
	},
	
	mouseup: function(e) {
		var self = this;

		if (e.button == 0) {
			//if(!self.game.gui.isClickOnUi(self.mousex+globalx, self.mousey+globaly))
			if(self.game.gui.isClickOnUi(self.mousex, self.mousey)) {
				// do nothing for now
			}
			else{
				
				if(self.mode == "placement"){
				  self.mode = "normal";
				}
				
				self.game.endSelectBox(e);
				
			}
			if(self.game.phantom != null){
				self.game.tryToBuild = true;
			}
		} else if (e.button == 2) {
			
			//If the user right clicks while trying to build a building, they
			//will stop trying to build a building. Otherwise, move the selected unit.
			if(self.game.phantom != null){
				self.game.phantom = null;
			}
			else{
				self.game.unitOrder(this.mousex+globalx, this.mousey+globaly, game.factions[0]);
			}
		}
	},
	
	// todo: implement double click to select all of one unit type
	dblclick: function(e) {
		if (e.button == 0) {
			//self.game.selectAll();
		}
	}
}
