// max erdwien
var Input = function(screen, window, game) {
	this.game = game;

	var rect = screen.getBoundingClientRect();
	this.xoffset = rect.left;
	this.yoffset = rect.top;
	this.mousex = 0;
	this.mousey = 0;
	
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
			case 77: // m button; mute
				break;
			case 80: // p; pause
			case 32: // spacebar
				self.game.paused = !self.game.paused;
				break;
			case 13: // enter; start new game
				if( !game.started ) {
					game.started = true;
				}
				if(game.gameOver) {
					// reset game
					game.gameOver = false;
					game.activePlayers = game.numPlayers;
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
	},
	
	mousedown: function(e) {
		var self = this;

		/* mouse buttons:
		 * 0 = left click
		 * 1 = middle click
		 * 2 = right click
		 */
		if (e.button == 0) {
			self.game.startSelectBox(this.mousex+globalx, this.mousey+globaly);
		} else if (e.button == 2) {
			
		} else if (e.button == 1) {
			console.log(e.offsetX, e.offsetY);
		}
	},
	
	mouseup: function(e) {
		var self = this;

		if (e.button == 0) {
			self.game.endSelectBox(e);
		} else if (e.button == 2) {
			self.game.unitOrder(this.mousex+globalx, this.mousey+globaly);
		}
	},
	
	// todo: implement double click to select all of one unit type
	dblclick: function(e) {
		if (e.button == 0) {
			//self.game.selectAll();
		}
	}
}










