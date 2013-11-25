PM Web Life
=====================

An HTML5/javaScript implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

A work in progress. A version of it is running [here](http://life.planetariummusic.com/).

Features
============================

Implemented
---
- History -- Rewind to the "t=0" state of the world.
- Generate random world.

Partially Implemented
---
- Save/load worlds
- PHPUnit Tests
- Save world

Planned Features
---
- User Authentication and authorization 
- Adjust to different screen sizes/densities
- Stop when world has "died".
- templates for patterns (e.g. various "spaceships", "oscillators", and so on)
- Touch-screen functionality, including:
  - Ability to create sets of live cells by dragging
  - Zoom
- Jasmine tests

Stuff used
=================
- [Silex](http://silex.sensiolabs.org/)
- Icon fonts generated from [IcoMoon](http://icomoon.io/)
- [jQuery](http://jquery.com/)
- [SASS](http://sass-lang.com/)
- [Compass](http://compass-style.org/)

Installation
===========
PHP Dependencies
----
Make sure you have [Composer](http://getcomposer.org/) installed. Then run `composer.phar install` in the home dir to install the dependencies.

Database
---
Right now I'm using SQLite. The database file is db/pmweblife.db; a "starter" version is in the git repository.

Web Server
---
Point your php-enabled webserver to the `web` directory.
