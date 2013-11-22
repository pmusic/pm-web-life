#!/bin/sh
mkdir -p log
touch log/development.log

#create database

#install php dependencies
composer.phar install
