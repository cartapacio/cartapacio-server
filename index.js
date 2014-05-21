'use strict';

var restify = require('restify'),
  Datastore = require('nedb'),
  path = require('path'),
  fs = require('fs-extra'),
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

// user directory
var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
global.folder = path.join(home, 'webpage')

// if directory does not exist will be created
try{
  fs.lstatSync(global.folder).isDirectory()
} catch (error) {
  console.log( chalk.yellow('user directory does not exist, creating it ...') )
  fs.mkdirsSync(global.folder);
}

// database
global.db = new Datastore(
  { filename: path.join(global.folder, DB_NAME),
  autoload: true}
)

//routes
var post = require('./routes/post')
var get = require('./routes/get')
var del = require('./routes/delete')
var put = require('./routes/put')

// router
server.post('/doc', post)
server.get('/doc', get)
server.del('/doc/:id', del)
server.put('/doc/:id', put)

server.listen(PORT, function() {
  console.log( chalk.green(server.name + ' started @ ' + server.url) )
});
