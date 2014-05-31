'use strict';

var chalk = require('chalk'),
  Database = require('../database')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ GET dbConfig '  ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  try{
    var config = require('../localConfig.json')
    console.log( chalk.green('root path: ' + config.path) )

    new Database(config.path)

    res.send({status: 200})
  } catch (err) {
    console.log( chalk.red('localConfig not found') )
    res.send({status: 404})
  }

  next()
}
