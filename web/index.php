<?
require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

// definitions
$app->get('/', function() use($app) { 
    return file_get_contents(__DIR__ . '/../views/life.html'); 
}); 

$app['debug'] = true;
$app->run()
?>
