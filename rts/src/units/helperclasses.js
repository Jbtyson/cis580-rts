  //================================================
  // PointSet Helper Class
  // Author: Nathan Bean
  //------------------------------------------------

  // PointSet constructor
  var PointSet = function(contents){
    this.contents = contents == undefined ? [] : contents;
  }

  // Returns true if the set is empty, false if
  // it contains points
  PointSet.prototype.empty = function() {
    return this.contents.length == 0;
  }

  // Returns true if the set contains the specified point
  PointSet.prototype.contains = function(point) {
    var flag = false;
    this.contents.forEach(function(p) {
      if(p.x == point.x && p.y == point.y) 
        flag = true;
    });
    return flag;
  }

  // Sorts the points using the provided sort function
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  PointSet.prototype.sort = function(sortFunction) {
    this.contents.sort( sortFunction );
  }

  // Adds a point to the end of the set
  PointSet.prototype.push = function(point) {
    // Only store a point once
    if(this.contains(point)) return;
    // Add the point to the contents
    this.contents.push(point);
  }

  // Returns the last element in the set
  // and removes it from the set
  PointSet.prototype.pop = function() {
    return this.contents.pop();
  }

  // Returns the first element in the set 
  // and removes it from the set
  PointSet.prototype.shift = function() {
    return this.contents.shift();
  }
  
  // Author: Nathan Bean
  // Expands a node.  Neighboring nodes are added to 
  // the open set, and nodes that cannot be crossed
  // are added to the closed set.  The expanded node
  // is also added to the closed set, and the path
  // information is added.
  var expand = function(node, openSet, closedSet) {
    // Close the current node
    closedSet.push(node);
    // Expand the node's neighbors
    for(j = node.y - 1; j < node.y + 2; j++) {
      for(i = node.x - 1; i < node.x + 2; i++) {
        // Ignore our current node
        if(j == node.y && i == node.x) 
          continue;
        // Ignore nodes already in the open or closed set
        if(openSet.contains({x:i,y:j}) || closedSet.contains({x:i,y:j})) 
          continue;
        // Add neighbour tiles that are not solid
        // to the fringe
        var tile = Tilemap.tileAt(i, j, 0);
        if(tile && !tile.solid) {
          openSet.push({
            x:i, 
            y:j, 
            path: node.path.concat({
              x: node.x, 
              y: node.y
            }),
            cost: 1 + node.cost
          });
        } else {
          closedSet.push({x:i, y:j});
        }
      }
    }
  }
  
  // Author: Nathan Bean
  // A* search expands nodes using a heuristic combining distance
  // from the goal with path cost.  As this is an estimate of the
  // cost to reach the goal, A* tends to find the cheapest, shortest
  // path to the goal state.
  var aStarSearch = function(goal, node, openSet, closedSet) {
  
    // Are we at the goal? If so, return the final node
	// with the path. Also, get rid of the first node
	// in the path because that's where the unit moving
	// already is and it looks weird if it goes to the
	// center of the tile it's already on before moving
	// on.
    if(goal.x == node.x && goal.y == node.y) {
		node.path.shift();
		node.path = node.path.concat({ x: node.x, y: node.y });
		return node;
    }
    
    // Expand the node
    expand(node, openSet, closedSet);
    
    // If nodes remain, continue with the shortest distance
    // to the goal.
    if(!openSet.empty()) {
        // Sorting the OpenSet by distance to the goal
        // plus the path cost and then removing the 
        // first element ensures we attempt the closest,
        // lowest-cost node first
        openSet.sort( function(a,b) {
          var sqDistA = Math.pow(a.x - goal.x, 2) + Math.pow(a.y - goal.y, 2),
              sqDistB = Math.pow(b.x - goal.x, 2) + Math.pow(b.y - goal.y, 2),
              gA = Math.sqrt(sqDistA),
              gB = Math.sqrt(sqDistB); 
          return (a.cost + gA) - (b.cost + gB);
        });
       return aStarSearch(goal, openSet.shift(), openSet, closedSet);
    } else {
      return undefined;
    }
  }
  