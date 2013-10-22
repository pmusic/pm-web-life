<?
$loader = require_once __DIR__.'/../vendor/autoload.php';
// should autoload these
require_once '../src/PMusic/World.php';
require_once '../src/PMusic/User.php';

class PMusicTest extends PHPUnit_Framework_TestCase {
  function setUp(){
   
    // should only need to load this once... 
    $this->testJSON = file_get_contents('testworld.json'); 
    
    //set up test database
    copy( $this->testdbsetup, $this->testdb );
    
    $this->app = new Silex\Application();
    
    $this->app->register(new Silex\Provider\DoctrineServiceProvider(), array(
        'db.options' => array(
        'driver'   => 'pdo_sqlite',
        'path'     => $this->testdb 
      ),
    ));
  }
   
  function tearDown(){
    unlink($this->testdb); 
  }
 
 
  protected $testdbsetup = '../db/pmweblife-testsetup.db'; 
  protected $testdb = '../db/pmweblife-testrun.db';
  protected $testJSON;  
}
?>