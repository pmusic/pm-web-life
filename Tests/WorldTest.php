<?
$loader = require_once __DIR__.'/../vendor/autoload.php';
require_once '../src/PMusic/World.php';

/**
 * TODO make parent class for setup/teardown stuff
 */
class WorldManagerTest extends PHPUnit_Framework_TestCase {
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
  
  function testLoad_success(){
    $world = new PMusic\World($this->app, 5);
    $success = $world->load();
    $this->assertTrue($success);
    $this->assertEquals('jzjzjzjzjdfsddvds', $world->name);
  }

  function testLoad_failure(){
    $world = new PMusic\World($this->app, 2345);
    $success = $world->load();
    $this->assertFalse($success);
  }
  private $testdbsetup = '../db/pmweblife-testsetup.db'; 
  private $testdb = '../db/pmweblife-testrun.db';
  private $testJSON; 
}
?>
  