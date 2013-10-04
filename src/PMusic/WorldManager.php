<?
namespace PMusic;

class WorldManager {

  function __construct($app){
    $this->app = $app;
  }

  function load( $name, $json ){
    $this->name = $name;
    $this->json_world = $json;
  }
  
  function setName( $name ){
    $this->name = $name;
  }
  function getName(){
    return $this->name;
  }

  /**
   * @return string. 'success' if it was saved, 'duplicate' if it was not saved because a world of that name already exists
   */  
  function save(){
    if($this->checkDuplicateName($this->name)){
      return 'duplicate';
    }

    $sql = 'INSERT INTO WORLDS (name, world_json) VALUES(?, ?)';
    $stmt = $this->app['db']->prepare( $sql );
    $stmt->bindValue( 1, $this->name );
    $stmt->bindValue( 2, $this->json_world );
    $stmt->execute();
    return 'saved';
  }
  
  /**
   * checks if a world with that name already exists
   * @param $name string
   * @return boolean TRUE if there is a duplicate, FALSE if there is no duplicate.
   */
  function checkDuplicateName(){
    $dup = $this->app['db']->fetchColumn( 'SELECT id from worlds where name=?', array( $this->name ) );
    if( $dup ){
      return true;
    }
    return false;
  }
  
  static function update($name, $json){
    
  }

  static function retrieve(){
  }
  
  static function delete( $id ){
    
  }
 
  private $id; 
  private $name;
  private $json_world;
  private $app;
}
?>
