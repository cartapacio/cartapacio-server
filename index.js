'use strict';

var restify = require('restify'),
  Datastore = require('nedb'),
  chalk = require('chalk')

// server config
var server = restify.createServer({
  name: 'cartapacio'
})
server.use(restify.bodyParser({ mapParams: false }))
server.use(restify.CORS({
  origins: ['*'],
  credentials: true,
  headers: ['Access-Control-Allow-Origin:*', 'Access-Control-Allow-Methods:POST']
}))
server.use(restify.fullResponse())
server.use(restify.queryParser());


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
var get = require('./routes/get')
var del = require('./routes/delete')

// router
server.post('/doc', post)
server.get('/doc', get)
server.del('/doc/:id', del)

server.listen(PORT, function() {
  console.log( chalk.green(server.name + ' started @ ' + server.url) )
});
