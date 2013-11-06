/*
 * Conway's Game of Life
 * 
 * alex
 * at
 * planetariummusic
 * dot
 * com
 */

/**
 * 
 * @param integer w width of grid
 * @param integer h height of grid
 * @returns {GameOfLife}
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
    $play.html('<span class="icon-play"></span>');
  };
  
  var start = function(){
    interval = setInterval( function(){ step(); }, frame );
    $play.html('<span class="icon-pause"></span>');
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
    notice('Random world created');
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
  var save = function(){
    var savename = $('#name-world').val().trim();
    if( savename.length == 0 ){
      $modal.warning('Please enter a name to save the game as'); 
      return;
    }

    $.post( '/world/save', 
      { name: savename, world: JSON.stringify(world.grid) },
      function(returned){
        if(returned == 'saved'){
          $modal.hide();
          notice('Saved!');
        } else {
          var msg = JSON.parse(returned);
          var warning = '<ul>';
          for(var c = 0; c < msg.length; c++){
            warning += '<li>' + msg[c] + '</li>'; 
          }
          warning += '</ul>';

          $modal.warning(warning);
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
    $.get('/world/checkdupname/' + escape(this.value), function(returned){
      if( returned=='t' ){
        $modal.warning('A world with that name already exists.');
      } else {
        $modal.clearNotice(); 
      } 
    });
  };
   
  /**
   * Loads the world with the given id
   */ 
  var load = function(id){
    $.get('/world/' + id, function(returned){
      if(returned == 'no world'){
        console.log('TODO: alert to user');
      }
      world.grid = JSON.parse(returned);
      setStartState();
      draw(); 

      $modal.hide();
    });
  }; 
    
  /**
   * Creates the load form in the menu.
   */
  var loadWorldList = function(){
    var $worldList = $('<select id="worldList"></select>');
    var $form = $('#loadlink').next();
    $.get('/worldlist', function(returned){
      var list = JSON.parse(returned);
      for(var index in list){ //TODO: change to indexed for loop; can't count on for/in to do things in order
        $worldList.append('<option value="' + list[index]['id'] + '">' + list[index]['name'] + '</option>');
      }
      $form.append($worldList);
      $loadButton = $('<button>Load</button>');
      $loadButton.on('click', function(){ load($worldList.val()); });
      $form.append($loadButton);
    });
  };
  
 
  /**
   * load the save modal
   */
  var saveWindow = function(){
    $modal.clear(); 
    $modal.append('Name:');
    $nameBox = $('<input type="text" id="name-world">');	
    $nameBox.on('keyup', checkDuplicateName);
  	$modal.append($nameBox);
  
  	var $saveButton = $('<button id="save">save</button>');
  	$saveButton.on('click', save);
  	$modal.append($saveButton);
	
    $modal.show();
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
  var squareSize = (100/w);
  var width = w * squareSize;
  
  var $game = $('#game');
  var $world = $('<div id="world"></div>');

  $world.width('100%');

  $game.html('');
  $world.appendTo( $game );
  
  // create blocks
  for( var a=0; a < w; a++ ){
    for( var b=0; b < h; b++ ){
      var $container = $('<div></div>', {
					'class': 'container',
					style: 'top:'+ b*squareSize + '%; left:'+ a*squareSize + '%'
      });
      var $box = $( "<div></div>", {
					"data-x": a,
					"data-y": b,
					"class": 'block off',
					'id': 'b-' + a + '-' + b
      });
      $container.width(squareSize + '%');
      $container.height(squareSize + '%');        
      $box.on('click', click);
      $box.appendTo($container);
      $container.appendTo( $world );
    }
  }
  
  $('#frame').width('100%');
  $world.height($world.width());
  
  // play controllers
  var $controls = $('#controls');
  
  var $timeZero = $('<button id="zero"><span class="icon-first"></span></button>');
  $timeZero.on('click', this.timeZero);
  $timeZero.appendTo($controls);

  var $play = $('<button id="play"><span class="icon-play"></span></button>');
  $play.on('click', this.playPause);
  $play.appendTo($controls);

  var $step = $('<button><span class="icon-next"></span></button>');
  $step.on('click', step);
  $step.appendTo($controls);
  
  var $clearButton = $('<button id="clear">clear</button>');
	$clearButton.on('click', this.clear);
	$clearButton.appendTo($controls);
	
	var $randomizeButton = $('<button id="randomize"><span class="icon-loop"></span></button>');
	$randomizeButton.on('click', this.random);
	$randomizeButton.appendTo($controls);


	/*
  var $saveWorld = $('<button><span class="icon-disk"></span></button>');
  $saveWorld.on('click', saveWindow);
  $controls.append($saveWorld);
  */
 
  var $time = $('#time');
  
  var $messages = $('#messages');
  $messages.addClass('empty').addClass('message');
  //clear the "no javascript" message
  $messages.html('Welcome! For information, open the menu (&quot;<span class="icon-menu"></span>&quot;) in the upper left-hand corner.');
  
  
  //var $modal = new this.Modal();

  var user = new this.User();


  var $menu = $('#menu');
  
  
  /* accordion functionality */
  $('#accordion > div').hide();
  $('#accordion h3').on('click', function(){
      $('#accordion > div').slideUp();
      $(this).next().slideDown();
  });
 
  /* menu link */
  var $menuLink = $('<span id="menulink" class="icon-menu"></span>');
  $menuLink.on('click', function(){ $menu.slideToggle(); });
  $('header').prepend($menuLink);
  
  /* behavior for items in menu */
  
  $('#loadlink').one('click', function(){
     console.log('loadlink');
     loadWorldList(); 
  })
  
};

