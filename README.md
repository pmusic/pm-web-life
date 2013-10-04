PM Web Life
=====================

An HTML5/javaScript implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

Implemented
---
- History -- Rewind to the "t=0" state of the world.
- Save world

Partially Implemented
---
- Save/load worlds
- PHPUnit Tests

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

Installation
===========
PHP Dependencies
----
Make sure you have [Composer](http://getcomposer.org/) installed. Then run `composer.phar install` in the home dir to install the dependencies.

Database
---
Right now I'm using SQLite. 

Web Server
---
Then just have your php-enabled webserver of choice point to the `web` directory.
