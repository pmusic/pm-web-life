<?
$loader = require_once __DIR__.'/../vendor/autoload.php';
// should autoload these
require_once '../src/PMusic/World.php';
require_once '../src/PMusic/User.php';

/**
 * Abstract class for tests
 *
 */
class PMusicTest extends PHPUnit_Framework_TestCase {
  function setUp(){
  	$_SERVER['PM_WEB_LIFE__PROFILE'] = 'test';
  	
	  $this->testdbsetup = __DIR__.'/../db/pmweblife-testsetup.db'; 
		$this->testJSON = __DIR__.'/testworld.json';  


  	require __DIR__.'/../web/index.php';

    //set up test database
    copy( $this->testdbsetup, PM_WEB_LIFE__DBFILE );
  	
    // should only need to load this once... 
    $this->testJSON = file_get_contents($this->testJSON); 
    
    
    $this->app = $app;
    /*
    $this->app = new Silex\Application();
    
    $this->app->register(new Silex\Provider\DoctrineServiceProvider(), array(
        'db.options' => array(
        'driver'   => 'pdo_sqlite',
        'path'     => $this->testdb 
      ),
    ));
    */
  }
   
  function tearDown(){
    unlink(PM_WEB_LIFE__DBFILE); 
  }

  protected $app;
  protected $testdbsetup; 
  protected $testdb;
  protected $testJSON;
}