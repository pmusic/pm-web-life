/**
Game class
*/
function world( width, height ){
	
	//default values
	this.width = width;
	this.height = height;
	//identifier for timer.
	var interval = null;

	this.createGrid = function(){
		var g = new Array(this.height);
		for( var x=0; x<this.height; x++ ){
			g[x] = new Array(this.width);
		}
		return g;
	}

	this.step = function(){
		var tempGrid = this.createGrid();

		for( var x=0; x<this.width; x++ ){
			for( var y=0; y<this.height; y++ ){
				var neighbors = this.countNeighbors( x, y );

				if( this.grid[x][y] && ( neighbors == 2 || neighbors == 3 )){
					tempGrid[x][y] = true;
				} else if( this.grid[x][y] == null && neighbors == 3 ){ 
					tempGrid[x][y] = true;
				}
			}
		}

		this.grid = tempGrid;
	}

	this.countNeighbors = function( x, y ){
	
		var neighbors = 0;
		for( var m = x-1; m<=x+1; m++ ){
			for( var n = y-1; n<=y+1; n++ ){
				if( (m==x && n==y ) || m<0 || n<0 || m>=this.width || n>=this.height){
					continue;
				}
				if( this.grid[m][n] ){
					neighbors++;
				}
			}
		}
		return neighbors;
	}



	/**
	clear grid
	*/
	this.clear = function(){
		this.grid = createGrid();
		this.draw();
	}

	this.randomize = function(){
		// Odds that any give square will be alive
		var odds = .4;

		for( var x=0; x<this.width; x++ ){
			for( var y=0; y<this.height; y++ ){
				if( Math.random() > odds ){
					this.grid[x][y] = true;
				} else {
					this.grid[x][y] = null;
				}
			}
		}
	}
	
	function playPause(){

		var button = document.getElementById('playpause');
		if( interval === null ){ //not running; start
			interval = setInterval( function(){game.tick()},1000 );
			button.innerHTML = 'Pause';
		} else {
			clearInterval( interval );
			interval = null;
			button.innerHTML = 'Play';
		}
	}
	

	//////////////////
	//constructor code
	this.grid = this.createGrid();
}
