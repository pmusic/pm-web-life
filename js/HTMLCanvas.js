/**
*/
//var $jq = jQuery.noConflict();

var GameOfLife = function(w, h){
  this.World = function(w, h){
    
    this.blankGrid = function(){
      var g = new Array(this.w);
      for( var c=0; c<this.h; c++ ){
        g[c] = new Array(this.w);
      }
      return g;
    };
   
    /**
     *  counts how many live cells there are next to the cell at (x,y)
     */ 
    this.countNeighbors = function(x,y){
      var neighbors = 0;
      for( var m = x-1; m<=x+1; m++ ){
        for( var n = y-1; n<=y+1; n++ ){
          if( (m==x && n==y ) || m<0 || n<0 || m>=this.w || n>=this.h){
            continue;
          }
          if( this.grid[m][n] ){
            neighbors++;
          }
        }
      }
      return neighbors;
    };
    
    /**
     * returns true if was set to live; false if set to dead
     */ 
    this.change = function(x, y){
      if( this.grid[x][y] ){
        this.grid[x][y] = null;
        return false;
      } else {
        this.grid[x][y] = true;
        return true;
      } 
    };
    
    this.step = function(){
      console.log(this.grid);
      var tempGrid = this.blankGrid();
      
      for( var x=0; x<this.w; x++ ){
        for( var y=0; y<this.h; y++ ){
          var neighbors = this.countNeighbors( x, y );
  
          if( this.grid[x][y] && ( neighbors == 2 || neighbors == 3 )){
            tempGrid[x][y] = true;
          } else if( this.grid[x][y] == null && neighbors == 3 ){ 
            tempGrid[x][y] = true;
          }
        }
      }
  
      this.grid = tempGrid;
      console.log(this.grid);
    };
    
    // init stuff 
    this.w = w;
    this.h = h;
    this.grid = this.blankGrid();
    
  };
  
  this.step = function(){
    world.step();
    //redraw();
    draw(); //???
  };
  
  var draw = function(){
    for(var x=0; x<w; x++){
      for(var y=0; y<h; y++){
        var square = $('[data-x="' + x + '"][data-y="' + y + '"]');
        if( world.grid[x][y]){
          square.removeClass('off').addClass('on');
        } else {
          square.removeClass('on').addClass('off');
        }
      }
    }
  };
  
  this.click = function(){
    var box = $(this);
    var x = box.data('x');
    var y = box.data('y');
    if( world.change(x,y) ){
      box.removeClass('off').addClass('on');
    } else {
      box.removeClass('on').addClass('off');
    };
  };
 
  // constructor stuff
  var test = 'testttt';
  var w = w;
  var w = h;
  var world = new this.World(w, h); 
  
  // html stuff
  var squareSize = 20;
  var playing;
  
  var $game = $('#game');
  var $world = $('<div id="world"></div>');
  $world.width( w * squareSize + 'px' );
  $world.height( h * squareSize + 'px' );
 
  $game.html('');
  $world.appendTo( $game );
  
  // create blocks
  for( var a=0; a < w; a++ ){
    for( var b=0; b < h; b++ ){
      var $box = $( "<div></div>", {
        "data-x": a,
        "data-y": b,
        "class": 'off',
        style: 'top:'+ b*squareSize + 'px; left:'+ a*squareSize + 'px'
      });
      $box.width(squareSize);
      $box.height(squareSize);        
      $box.on('click', this.click);
      $box.appendTo( $world );
    }
  }
  
  // play controllers
  var $controls = $('<div id="controls"></div>');
    $controls.appendTo($game);
    
    var $step = $('<button>step</button>');
    $step.on('click',{world:world},this.step);
    $step.appendTo($controls);
    
    var $play = $('<button id="play">play</button>');
    $play.on('click',{world:world},this.play);
    $play.appendTo($controls);
};

$( function(){ game = new GameOfLife(10,10); } );
/*

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
/*	},
	
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
