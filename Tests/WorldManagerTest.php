<?
$loader = require_once __DIR__.'/../vendor/autoload.php';
require_once '../src/PMusic/WorldManager.php';

class WorldManagerTest extends PHPUnit_Framework_TestCase {
  
  function setUp(){
    
    //set up test database
    copy( $this->testdbsetup, $this->testdb );
    
    $this->app = new Silex\Application();
    
    $this->app->register(new Silex\Provider\DoctrineServiceProvider(), array(
        'db.options' => array(
        'driver'   => 'pdo_sqlite',
        'path'     => $this->testdb 
      ),
    ));
    $this->wm = new PMusic\WorldManager($this->app);
  }
  
  function tearDown(){
    unlink($this->testdb); 
  }
 
  function test(){
    $this->assertEquals(1,2);
  } 
  
  function testDuplicateName(){
    $this->wm->setName('thename');
    $dup = $this->wm->checkDuplicateName();
    $this->assertTrue( $dup );
  }
  function testNoDuplicateName(){
    $this->wm->setName('Nothing has this name!');
    $dup = $this->wm->checkDuplicateName();
    $this->assertFalse( $dup );
  }
  
  function testSetName(){
    $this->wm->setName('Test Name');
    $this->assertEquals( $this->wm->getName(), 'Test Name' );
  }
 
  private $testdbsetup = '../db/pmweblife-testsetup.db'; 
  private $testdb = '../db/pmweblife-testrun.db';
  
}
?>