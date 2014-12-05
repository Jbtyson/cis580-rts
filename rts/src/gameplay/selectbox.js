// max erdwien
var SelectBox = function(x, y) {
	this.startx = x;
	this.starty = y;
	this.x = x;
	this.y = y;
}

SelectBox.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.rect(this.startx-globalx, this.starty-globaly, this.x-this.startx, this.y-this.starty);
		ctx.stroke();
		ctx.restore();
	},
	
	getHitbox: function() {
		var box = {
			type:"rect",
			w: Math.abs(this.startx - this.x),
			h: Math.abs(this.starty - this.y)
		}
		
		if (this.startx - this.x < 0) {
			box.x = this.startx;
		} else {
			box.x = this.x;
		}
		
		if (this.starty - this.y < 0) {
			box.y = this.starty;
		} else {
			box.y = this.y;
		}
		return box;
	}
}