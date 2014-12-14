// Rectangle.js
// James Tyson
//-----------------------
Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Rectangle.prototype = {
	contains: function(x, y) {
		if(this.x  <= x && this.x + this.width >= x)
			if(this.y  <= y && this.y + this.height >= y)
				return true;
		return false;
	},
};