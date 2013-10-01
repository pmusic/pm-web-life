<?
require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
  
  $sql = 'INSERT INTO WORLDS (name, world_json) VALUES(?, ?)';
  $stmt = $app['db']->prepare( $sql );
  $stmt->bindValue( 1, $request->get('name') );
  $stmt->bindValue( 2, $request->get('grid') );
  $stmt->execute();

  return "Saved? " . $request->get('name') . ":" . $request->get('grid');
});

$app['debug'] = true;
$app->run();
?>
