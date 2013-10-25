<?php
require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PMusic\World;
use Assetic\Factory\AssetFactory;
use Assetic\Factory\LazyAssetManager;
use Assetic\FilterManager;
use Assetic\Factory\Worker\CacheBustingWorker;
use Assetic\Extension\Twig\TwigFormulaLoader;
use Assetic\Extension\Twig\TwigResource;
use Assetic\Extension\Twig;
use Assetic\Extension\Asdfjksldfjs;


switch($_SERVER['PM_WEB_LIFE__PROFILE']){
	case 'development':
		require_once( __DIR__.'/../config/development.php');
		break;
	case 'test':
		require_once __DIR__.'/../config/testing.php';
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

$app->register(new Silex\Provider\TwigServiceProvider(), array('twig.path' => __DIR__.'/../views'));

$app->register(new Silex\Provider\SessionServiceProvider());

/*

$factory = new AssetFactory('/assets/');
$am = new LazyAssetManager($factory);
$fm = new FilterManager();

$factory->setAssetManager($am);
$factory->setFilterManager($fm);
$factory->setDebug(true);
$factory->addWorker(new CacheBustingWorker($am));
$app['twig']->addExtension(new AsseticExtension($factory, true));
*/
$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => PM_WEB_LIFE__LOGFILE
));

$app['debug'] = true;

/* pages ******************************************************/
/**
 * Get main page
 */
$app->get('/', function() use($app) { 
//    return file_get_contents(__DIR__ . '/../views/life.html'); 
	return $app['twig']->render('life.twig');
}); 


/* API ******************************************************/

/**
 * Save world
 */
$app->post('/world/save', function( Request $request ) use($app) {
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
/* 
 * User API
 */
$app->post('/user/create', function(Request $request) use ( $app ){
	$u = new PMusic\User($app);
	$u->setPassword($request->get('password'));
	$u->setUsername($request->get('username'));
	$u->email = $request->get('email');
	
	if( $u->save() ){
		return 'created';
	} else {
		return json_encode($u->validation_errors);
	}
});

$app->post('/user/login', function (Request $request) use ($app){
	$u = new PMusic\User($app);
	$u->setPassword($request->get('password'));
	$u->setUsername($request->get('username'));
});

$app->run();