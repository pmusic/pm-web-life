<?php
namespace PMusic;

class User {
  
  function __construct($app, $id=null){
    if($id !== null and intval($id) < 1){
      trigger_error('$id must be null or a positive integer. Value received was: ' . $id, E_USER_ERROR);
    }
    $this->app = $app;
    $this->id = $id;
  }
  
  function load(){
	  $sql = 'SELECT * FROM users where id=:id';
	  //$this->app['db']
    
  } 
  
  function setPassword($password){
  	$this->password = $password;
  	$this->password_crypt = crypt($password, PM_WEB_LIFE__SALT);
    
  }
  function setUsername($username){
    $this->username = $username;
  }
  function getUsername(){
    return $this->username;
  }
  
  function validate(){
  	$this->validation_errors = array();
  	$this->validateUsername();
  	$this->validatePassword();
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
  
  function save(){
		if($this->id){
			return $this->update();
		} else {
			return $this->create();
		}  	
  }

  private function create(){
  	$sql = 'INSERT INTO users (username, email, password) VALUES (:username, :email, :password)';
  	$params = array(
  			'username' => $this->username, 
  			'email' => $this->email, 
  			'password' => $this->password_crypt);

  	return $this->app['db']->executeUpdate($sql, $params);
  }

  private function update(){
  	
  }
  
  function login($username, $password){
  	$sql = 'SELECT * FROM users WHERE username = :username';
  	$u = $this->$app['db']->fetchAssoc($sql, array('username' => $username));
  	
  	if(!$u){
  		return false;
  	}
  	
  	$this->username = $u['username'];
  	$this->password_crypt = $u['password'];
  	
  	if(crypt($password, PM_WEB_LIFE__SALT) == $this->password_crypt){
	  	$this->app['session']->set('user', array('user_id' => $this->id));	
  	} else {
  		return false;
  	}
  }
  
  function logout(){
  	$this->app['session']->remove('user');	
  }

  public $id, $email;
  public $validation_errors;
  private $username, $password, $password_crypt;
  
}