/**
 * Handles user interactions
 * @param $modal Modal object
 */
GameOfLife.prototype.User = function(){

  this.validationErrors = new Array();
  this.username;
  this.email;
  this.id;
  this.$form = $('[name="user"]');
  
  var that = this;
  
  this.$form.on('submit', function(){
    that.login(this.username, this.password);
    return false;
  });
  
  
  this.login = function(username, password){
    $.post('/user/login', 
        {username: $('[name="username"]').val(),
        password: $('[name="password"]').val() },
        function(response){
          if(response == 't'){
            console.log('logged in');
            //TODO
          } else {
            console.log('not logged in');
            //TODO
          }
        }
    );
  };
  
  this.create = function(){
    
    $.post('/user/create', 
          {username: $('[name="username"]').val(),
          password: $('[name="password"]').val(),
          email: $('[name="email"]').val()}, // TODO? set object values as form fields change
          function(response){
            if(response=='created'){
              that.notice('User created!');
              //TODO create logout thing
            } else {
              console.log('TODO: show error messages');
            }
            return false;//?
          }
    );
    return false;
  };
  
  this.logout = function(){
    
  };
 
  /**
   * show the login form
   */
  this.loginWindow = function(){
 };
 /* 
  this.createWindow = function(){
    $modal.empty();
    $modal.title('Create a user');
    var $form = $('<form name="createuser"></form>');
    $form.input({name: 'username', description: 'User Name'});
    $form.input({name: 'email', description: 'Email address'});
    $form.input({name: 'password', description: 'Password', type: 'password'});
    $form.append('<input type="submit" name="create">');
    
    $form.on('submit',that.create);
    
    $modal.append($form);
    
    $modal.show();
  };
	*/
 
  /**
   * @
   */ 
  this.validate = function(){
    that.validationErrors = new Array();
    that.validateUserName();
    that.validatePassword();
  };
  
  this.validateUserName = function(){
    if(that.username.length < 4){
      that.validationErrors['username'] = 'The user name must be longer than three characters';
    }
  };

  this.validatePassword = function(){
    if(that.password.length < 9){
      that.validationErrors['password'] = 'The password must be at least eight characters.'; 
    }
  };
};

/*
 * extend jquery
 */
$.fn.extend({
  input: function(params){
    var name = params.name || '';
    var description = params.description || 'input';
    var type = params.type || 'text';
    
    this.append('<div class="form-description" id="description-' + name + '">' + 
                  description + 
                  '</div>' + 
                  '<input type="' + type + '" name="' + name + '">');
  }
});

$( function(){ 
  game = new GameOfLife(45, 45);
  /*
  $( "#accordion" ).accordion();
  */
});