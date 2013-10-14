<?
namespace PMusic;

class WorldManager {

  function __construct($app){
    $this->app = $app;
  }

  function load($name, $json){
    $this->setName($name);
    $this->setWorld($json);
  }
  
  function setName($name){
    $this->name = $name;
  }

  function setWorld($json){
    $this->json_world = $json; 
  }
  function getName(){
    return $this->name;
  }
  function getWorld(){
    return $this->json_world;
  }

  /**
   * @return string. 'success' if it was saved, 'duplicate' if it was not saved because a world of that name already exists
   */  
  function save(){
    if ($this->checkDuplicateName($this->name)){
      return 'duplicate';
    }

    $sql = 'INSERT INTO WORLDS (name, world_json) VALUES(?, ?)';
    $stmt = $this->app['db']->prepare($sql);
    $stmt->bindValue(1, $this->name);
    $stmt->bindValue(2, $this->json_world);
    $stmt->execute();
    return 'saved';
  }
  
  /**
   * checks if a world with that name already exists
   * @param $name string
   * @return boolean TRUE if there is a duplicate, FALSE if there is no duplicate.
   */
  function checkDuplicateName(){
    $dup = $this->app['db']->fetchColumn('SELECT id from worlds where name=?', array($this->name));
    if ($dup){
      return true;
    }
    return false;
  }
 
  /**
   * @return key/value array of worlds
   */
  function worldList(){
    return $this->app['db']->fetchAll('SELECT id, name FROM worlds ORDER BY name');
  }
 
  private $id; 
  private $name;
  private $json_world;
  private $app;
}
?>
