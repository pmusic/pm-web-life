/*
 * Conway's Game of Life
 * 
 * alex
 * at
 * planetariummusic
 * dot
 * com
 */

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
    };
    
    // init stuff 
    this.w = w;
    this.h = h;
    this.grid = this.blankGrid();
    
  };
  
  var step = function(){
    world.step();
    draw(); 
  };
  
  this.playPause = function(){
    var button = $('#play');
    if( interval === null ){ //not running; start
      interval = setInterval( function(){ step(); }, 1000 );
      console.log(interval);
      button.html('Pause');
    } else {
      clearInterval( interval );
      interval = null;
      button.html('Play');
    }
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
  var interval = null; //timer
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
  $step.on('click', step);
  $step.appendTo($controls);
  
  var $play = $('<button id="play">play</button>');
  $play.on('click', this.playPause);
  $play.appendTo($controls);
  
  var $clearButton = $('<button id="clear">clear</button>');
	$clearButton.appendTo($controls);
	//clearButton.onclick = this.clear;
	
	var $randomizeButton = $('<button id="randomize">randomize</button>');
	$randomizeButton.appendTo($controls);
	// $randomizeButton.onclick = this.randomize;

};

$( function(){ game = new GameOfLife(10,10); } );
