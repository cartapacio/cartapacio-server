'use strict';

var Datastore = require('nedb'),
  path = require('path')

function Database(rootPath){
  global.db = new Datastore(
    { filename: path.join(rootPath, 'cartapacio_db'),
    autoload: true}
  )
}

module.exports = Database

