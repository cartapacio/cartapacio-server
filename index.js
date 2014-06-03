'use strict';

var restify = require('restify'),
  path = require('path'),
  fs = require('fs-extra'),
  chalk = require('chalk')

function Server (port, database) {
  this.PORT = port || 31173
  this.DB_NAME = database || 'cartapacio_db'

  this.bootstrap()
}

Server.prototype.bootstrap = function() {
  // server config
  this.server = restify.createServer({
    name: 'cartapacio'
  })

  this.server.use(restify.bodyParser({ mapParams: false }))
  this.server.use(restify.CORS({
    origins: ['*'],
    credentials: true,
    headers: ['Access-Control-Allow-Origin:*', 'Access-Control-Allow-Methods:POST']
  }))
  this.server.use(restify.fullResponse())
  this.server.use(restify.queryParser());


  // // config
  // var PORT = 31173,
  //   DB_NAME = 'cartapacio_db'

  // user directory
  try{
    var config = require('./localConfig.json')
    console.log( chalk.green('root path: ' + config.path) )
    global.folder = config.path
  } catch (err) {
    throw new Error('config file not found')
  }
    //

  // if directory does not exist will be created
  try{
    fs.lstatSync(global.folder).isDirectory()
  } catch (error) {
    console.log( chalk.yellow('user directory does not exist, creating it ...') )
    fs.mkdirsSync(global.folder);
  }

  //routes
  var post = require('./routes/post'),
    get = require('./routes/get'),
    del = require('./routes/delete'),
    put = require('./routes/put'),
    explorer = require('./routes/explorer'),
    getDbPath = require('./routes/getDbPath'),
    saveDbPath = require('./routes/saveDbPath'),
    build = require('./routes/build'),
    upload = require('./routes/upload')


  // router
  // document management
  this.server.post('/doc', post)
  this.server.get('/doc', get)
  this.server.del('/doc/:id', del)
  this.server.put('/doc/:id', put)

  // configuration
  this.server.get('/dbConfig', getDbPath)
  this.server.post('/dbConfig', saveDbPath)
  this.server.get(/^\/explorer\/(.*)/, explorer)

  // actions
  this.server.get('/build', build)
  this.server.get('/upload', upload)

  // static files
  this.server.get(/\/static\/?.*/, restify.serveStatic({
    directory: path.relative(__dirname, global.folder)
  }))
}

Server.prototype.init = function() {
  var self = this
  this.server.listen(this.PORT, function() {
    console.log( chalk.green(self.server.name + ' started @ ' + self.server.url) )
  })
}

Server.prototype.stop = function() {
   this.server.close()
};

module.exports = Server
