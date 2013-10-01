PM Web Life
=====================

An HTML5/javaScript implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).


Is currently very much a work in progress. Planned features include:

- Adjust to different screen sizes/densities
- Save/load worlds
- History -- save the states of the world when the play button was pressed.
- Stop when world has "died".
- templates for patterns (e.g. various "spaceships", "oscillators", and so on)
- Touch-screen functionality, including:
  - Ability to create sets of live cells by dragging
  - Zoom

Installation
===========
Make sure you have [Composer](http://getcomposer.org/) installed. Then run `composer.phar install` in the home dir to install the dependencies.

Then just have your php-enabled webserver of choice point to the `web` directory.
