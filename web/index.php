<?php
require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PMusic\World;

switch($_SERVER['PM_WEB_LIFE__PROFILE']){
	case 'development':
		require_once( __DIR__.'/../config/development.php');
		break;
	case 'test':
		require_once __DIR__.'/../config/test.php';
		break;
	case 'production':
		require_once __DIR__.'/../config/production.php';
		break;
	default:
		trigger_error('Need to set the variable $_SERVER["PM_WEB_LIFE__PROFILE"]');
}


$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
    'driver'   => 'pdo_sqlite',
    'path'     => PM_WEB_LIFE__DBFILE,
  ),
));

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/../log/development.log',
));

$app['debug'] = true;

/* pages ******************************************************/
/**
 * Get main page
 */
$app->get('/', function() use($app) { 
    return file_get_contents(__DIR__ . '/../views/life.html'); 
}); 


/* API ******************************************************/

/**
 * Save world
 */
$app->post('/save', function( Request $request ) use($app) {
  $id = $request->get('id') ? $request->get('id') : null;
  $w = new PMusic\World($app, $id);
  $w->name = $request->get('name');
  $w->world = $request->get('world');
  if( $w->save() ){
    return 'saved';
  } else {
    return json_encode($w->getValidationErrors());
  }
});

/**
 * Determine if the name is a duplicate. 
 * TODO: might be more efficient to send an array of existing names?
 */
$app->get('/world/checkdupname/{name}', function( $name ) use( $app ) {
  $w = new PMusic\World($app);
  $w->name = $app->escape( $name );
  return $w->duplicateName() ? 't' : 'f';
});

/**
 * Get list of worlds
 * TODO authorization
 */
$app->get('/worldlist', function() use ($app) {
  $w = new PMusic\World($app);
  $list = $w->worldList();
  return json_encode($list);
});


$app->get('/world/{id}', function( $id ) use( $app ) {
  $w = new PMusic\World($app, $id);
  if($w->load() === false){
    return 'no world';
  }
  return $w->world;
  
});

$app->run();
