// max erdwien
var CollisionDetector = function() {
}

CollisionDetector.prototype = {
	// a and b are of type hitbox, which is either
	// {type: "circle", x, y, radius} or
	// {type: "rect", x, y, w, h}
	detect: function(p, q) {
		var a = p.getHitbox();
		var b = q.getHitbox();
		var collision = false;
		if (a.type == "circle") {
			if (b.type == "circle") {
				var temp = q.getAttackRange();
				if (temp != undefined) {
					b = temp;
				}
				collision = this.twoCircles(a, b);
			} else if (b.type == "rect") {
				collision = this.circleRect(a, b);
			} else {
				console.log("error, invalid type");
			}
		} else if (a.type == "rect") {
			if (b.type == "circle") {
				if (q.getAttackRange != undefined) {
					b = q.getAttackRange();
				}
				collision = this.circleRect(b, a);
			} else if (b.type == "rect") {
				collision = this.twoRects(a, b);
			} else {
				console.log("error, invalid type");
			}
		} else {
			console.log("error, invalid type");
		}
		
		return collision;
	},
	
	twoCircles: function(a, b) {
		var dist_squared = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
		if (Math.pow(a.radius + b.radius, 2) > dist_squared) {
			return true;
		} else {
			return false;
		}
	},
	
	// a is a circle, b is a rect
	circleRect: function(a, b) {
		if ((a.x + a.radius > b.x) && (a.x - a.radius < b.x + b.w)
				&& (a.y > b.y) && (a.y < b.y + b.h)) {
			return true;
		}
		
		if ((a.y + a.radius > b.y) && (a.y - a.radius < b.y + b.h)
				&& (a.x > b.x) && (a.x < b.x + b.w)) {
			return true;
		}
		
		if (this.twoCircles(a, {type:"circle", x:b.x, y:b.y, radius:0})) {
			return true;
		}
		if (this.twoCircles(a, {type:"circle", x:b.x+b.w, y:b.y+b.h, radius:0})) {
			return true;
		}
		if (this.twoCircles(a, {type:"circle", x:b.x, y:b.y+b.h, radius:0})) {
			return true;
		}
		if (this.twoCircles(a, {type:"circle", x:b.x+b.w, y:b.y, radius:0})) {
			return true;
		}
		
		return false;
	},
	
	twoRects: function(a, b) {
		var centerax = a.x + (a.w/2);
		var centeray = a.y + (a.h/2);
		
		var centerbx = b.x + (b.w/2);
		var centerby = b.y + (b.h/2);
		
		if (Math.abs(centerax - centerbx) <= (a.w + b.w)/2
			&& Math.abs(centeray - centerby) <= (a.h + b.h)/2) {
			return true;
		}
		return false;
	},
	
	renderHitbox: function(p, context) {
		var a = p.getHitbox();
		if (a.type == "circle") {
			this.renderCircle(a, context);
		} else if (a.type == "rect") {
			this.renderRect(a, context);
		} else {
			console.log("error, invalid type");
		}
	},
	
	renderCircle: function(a, context) {
		context.save();
		context.strokeStyle = "#FF0000";
		context.beginPath();
		context.arc(a.x-globalx, a.y, a.radius, 0, 2*Math.PI, false);
		context.stroke();
		context.restore();
	},
	
	renderRect: function(a, context) {
		context.save();
		context.strokeStyle = "#FF0000";
		context.beginPath();
		context.rect(a.x-globalx, a.y, a.w, a.h);
		context.stroke();
		context.restore();
	}
	
}