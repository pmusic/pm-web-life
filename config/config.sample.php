<?php
/*
Sample config file. Copy to the following locations for the corresponding profiles:

development.php for development
test.php for testing
production.php for production
*/
// location of the sqlite file
define('PM_WEB_LIFE__DBFILE', __DIR__.'/../db/pmweblife.db');
// location of the log file
define('PM_WEB_LIFE__LOGFILE', __DIR__.'/../log/development.log');
// salt for password encryption
define('PM_WEB_LIFE__SALT', 'salt_key_here');
