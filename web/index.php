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

// definitions

$app->get('/', function() use($app) { 
    return file_get_contents(__DIR__ . '/../views/life.html'); 
}); 

$app->post('/save', function( Request $request ) use($app) {
  $w = new PMusic\WorldManager($app);
  $w->loadFromJSON( $request->get('name'), $request->get('json') );
  return $w->save();
});

$app['debug'] = true;
$app->run();
?>
