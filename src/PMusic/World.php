<?
namespace PMusic;
use \Exception;

class World{
  /**
   * Constructor
   */ 
   function __construct($app, $id=null){
     $this->app = $app;
     if($id !== null and intval($id) < 1){
       throw new Exception('$id must be null or a positive integer. Value received was: ' . $id, 1);
     }
     $this->id = $id;
   }
   
   /**
    * Loads a world from db
    * @return boolean TRUE if it fetched a world, FALSE otherwise
    */
   function load(){
     $sql = 'SELECT * FROM worlds where id=?';
     $w = $this->app['db']->fetchAssoc($sql, array($this->id));
     if(!$w){ 
       return false;
     }
     $this->name = $w['name'];
     $this->world = $w['world_json'];
     return true;
   }
  
   /**
    * Persists object to database. 
    */ 
    function save(){
      if( !$this->validate() ){
        return false;
      }
      
      if($this->id){
        return $this->update();
      } else {
        return $this->create();
      }
    }
   
    private function update(){
      $sql = 'UPDATE worlds SET name=?, world_json=? WHERE id=?';
      $count = $this->app['db']->executeUpdate($sql, array($this->name, $this->world, $this->id));
      //TODO throw exception if didn't update.
      return ( $count == 1 ) || false;
    }

    private function create(){
      $sql = 'INSERT INTO WORLDS (name, world_json) VALUES(?, ?)';
      $stmt = $this->app['db']->prepare($sql);
      $stmt->bindValue(1, $this->name);
      $stmt->bindValue(2, $this->world);
      $stmt->execute();
      //TODO set object id
      return true;
    }
   
   function validate(){
     $ret = true;
     $this->validation_errors = array();
     
     if(strlen($this->name) < 1){
       $ret = false;
       $this->validation_errors[] = 'Name cannot be blank';
     }
     if(strlen($this->world) < 1){
       $ret = false;
       $this->validation_errors[] = 'World not set';
     }
     
     $ret = !$this->duplicateName() && $ret;
     return $ret; 
   } 
    
   
   /**
   * checks if a world with that name already exists
   * @param $name string
   * @return boolean TRUE if there is a duplicate, FALSE if there is no duplicate.
   */
  function duplicateName(){
    $dup = $this->app['db']->fetchColumn('SELECT id from worlds where name=?', array($this->name));
    if($dup == $this->id || !$dup){
      return false;
    }
    $this->validation_errors[] = 'Name is a duplicate';
    return true;
  }
   
   
   function getValidationErrors(){
     return $this->validation_errors; 
   }
   
   public $name, $world, $description;
   protected $id, $validation_errors = array();
}
?>