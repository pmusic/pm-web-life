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
       throw new Exception('$id must be null or a positive integer', 1);
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
     $this->json = $w['world_json'];
     return true;
   }
   
   function save(){
     
   }
   
   public $name, $world, $description;
   protected $id;
}
?>