// Tilemap engine defined using the Module pattern
// See http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
// nathan bean
// Edited by: Alex L'Esperance
var Tilemap = (function (){
	var tiles = [],
		tilesets = [],
		layers = [],
		tileWidth = 0,
		tileHeight = 0,
		mapWidth = 0,
		mapHeight = 0,
		screen,
		screenCtx;
      
	var load = function(mapData, options) {
      
		var loading = 0;

		// Release old tiles & tilesets
		tiles = [];
		tilesets = [];

		// Resize the map
		tileWidth = mapData.tilewidth;
		tileHeight = mapData.tileheight;
		mapWidth = mapData.width;
		mapHeight = mapData.height;

		// Load the tileset(s)
		mapData.tilesets.forEach( function(tilesetmapData, index) {
			// Load the tileset image
			var tileset = new Image();
			loading++;
			tileset.onload = function() {
				loading--;
				if (loading == 0 && options.onload) {
					options.onload(options.ctx);
				}
			}
			tileset.src = tilesetmapData.image;
			tilesets.push(tileset);

			// Create the tileset's tiles
			var colCount = Math.floor(tilesetmapData.imagewidth / tileWidth);
			var	rowCount = Math.floor(tilesetmapData.imageheight / tileHeight);
			var	tileCount = colCount * rowCount;

			for (var i = 0; i < tileCount; i++) {
				var tile = {
					// Reference to the image, shared amongst all tiles in the tileset
					image: tileset,
					// Source x position.  i % colCount == col number (as we remove full rows)
					sx: (i % colCount) * tileWidth,
					// Source y position. i / colWidth (integer division) == row number 
					sy: Math.floor(i / rowCount) * tileHeight,
					// Indicates a solid tile (i.e. solid property is true).  As properties
					// can be left blank, we need to make sure the property exists. 
					// We'll assume any tiles missing the solid property are *not* solid
					solid: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].solid == "true") ? true : false
				}
				tiles.push(tile);
			}
		});
    
		// Parse the layers in the map
		mapData.layers.forEach( function(layerData) {
			// Tile layers need to be stored in the engine for later
			// rendering
			if (layerData.type == "tilelayer") {
				// Create a layer object to represent this tile layer
				var layer = {
					name: layerData.name,
					width: layerData.width,
					height: layerData.height,
					visible: layerData.visible
				}

				// Set up the layer's data array.  We'll try to optimize
				// by keeping the index data type as small as possible
				if (tiles.length < Math.pow(2,8)) {
					layer.data = new Uint8Array(layerData.data);
				} else if (tiles.length < Math.Pow(2, 16)) {
					layer.data = new Uint16Array(layerData.data);
				} else {
					layer.data = new Uint32Array(layerData.data);
				}
				// save the tile layer
				layers.push(layer);
			}
		});
	}

	var render = function(screenCtx) {
		// Render tilemap layers - note this assumes
		// layers are sorted back-to-front so foreground
		// layers obscure background ones.
		// see http://en.wikipedia.org/wiki/Painter%27s_algorithm
		layers.forEach(function(layer) {
			// Only draw layers that are currently visible
			if (layer.visible) {
				for (var x = 0; x < layer.width; x++) {
				for (var y = 0; y < layer.height; y++) {
					var tileId = layer.data[x + layer.width * y];

					// tiles with an id of 0 don't exist
					if (tileId != 0) {
						var tile = tiles[tileId - 1];
						if (tile.image) { // Make sure the image has loaded
						
							screenCtx.drawImage(
								tile.image,     // The image to draw 
								tile.sx, tile.sy, tileWidth, tileHeight, // The portion of image to draw
								x*tileWidth-globalx, y*tileHeight-globaly, tileWidth, tileHeight // Where to draw the image on-screen
							);
							//allows for dynamic maps to display the correct minimap
							if(MINIMAP_TILES.length < 400)
							{
							var minimap_tile = {image: tile.image,
												sx: tile.sx, sy: 
												tile.sy, 
												swidth: tileWidth / 10, 
												sheight: tileHeight / 10,
												x: x*(tileWidth/10),
												y: 512 + y*(tileHeight/10), 
												width: tileWidth/10, 
												height: tileHeight/10};
							MINIMAP_TILES.push(minimap_tile);
							}
							
						}
					}

				}
				}
				
			}
		});
	}
  
	var tileAt = function(x, y, layer) {
		// sanity check
		if (layer < 0 || x < 0 || y < 0 || layer >= layers.length || x > mapWidth || y > mapHeight) {
			return undefined;
		}
		return tiles[layers[layer].data[x + y*mapWidth] - 1];
	}
  
	// Expose the module's public API
	return {
		load: load,
		render: render,
		tileAt: tileAt
	}
})();