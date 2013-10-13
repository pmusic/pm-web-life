<?
$loader = require_once __DIR__.'/../vendor/autoload.php';
require_once '../src/PMusic/WorldManager.php';

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
    $this->wm = new PMusic\WorldManager($this->app);
  }
  
  function tearDown(){
    unlink($this->testdb); 
  }
 
  function testLoad(){
    $name = 'THE NAME';
    $this->wm->load($name, $this->testJSON);
    $this->assertEquals($this->wm->getName(), $name);
    $this->assertEquals($this->wm->getWorld(), $this->testJSON); 
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
  
  function testSave(){
    $numBefore = $this->app['db']->fetchColumn('SELECT COUNT(id) from worlds');
    $this->wm->setName('Test Name');
    $this->wm->setWorld($this->testJSON);
    $this->wm->save();
    $numAfter = $this->app['db']->fetchColumn('SELECT COUNT(id) from worlds');
    $this->assertEquals($numBefore, $numAfter-1);
  }
  function testSaveDuplicate(){
    $this->wm->setName('thename');
    $this->wm->setWorld($this->testJSON);
    $this->assertEquals($this->wm->save(), 'duplicate');
  }
  function testWorldList(){
    $list = $this->wm->worldList();
    $this->assertEquals(count($list),7);
  }
  function testWorldListAlphabetical(){
    $list = $this->wm->worldList();
    $this->assertEquals($list, asort($list));    
  }
 
  private $testdbsetup = '../db/pmweblife-testsetup.db'; 
  private $testdb = '../db/pmweblife-testrun.db';
  private $testJSON; 
}
?>