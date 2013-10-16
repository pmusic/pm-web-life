<?
$loader = require_once __DIR__.'/../vendor/autoload.php';

use Silex\WebTestCase;


class AppTest extends WebTestCase
{
  public function createApplication(){
    require '../web/index.php';
    return $app;
  } 
  
  function testIndex(){
    $client = $this->createClient();
    $crawler = $client->request('GET', '/');

    $this->assertTrue($client->getResponse()->isOk());
    $this->assertCount(1, $crawler->filter('div[id="game"]'));
  }
}
?>