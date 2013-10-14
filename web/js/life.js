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
  
  /**
   * (Roughly) models the world
   */
  this.World = function(w, h){
    
    this.loadGrid = function(loadgrid){
      this.grid = loadgrid;
    };
    
    /**
     * returns a blank grid
     */
    this.blankGrid = function(){
      var g = new Array(this.w);
      for(var c = 0; c < this.h; c++){
        g[c] = new Array(this.w);
      }
      return g;
    };
    
    /**
     * clears the grid
     */
    this.blank = function(){
      this.grid = this.blankGrid();   
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
  }; // end World definition
 
  /**
   * Move forward one step
   */ 
  var step = function(){
    world.step();
    setTime(time + 1);
    draw(); 
  };
  
  /**
   * Call when the play/pause button is pressed
   */
  this.playPause = function(){
    if( interval === null ){ //not running; start
      start();
    } else {
      stop(); 
    }
  };
  
  var stop = function(){
    clearInterval( interval );
    interval = null;
    $play.html('play');
  };
  
  var start = function(){
    interval = setInterval( function(){ step(); }, frame );
    $play.html('pause');
  };
  
  /**
   * create random world
   */
  this.random = function(){
    for(var x=0; x<w; x++){
      for(var y=0; y<w; y++){
        if(Math.random() > 0.5){
          world.grid[x][y] = true;
        } else {
          world.grid[x][y] = null;
        }
      }
    } 
    draw();
  };
  
  /**
   * clear world
   */
  this.clear = function(){
    world.blank();
    setTime(0);
    draw();
  };
  
  /**
   * Draws the world
   */
  var draw = function(){
    for(var x=0; x<w; x++){
      for(var y=0; y<h; y++){
        // TODO?  improve performance by saving an array of the jQuery objects.
        var square = $('#b-' + x + '-' + y);
        if( world.grid[x][y]){
          square.removeClass('off').addClass('on');
        } else {
          square.removeClass('on').addClass('off');
        }
      }
    }
  };
 
  /**
   * Call when a cell is clicked
   */ 
  var click = function(){
    var box = $(this);
    var x = box.data('x');
    var y = box.data('y');
    if( world.change(x,y) ){
      box.removeClass('off').addClass('on');
    } else {
      box.removeClass('on').addClass('off');
    };
    setStartState();
  };

  /**
   * sets the time.
   * @param t Time to set to. 
   */
  var setTime = function(t){    
    time = t;
    $time.text(time);
  };
  
  /**
   * Show user warning message
   */
  var warning = function(message){
    $messages.removeClass().addClass('warning').text(message);
  };
  /**
   * Show user notice
   */
  var notice = function(message){
    $messages.removeClass().addClass('notice').text(message);
  };
  /**
   * clear notice or warning message
   */
  var clearMessage = function(){
    $messages.removeClass().addClass('empty').empty();
  };

  /**
   * Posts world to the server
   */
  this.save = function(){
    var savename = $('#name-world').val().trim();
    if( savename.length == 0 ){
      warning('Please enter a name to save the game as'); 
      return;
    }

    $.post( '/save', 
      { name: savename, world: JSON.stringify(world.grid) },
      function(returned){
        if(returned=='saved'){
          notice('Saved!');
        } else {
          var msg = JSON.parse(returned);
          var warning = '<ul>';
          for(var c = 0; c < msg.length; c++){
            warning += '<li>' + msg[c] + '</li>'; 
          }
          warning += '</ul>';

          warning(warning);

          
        }
      }
    );
  };
 
  /**
   * Returns world to state where t==0
   */ 
  this.timeZero = function(){
    console.log(start_state_grid);
    world.grid = $.extend({},start_state_grid);
    setTime(0);
    draw();
  };
  
  /**
   * Saves current state of the world as the start state
   */
  var setStartState = function(){
    start_state_grid = $.extend({}, world.grid);
    setTime(0);
  };
  
  /**
   * TODO: check handling of unicode
   * TODO: cancel previous checks if they haven't come back;
   */
  var checkDuplicateName = function(){
    console.log('checking if "' + this.value + '" has a duplicate.');
    if(!this.value){
      console.log('blank');
      return;
    }
    $.get('/checkdup/' + escape(this.value), function(returned){
      if( returned=='t' ){
        warning('A world with that name already exists.');
      } else {
        clearMessage(); 
      } 
    });
  };
   
  /**
   * 
   */ 
  var load = function(id){
    $.get('/world/' + id, function(returned){
      if(returned == 'no world'){
        console.log('TODO: alert to user');
      }
      world.grid = JSON.parse(returned);
      setStartState();
      draw(); 
      console.log('TODO: close modal');
    });
  }; 
    
  var loadWindow = function(){
    var $modal = $('<div id="loadmodal"></div>');
    $modal.modal({w: 500, h:500, title:'Load World'});
    
    var $worldList = $('<select id="worldList"></select>');
    $.get('/worldlist', function(returned){
      var list = JSON.parse(returned);
      for(var index in list){ //TODO: change to indexed for loop; cant count on for/in to do things in order
        $worldList.append('<option value="' + list[index]['id'] + '">' + list[index]['name'] + '</option>');
      }
      $modal.append($worldList);
      $loadButton = $('<button>Load</button>');
      $loadButton.on('click', function(){ load($worldList.val()); });

      $modal.append($loadButton);
      
      $modal.show();
    });
    $modal.show('slow');
  }; 

  /*
   * init stuff
   */ 
  // object stuff ///////////////
  var w = w;
  var h = h;
  var world = new this.World(w, h); 

  var start_state_grid = $.extend({},world.grid);
  
  var interval = null; //timer
  var time = 0;
  // time between steps in ms
  var frame = 500;
  // html stuff /////////////////
  var squareSize = 20;
  var width = w * squareSize;
  
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
        'id': 'b-' + a + '-' + b,
        style: 'top:'+ b*squareSize + 'px; left:'+ a*squareSize + 'px'
      });
      $box.width(squareSize);
      $box.height(squareSize);        
      $box.on('click', click);
      $box.appendTo( $world );
    }
  }
  
  $('#frame').width(width);
  
  // play controllers
  var $controls = $('<div id="controls" class="controlbox"></div>');
  $controls.prependTo($game);
  var $manage = $('<div id="manage" class="controlbox"></div>');
  $manage.prependTo($game);
  
  var $step = $('<button>step</button>');
  $step.on('click', step);
  $step.appendTo($controls);
  
  var $play = $('<button id="play">play</button>');
  $play.on('click', this.playPause);
  $play.appendTo($controls);
  
  var $clearButton = $('<button id="clear">clear</button>');
	$clearButton.on('click', this.clear);
	$clearButton.appendTo($controls);
	
	var $randomizeButton = $('<button id="randomize">randomize</button>');
	$randomizeButton.on('click', this.random);
	$randomizeButton.appendTo($controls);

  $manage.append('Name:');

  $nameBox = $('<input type="text" id="name-world">');	
  $nameBox.on('keyup', checkDuplicateName);
	$manage.append($nameBox);

	var $saveWorld = $('<button id="save">save</button>');
	$saveWorld.on('click', this.save);
	$manage.append($saveWorld);
	
	var $loadWorld = $('<button>load</button>');
	$loadWorld.on('click', loadWindow);
	$manage.append($loadWorld);

  var $clock = $('<span id="clock">&nbsp;Time:&nbsp;</span>');
  var $time = $('<span id="time">0</span>');
  $clock.appendTo($controls);
  $time.appendTo($controls);
  
  var $timeZero = $('<button id="zero">t=0</button>');
  $timeZero.on('click', this.timeZero);
  $timeZero.appendTo($controls);
  
  //clear the "no javascript" message
  var $messages = $('#messages').addClass('empty');
  $messages.text('');
};

$.fn.extend({
  titleBar: function(title){
    var that = this;
    console.log('running titleBar');
    $title = $('<div class="modal-title"></div>');
    $title.append(title);
    $close = $('<button class="close-button">x</button>');
    $close.on('click', function(){
      that.remove();
    });
    //todo: close function
    $title.append($close);
    this.append($title);
  },
  modal: function(params){
    // params: w, h (pixels), title (shown in title bar), id (css id)
    var w = params.w || 500;
    var h = params.h || 500;
    var title = params.title || '';
    var id = params.id || '';
    
    //TODO calculate position
    this.titleBar(title);
    this.height(h + 'px');
    this.width(w + 'px');
    this.addClass('modal');
    this.css('margin-left', (-w/2) + 'px');
    
    this.hide();
    $('body').append(this);
  }
});

$( function(){ game = new GameOfLife(45, 45); } );