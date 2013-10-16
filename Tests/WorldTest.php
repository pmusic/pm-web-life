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
    $this->assertEquals('name in database', $world->name);
  }

  function testLoad_failure(){
    $world = new PMusic\World($this->app, 2345);
    $success = $world->load();
    $this->assertFalse($success);
  }
  
  function testSave_newSuccess(){
    $numBefore = $this->app['db']->fetchColumn('SELECT COUNT(id) from worlds');
    
    $world = new PMusic\World($this->app);
    $world->name = 'Unique New Name';
    $world->world = 'THIS WOULD BE JSON';
    $ret = $world->save();
    
    $numAfter = $this->app['db']->fetchColumn('SELECT COUNT(id) from worlds');
    
    $this->assertTrue($ret);
    $this->assertEquals($numBefore, $numAfter-1); 
  }
  function testSave_modifySuccess(){
    $new_name = 'Unique New Name';
    $new_world = 'THIS WOULD BE JSON';    
    
    $world = new PMusic\World($this->app, 5);
    $world->name = $new_name;
    $world->world = $new_world;
    $ret = $world->save();

    $this->assertTrue($ret);
    
    $w2 = new PMusic\World($this->app, 5);
    $w2->load();
    $this->assertEquals($new_name, $w2->name);
    $this->assertEquals($new_world, $w2->world); 

  }
  function testSave_duplicateName(){
    $w = new PMusic\World($this->app);
    $w->name = 'name in database';
    $w->world = 'THIS WOULD BE JSON';
    $ret = $w->save();
    
    $this->assertFalse($ret);
    $this->assertNotEmpty($w->getValidationErrors());
    
  }
  function testSave_emptyVars(){
    $w = new PMusic\World($this->app);
    $success = $w->save();
    
    $this->assertFalse($success);
    $this->assertNotEmpty($w->getValidationErrors());
    //TODO check for particular validation errors
  }
  function testWorldList(){
    $w = new PMusic\World($this->app);
    $list = $w->worldList();
    $this->assertEquals(count($list),7);
    
    return $list;
  }  
  /**
   * @depends testWorldList
   */
  function testWorldListAlphabetical(array $list){
    $this->assertEquals($list, asort($list));    
  }
 
 

  private $testdbsetup = '../db/pmweblife-testsetup.db'; 
  private $testdb = '../db/pmweblife-testrun.db';
  private $testJSON; 
}
?>
  