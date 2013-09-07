/**
*/
var $jq = jQuery.noConflict();

var HTMLCanvas = Class.create({
	initialize: function( world, squareSize ){
		//global :/
		htmlcanvasworld = world;
		//var self = this;
		this.squareSize = squareSize;
		this.playing;
		
		this.$frame = $jq('<div id="frame"></div>' );
		this.$canvas = $jq('<div/>', {
			id: "canvas",
			style: "position:relative"
			} );
		this.$canvas.width( htmlcanvasworld.width * squareSize + 'px' );
		this.$canvas.height( htmlcanvasworld.height * squareSize + 'px' );
		
		this.$canvas.appendTo( this.$frame );
		
		// create divs
		for( var x=0; x<htmlcanvasworld.width; x++ ){
			for( var y=0; y<htmlcanvasworld.height; y++ ){
				var $box = $jq( "<div/>", {
					id: 'b-' + x + '-' + y,
					"class": 'off',
					style: 'top:'+ y*squareSize + 'px; left:'+ x*squareSize + 'px'
				});
				$box.width(squareSize);
				$box.height(squareSize);				
				$box.on('click',{x:x,y:y}, this.clicked );
				$box.appendTo( this.$canvas );
			}
		}
		
		var $controls = $jq('<div id="controls"/>');
		$controls.appendTo(this.$frame);
		
		var $step = $jq('<button>step</button>');
		$step.on('click',{world:world},this.step);
		$step.appendTo($controls);
		
		var $play = $jq('<button id="play">play</button>');
		$play.on('click',{world:world},this.play);
		$play.appendTo($controls);
				
/*		
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
		*/
	},
	
	clicked: function( event ){
		var x = event.data.x;
		var y = event.data.y;

		// update grid
		if(	htmlcanvasworld.grid[x][y] == null ){
			htmlcanvasworld.grid[x][y] = true;
			$jq('#b-' + x + '-' + y).attr('class', 'square on' );
		} else {
			event.data.world.grid[x][y] = null;
			document.getElementById( 'b-' + x + '-' + y ).className = 'square off';
		}
	},
	
	getElement: function(){
		return this.$frame;
	},
	
	play: function(event){
		if( this.playing ){
			clearInterval( this.playing );
			this.playing = null;
		} else {
			this.playing = setInterval( function(){htmlcanvasworld.step();canvas.draw()},1000 );
		}
	},
	
	step: function(){
		console.log('hihi');
		world.step();
		canvas.draw();
	}
});

//~ 
//~ HTMLCanvas.prototype.step = function(){
	//~ 
//~ }.bind(this);

HTMLCanvas.prototype.draw =  function(){
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
};

/*

HTMLCanvas = function( world, squareSize ){
	
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
		draw();
	}
	
	this.randomize = function(){
		this.world.randomize;
		this.draw();
	}
	

	this.clicked = function( event ){
		var x = this.x;
		var y = this.y;


		// update grid
		if(	world.grid[x][y] == null ){
			world.grid[x][y] = true;
			document.getElementById( 'b-' + x + '-' + y ).className = 'square on';
		} else {
			world.grid[x][y] = null;
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
*/
