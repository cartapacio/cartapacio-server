'use strict';

var restify = require('restify'),
  Datastore = require('nedb'),
  chalk = require('chalk')

// server config
var server = restify.createServer({
  name: 'cartapacio'
})
server.use(restify.bodyParser({ mapParams: false }));

// config
var PORT = 31173,
  DB_NAME = 'cartapacio_db'

// database
global.db = new Datastore(
  { filename: __dirname + '/' + DB_NAME,
  autoload: true}
)

//routes
var post = require('./routes/post')

// router
server.post('/doc/', post)


server.listen(PORT, function() {
  console.log( chalk.green(server.name + ' started @ ' + server.url) )
});
