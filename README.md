Backbone with Marionette Skeleton
=================================

Components
----------
* Backbone
* MarionetteJS
* Grunt
* Bower
* Browserify
* SASS compiler
* Coffeescript compiler

How to Install
--------------
1. Install NPM
2. Install Grunt-cli and Bower: `npm install -g grunt-cli` and `npm install -g bower`
3. Using an IDE replace `{:app_name}` with your application name. Characters which are allowd are [A-Za-z_-].
4. Install NPM packages: `npm install`
5. Install SASS compiler: `bundle install`

How to Develop
--------------
If you want to include a new JS modify `bower.js` and run the command `bower install`, then modify `package.json` 
and add that new library in `browser` and `browserify-shim` sections.

How to Start
------------
Import ENV variables and run the connect server: `source config/dev.conf && grunt server`

