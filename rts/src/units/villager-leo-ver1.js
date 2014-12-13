var Villager = function(x, y, faction) {
	this.maxhealth = 60;
	this.__proto__ = new Unit(x, y, this.maxhealth, faction);
	
	this.radius = 16;
	this.borderwidth = 6;
	// in pixels per second
	this.maxvel = 200;
	// in health per second
	this.damage = 6;
	
	this.Villagerbuildingspeed = 1.0;

	this.render = VillagerRender;
	this.update = VillagerUpdate;
	this.getHitbox = VillagerGetHitbox;
	this.move = VillagerMove;


}

VillagerRender = function(ctx) {
	ctx.save();
	ctx.beginPath();
	if (this.selected) {
		ctx.strokeStyle = "#00FF00";
	} else {
		ctx.strokeStyle = "#000000";
	}
	ctx.lineWidth = this.borderwidth;
	ctx.fillStyle = this.faction.color;
	ctx.beginPath();
	ctx.arc(this.x-globalx, this.y-globaly, this.radius-(this.borderwidth/2), 0, 2*Math.PI, false);
	ctx.fill();
	ctx.stroke();
	
	// draw health bar
	var maxbarlength = 16;
	var barheight = 4;
	var barlength = maxbarlength * (this.health/this.maxhealth);
	ctx.fillStyle = "#00FF00";
	ctx.beginPath();
	ctx.rect(this.x-(maxbarlength/2)-globalx, this.y-(barheight/2)-globaly,	barlength, barheight);
	ctx.fill();
	ctx.restore();
}

VillagerUpdate = function(elapsedTime) {
	var secs = elapsedTime / 1000;
	if (this.mode == "move") {
		var deltaxi = this.targetx - this.x;
		var deltayi = this.targety - this.y;
		
		// actually move
		this.x += secs*this.velx;
		this.y += secs*this.vely;
		
		// stop if target has been reached
		if (this.mode == "move") {
			var deltaxf = this.targetx - this.x;
			var deltayf = this.targety - this.y;
			if (deltaxi/deltaxf < 0 || deltaxi/deltaxf < 0) {
				this.velx = 0;
				this.vely = 0;
				this.mode = "idle";
			}
		}
	}
	
	else if (this.mode == "idle") {
		for (var i = 0; i <  game.units.length; i++) {
			if (game.units[i].faction != this.faction &&
					game.cd.detect(this, game.units[i])) {
				// todo: run away
			}
		}
	}
}

VillagerGetHitbox = function() {
	return {
		type: "circle",
		x: this.x,
		y: this.y,
		radius: this.radius
	};
}

VillagerMove = function(x, y) {
	this.mode = "move";
	this.targetx = x;
	this.targety = y;
	
	var deltax = x - this.x;
	var deltay = y - this.y;
	
	this.velx = Math.sqrt((this.maxvel*this.maxvel * deltax*deltax) /
			(deltax*deltax + deltay*deltay));
	this.vely = Math.sqrt((this.maxvel*this.maxvel * deltay*deltay) /
			(deltax*deltax + deltay*deltay));
	if (this.velx/deltax < 0) {
		this.velx *= -1;
	}
	if (this.vely/deltay < 0) {
		this.vely *= -1;
	}
}

Villagerbuild = function(bx,by,BuildingHp,resource,elapsedTime) {
	var secs = elapsedTime / 1000;
	var buildHp = 0;
	//check resource

	//read in xy position, move to xy position
	villagerMove(bx,by);
	
	//buiding start && villegar stay in position
	while(this.mode == "idle" && this.x ==bx && this.y==by && buildHP != this.BuildingHp){
		buildHp = this.Villagerbuildingspeed * secs;
	}
	//outer the while loop building is stoped, out reason check
	
	//villegar have been moved
	if(this.mode != "idle" || this.x !=bx || this.y != by && buildHP < this.BuildingHp){
			//store the buildingHp on the x,y position.
	}
	//Building complete
	else if(buildHp==this.BuildingHp){
		//render Building
	}
	else{
		console.log("Unknow reason for Building stoped");
	}
}