// SoundtrackResources.js
// James Tyson, Michael Speirs
//----------------------------------
SoundtrackResources = function() {
	this.loading = 7;
	
	this.img = {		

	};
	this.sfx = {
		// Tracks
		tracks: [new Audio(),new Audio(),new Audio(),new Audio(),new Audio(),new Audio(),new Audio()]
	};
}

SoundtrackResources.prototype = {
	load: function() {
		onload = function() { this.loading -= 1; console.log("soundtrack load");}
		
		// Tracks
		this.sfx.tracks[0].onload = onload;
		this.sfx.tracks[0].src = "sfx/soundtrack/Algorythm_-_Manithil.mp3";

		this.sfx.tracks[1].onload = onload;
		this.sfx.tracks[1].src = "sfx/soundtrack/dMartin_-_Martin_Oakson-_Summer_Soon__Original_Mix_.mp3";
		
		this.sfx.tracks[2].onload = onload;
		this.sfx.tracks[2].src = "sfx/soundtrack/Nea_-_Sad_Candy.mp3";
		
		this.sfx.tracks[3].onload = onload;
		this.sfx.tracks[3].src = "sfx/soundtrack/Outsider_-_Now.mp3";
		
		this.sfx.tracks[4].onload = onload;
		this.sfx.tracks[4].src = "sfx/soundtrack/Philippe_Mangold_-_L_ether_d_Afrique.mp3";
		
		this.sfx.tracks[5].onload = onload;
		this.sfx.tracks[5].src = "sfx/soundtrack/Sta_a_Sente_-_Sempre_davanti_a_l_ochji.mp3";
		
		this.sfx.tracks[6].onload = onload;
		this.sfx.tracks[6].src = "sfx/soundtrack/WayneRobson_-_Camels_Breath.mp3";
	
		// this.sfx.audio.onload = this.onload;
		// this.sfx.audio.src = "gjr.wav";
	},
	
	onload: function() {
		this.loading--;
	},
	
	shuffle: function() { // Fisher-Yates Algorithm
		var array = this.sfx.tracks;
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}