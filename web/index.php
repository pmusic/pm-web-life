<?
require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PMusic\WorldManager;

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
    'driver'   => 'pdo_sqlite',
    'path'     => __DIR__.'/../db/pmweblife.db',
  ),
));

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/../log/development.log',
));

// definitions

$app->get('/', function() use($app) { 
    return file_get_contents(__DIR__ . '/../views/life.html'); 
}); 

$app->post('/save', function( Request $request ) use($app) {
  $w = new PMusic\WorldManager($app);
  $w->load( $request->get('name'), $request->get('json') );
  return $w->save();
});

/**
 * Determine if the name is a duplicate. 
 * TODO: might be more efficient to send an array of existing names?
 */
$app->get('/checkdup/{name}', function( $name ) use( $app ) {
  $w = new PMusic\WorldManager($app);
  $w->setName( $app->escape( $name ) );
  return $w->checkDuplicateName() ? 't' : 'f';
});

$app['debug'] = true;
$app->run();
?>
