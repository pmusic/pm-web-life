<?php
namespace PMusic;

class User {
  
  function __construct($app, $id=null){
    if($id !== null and intval($id) < 1){
      trigger_error('$id must be null or a positive integer. Value received was: ' . $id, E_USER_ERROR);
    }
    $this->id = $id;
  }
  
  function load(){
	  $sql = 'SELECT * FROM users where id=:id';
	  //$this->app['db']
    
  } 
  
  function setPassword($password){
    
  }
  function setUsername($username){
    
  }
  function getUsername(){
    return $this->username;
  }
  
	/**
	 * 
	 * @return boolean true if the name is valid
	 */
  function validateUsername(){
    if(strlen($this->username) < 8 ){
      $this->validation_errors['username'] = 'User name must be more than eight characters long';
      return false;
    }
    return true;
  }
	/**
	 * 
	 * @return boolean true if the password is valid
	 */
	function validatePassword(){
    if(strlen($this->password) < 8){
      $this->validation_errors['password'] = 'Password must be more than eight characters long';
      return false;
    }
    return true;
  }
  function authenticate($password){
    
  }
  public $id;
  public $validation_errors;
  private $username, $password;
  
}
?>