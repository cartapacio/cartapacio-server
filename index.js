'use strict';

var restify = require('restify'),
  Datastore = require('nedb'),
  path = require('path'),
  fs = require('fs-extra'),
  chalk = require('chalk')

function Server (port, database) {
  this.PORT = port || 31173
  this.DB_NAME = database || 'cartapacio_db'
}

Server.prototype.bootstrap = function() {
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


  // // config
  // var PORT = 31173,
  //   DB_NAME = 'cartapacio_db'

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
    { filename: path.join(global.folder, this.DB_NAME),
    autoload: true}
  )

  //routes
  var post = require('./routes/post'),
    get = require('./routes/get'),
    del = require('./routes/delete'),
    put = require('./routes/put'),
    explorer = require('./routes/explorer')


  // router
  server.post('/doc', post)
  server.get('/doc', get)
  server.del('/doc/:id', del)
  server.put('/doc/:id', put)

  server.get(/^\/explorer\/(.*)/, explorer)

  // static files
  server.get(/\/static\/?.*/, restify.serveStatic({
    directory: path.relative(__dirname, global.folder)
  }))

  server.listen(this.PORT, function() {
    console.log( chalk.green(server.name + ' started @ ' + server.url) )
  })
}

module.exports = Server
