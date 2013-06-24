/**
*/
function HTMLCanvas( world, squareSize ){
	
	this.getElement = function(){
		return this.frame;
	}
	
	this.draw = function(){
		for( var x=0; x<world.width; x++ ){
			for( var y=0; y<world.height; y++ ){
				var div = document.getElementById( 'b-' + x + '-' + y );
				
				if( world.grid[x][y] ){
					div.className = 'square on';
				} else {
					div.className = 'square off';
				}
			}
		}
	
	}
	
	this.step = function(){
		world.step();
		draw();
	}
	
	this.clear = function(){
		this.world.clear();
		this.draw();
	}
	
	this.randomize = function(){
		this.world.randomize;
		this.draw();
	}
	
		/**
	Called when a box is clicked
	*/
	this.clicked = function( event ){
		var x = this.x;
		var y = this.y;


		// update grid
		if(	world.grid[x][y] == null ){
			world.grid[x][y] = true;
			document.getElementById( 'b-' + x + '-' + y ).className = 'square on';
		} else {
			this.world.grid[x][y] = null;
			document.getElementById( 'b-' + x + '-' + y ).className = 'square off';
		}
	}
	
	this.playPause = function(){
		if( this.playing ){
			this.innerHTML = 'start';
			this.playing = false;
		} else {
			this.innerHTML = 'stop';
			this.playing = true;
		}
	}
	
	
	
	// Constructor stuff
	////////////////////
	
	// need these?
	var world = world;
	this.squareSize = squareSize;
	this.playing = false;
	
	this.frame = document.createElement('div');
	
	this.canvas = document.createElement('div');
	this.canvas.id = 'world';
	this.canvas.style.position = 'relative';
	this.canvas.style.width = world.width * squareSize + 'px';
	this.canvas.style.height = world.height * squareSize + 'px';
	
	for( var x=0; x<world.width; x++ ){
		for( var y=0; y<world.height; y++ ){
			var box = document.createElement('div');
			box.id = 'b-' + x + '-' + y;
			box.style.top = y*this.squareSize + 'px';
			box.style.left = x*this.squareSize + 'px';
			box.x = x;
			box.y = y;
			box.onclick = this.clicked;
			//box.setAttribute( 'onclick', 'javascript:game.clicked(\''+x+'\', \''+y+'\')' );

			this.canvas.appendChild( box );
		}
	}
	
	this.frame.appendChild( this.canvas );
	
	this.playButton = document.createElement( 'button' );
	this.playButton.id = 'play';
	this.playButton.innerHTML = 'play';
	this.playButton.onclick = this.playPause;
	
	this.stepButton = document.createElement( 'button' );
	this.stepButton.id = 'step';
	this.stepButton.innerHTML = 'step';
	this.stepButton.onclick = this.step;
	
	this.clearButton = document.createElement( 'button' );
	this.clearButton.id = 'clear';
	this.clearButton.innerHTML = 'clear';
	this.clearButton.onclick = this.clear;
	
	this.randomizeButton = document.createElement( 'button' );
	this.randomizeButton.id = 'randomize';
	this.randomizeButton.innerHTML = 'randomize';
	this.randomizeButton.onclick = this.randomize;
	
	
	
	this.frame.appendChild( this.stepButton );
	this.frame.appendChild( this.playButton );
	this.frame.appendChild( this.clearButton );
	this.frame.appendChild( this.randomizeButton );

	//this.draw( world );	
}
